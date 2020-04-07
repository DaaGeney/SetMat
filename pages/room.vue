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
                  no-data-text="No se encuentran categorias"
                  v-model="category"
                  required
                  :rules="categoryRules"
                  label="Tematica"
                ></v-autocomplete>

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
import { getSubjects } from "../helpers/apiCalls/categories";
const Cookie = process.client ? require("js-cookie") : undefined;
const socket = io(url);

export default {
  middleware: "authenticated",
  data() {
    return {
      roomCreated: false,
      startRoom: false,
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

    getSubjects(this.config)
      .then(response => {
        console.log(response.data.data);
        this.items = response.data.data;
      })
      .catch(error => {
        alert(error);
      });

    // socket.on("timer", data => {
    //   console.log(data);
    // });
  },
  methods: {
    createUniqueRoom() {
      if (this.$refs.form.validate()) {
        let categoryTemp = {category: this.category }
        createRoom(categoryTemp,this.config)
          .then(response => {
            this.startRoom = true;
            this.codeRoom = response.data.data.uniqueCode;
            this.roomCreated = true;
            this.teamsRoom = {};
          })
          .catch(err => alert(err));
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
