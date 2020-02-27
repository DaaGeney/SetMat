<template>
  <v-app>
    <v-content>
      <v-container>
        <v-card elevation="10">
          <v-card-title class="font-weight-black">CREAR SALA</v-card-title>

          <v-row align="center" justify="center">
            <v-col cols="11" sm="11">
              <v-text-field label="Categoria" v-model="category" outlined shaped></v-text-field>
              <v-btn
                min-width="100%"
                rounded
                color="primary"
                dark
                @click="createUniqueRoom"
              >Crear sala</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
      <v-container>
        <v-card elevation="10">
          <v-row align="center" justify="center">
            <v-col cols="11" sm="11">
              <div class="text-center">
                <p>El codigo de la sala es:</p>

                <p class="display-2">{{codeRoom}}</p>
              </div>
              <v-simple-table height="300px">
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
const socket = io(url);

export default {
  middleware: "authenticated",
  data() {
    return {
      codeRoom: "",
      teamsRoom: "",
      category: ""
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
  },
  methods: {
    createUniqueRoom() {
      createRoom({ category: this.category })
        .then(response => {
          this.codeRoom = response.data.data.uniqueCode;
        })
        .catch(err => alert(err));
    },
  }
};
</script>
