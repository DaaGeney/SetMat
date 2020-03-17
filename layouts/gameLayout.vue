<template>
  <v-app style="background-image: url(background.png)">
    <v-content>
      <v-container>
        <div>
          <v-container>
            <v-row style="height: 130px" no-gutters>
              <v-col align="center" justify="center">
                <v-card cols="12" sm="8" md="4" min-height="90%">
                  <v-card-title class="font-weight-black">Concepto</v-card-title>
                  <v-card-text class="display-1">{{ concepto }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row style="height: 310px">
              <v-col justify="center">
                <v-card cols="12" sm="8" md="4" min-height="95%">
                  <v-card-title class="font-weight-black">Definicion</v-card-title>
                  <v-card-text class="display-1">{{ definicion }}</v-card-text>
                </v-card>
              </v-col>
              <v-col align="center">
                <v-col>
                  <v-card cols="12" sm="8" md="4" min-height="40%">
                    <v-card-title class="font-weight-black">Equipo</v-card-title>
                    <v-card-text class="display-1">Puntaje: {{ score }}</v-card-text>
                  </v-card>
                </v-col>
                <v-avatar color="white" min-width="170" min-height="170">
                  <span class="display-2">00:15</span>
                </v-avatar>
                <!-- <v-chip class="ma-2" x-large>00:15</v-chip> -->
              </v-col>
            </v-row>
          </v-container>
        </div>

        <v-dialog v-model="dialog" scrollable max-width="300px">
          <template v-slot:activator="{ on }">
            <v-btn color="#2196F" nuxt fixed bottom right fab v-on="on"  >
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          
          </template>
          <v-card>
            <v-card-title class="title">SALIR DE SALA</v-card-title>
            
            <v-card-text class="subtitle-2">
            ¿Esta seguro que desea cerrar la sala? 
            </v-card-text>
            
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="endGame"  >Salir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import io from "socket.io-client";
import { url } from "../config";
const socket = io(url);
import infoTeam from "../helpers/apiCalls/teams";
export default {
  data() {
    return {
      concepto: "En espera...",
      definicion: "En espera...",
      equipo: "En espera...",
      teamCode: "",
      questionCode: "",
      nextTeam: "",
      time: "15",
      teams: [],
      score: "En espera...",
   
      dialog: false
    };
  },
  mounted() {
    
    this.setTime();
    socket.on("main", data => {
      console.log(data, "llamado");
    });
     socket.on("changeRoomStateRes", data => {
      console.log(data, "estado");
    });
    socket.on("sendScore", data => {
      this.score = data.data.score;
    });
    // socket.on("timer", data => {
    //   // this.time=data
    // });
    socket.on("sendQuestion", data => {
      console.log(data);
      this.concepto = data.body.concept;
      this.definicion = data.body.definition;
      this.teamCode = data.currentTeam;
      this.nextTeam = data.nextTeam;
      this.questionCode = data.idQuestion;
      this.teams = data.teams;
    });
  },
  methods: {
    setTime() {
      setInterval(() => {
        let currentCode = window.location.search.split("=")[1];
        socket.emit("getQuestion", {
          roomInfo: [
            currentCode,
            this.teamCode,
            this.questionCode,
            this.nextTeam
          ],
          teams: [...this.teams]
        });
      }, 15000);
    },
     endGame() {
      socket.emit("changeRoomState", this.$route.query.codeRoom );
      this.$router.push(`/room`);
    }
  }
};
</script>
