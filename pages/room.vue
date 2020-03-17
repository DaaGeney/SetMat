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
                <v-text-field
                  label="Categoria"
                  v-model="category"
                  outlined
                  :rules="categoryRules"
                  required
                  shaped
                ></v-text-field>
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
import { retrieveConcepts } from "../helpers/apiCalls/concepts";
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
      categoryRules: [v => !!v || "Debe digitar categoria"],
      snackbar: false,
      textSnackbar:""
    };
  },

  mounted() {
    /**
     * Listerners for the sockets
     */
    socket.on("main", data => {
      console.log(data, "llamado");
    });
    socket.on("getWebTeams", data => {
      this.teamsRoom = data.teams;
    });

    socket.on("timer", data => {
      console.log(data);
    });
  },
  methods: {
    createUniqueRoom() {
      if (this.$refs.form.validate()) {
        createRoom({ category: this.category })
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
      }else{
        this.textSnackbar="Se necesitan al menos dos equipos para poder jugar"
        this.snackbar=true
      }
    }
  }
};
</script>
