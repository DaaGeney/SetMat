<template>
  <v-app>
    <v-content>
      <v-container>
        <v-snackbar v-model="snackbar" top color="error" :timeout="3000">{{ textSnackbar }}</v-snackbar>
        <v-card elevation="10" v-if="!roomCreated">
          <v-card-title class="font-weight-black">CREAR SALA</v-card-title>
          <v-row align="center" justify="center">
            <v-col cols="11" sm="11">
              <v-form ref="form" v-on:submit.prevent="createUniqueRoom" lazy-validation>
               
                  <v-autocomplete
                  :items="items"
                  no-data-text="No se encuentran tematicas"
                  v-model="category"
                  required
                  :rules="categoryRules"
                  label="Tematica"
                  prepend-icon="mdi-format-list-checks"
                ></v-autocomplete>
              
                
                <v-text-field
                  width="2opx"
                  id="quantity"
                  label="Cantidad máxima equipos"
                  name="quantity"
                  prepend-icon="mdi-account-multiple"
                  type="number"
                  :rules="nameRules"
                  v-model="numberTeams"
                  required
                  min="2"
                  max="6"
                />
                <v-card-actions>
                  <v-btn min-width="100%" rounded color="primary" dark type="submit">Crear sala</v-btn>
                </v-card-actions>
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
      <v-container>
        <v-card elevation="10" v-if="roomCreated">
          <v-row align="center" justify="center">
            <v-col cols="11" sm="11">
              <div class="text-center">
                <p>El codigo de la sala es:</p>
                <p class="display-2">{{ codeRoom }}</p>
              </div>
              <v-simple-table fixed-header height="200px">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Nombre equipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="team in teamsRoom" :key="team.team">
                      <td>{{ team.team }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-btn
                style="margin-bottom: 20px;"
                min-width="100%"
                rounded
                color="primary"
                @click="startGame"
              >Empezar juego</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import io from "socket.io-client";
import { url } from "../config";
import { createRoom } from "../helpers/apiCalls/rooms";
import { getAllSubjects } from "../helpers/apiCalls/subjects";
const Cookie = process.client ? require("js-cookie") : undefined;
const socket = io(url);

export default {
  middleware: "authenticated",
  data() {
    return {
      roomCreated: false,
      numberTeams: 2,
      startRoom: false,
      nameRules: [v => !!v || "Nombre necesario"],
      teamsRoom: "",
      roomExists: false,
      category: "",
      categoryRules: [v => !!v || "Debe seleccionar categoria"],
      snackbar: false,
      textSnackbar: "",
      items: [],
      config: ""
    };
  },
  mounted() {
    /**
     * Listerners for the sockets
     */
    this.config = {
      headers: { Authorization: Cookie.get("auth") }
    };
    socket.on("main", data => {
      console.log(data, "llamado");
    });
    socket.on("getWebTeams", data => {
      this.teamsRoom = data.teams;
    });

    getAllSubjects(this.config)
      .then(response => {
        response.data.data.forEach(element => {
          this.items.push(element.subject);
        });
      })
      .catch(error => {});
  },
  methods: {
    createUniqueRoom() {
      if (this.$refs.form.validate()) {
        if (this.numberTeams >= 2 && this.numberTeams <= 6) {
          let categoryTemp = {
            category: this.category,
            numMax: this.numberTeams
          };
          createRoom(categoryTemp, this.config)
            .then(response => {
              this.startRoom = true;
              this.codeRoom = response.data.data.uniqueCode;
              this.roomCreated = true;
              this.teamsRoom = {};
            })
            .catch(err => alert(err));
        } else {
          this.textSnackbar = "El numero maximo de equipos es 6";
          this.snackbar = true;
        }
      }
    },
    startGame() {
      if (this.teamsRoom.length > 1) {
        socket.emit("startGame", { codeRoom: this.codeRoom });
        this.$router.push(`/game?codeRoom=${this.codeRoom}`);
      } else {
        this.textSnackbar =
          "Se necesitan al menos dos equipos para poder jugar";
        this.snackbar = true;
      }
    }
  }
};
</script>
