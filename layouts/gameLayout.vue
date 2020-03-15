<template>
  <v-app
    style="
    
    background: linear-gradient(to right, #64b1ec, #171be1, #090ca5);
  "
  >
    <v-content>
      <v-container>
        <v-form>
          <v-container>
            <v-row style="height: 130px" no-gutters>
              <v-col align="center" justify="center">
                <v-card cols="12" sm="8" md="4" min-height="90%">
                  <v-card-title class="font-weight-black"
                    >Concepto</v-card-title
                  >
                  <v-card-text class="display-1">{{ concepto }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row style="height: 310px">
              <v-col justify="center">
                <v-card cols="12" sm="8" md="4" min-height="95%">
                  <v-card-title class="font-weight-black"
                    >Definicion</v-card-title
                  >
                  <v-card-text class="display-1">{{ definicion }}</v-card-text>
                </v-card>
              </v-col>
              <v-col align="center">
                <v-col>
                  <v-card cols="12" sm="8" md="4" min-height="40%">
                    <v-card-title class="font-weight-black"
                      >Equipo</v-card-title
                    >
                  </v-card>
                </v-col>
                <v-chip class="ma-2" x-large>00:{{ time }}</v-chip>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-btn color="#2196F" nuxt dark fixed bottom right fab to="/room">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import io from "socket.io-client";
import { url } from "../config";
const socket = io(url);
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
      teams: []
    };
  },
  mounted() {
    this.setTime();
    socket.on("main", data => {
      console.log(data, "llamado");
    });
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
    }
  }
};
</script>
