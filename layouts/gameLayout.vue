<template>
  <v-app style="background-image: url(background.png)">
    <v-content>
      <v-container>
        <div>
          <v-container>
            <v-overlay :absolute="absolute" :value="overlay">
              <v-row>
                <v-col min-width="700px">
                  <v-card cols="12" sm="8" md="4" min-width="650px">
                    <v-card-title align="center" justify="center">GAME OVER</v-card-title>
                    <v-card-text align="center" justify="center">
                      <p class="title">Equipo ganador: {{ win }}</p>
                      <v-simple-table fixed-header height="200px">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">Nombre equipo</th>
                              <th class="text-left">Puntaje</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="team in teams" :key="team.team">
                              <td>{{ team.team }}</td>
                              <td>{{ team.score }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn min-width="100%" rounded color="primary" @click="backTo" dark>Salir</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-overlay>

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
                    <v-simple-table fixed-header height="200px">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Nombre equipo</th>
                            <th class="text-left">Puntaje</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="team in teams" :key="team.team">
                            <td>{{ team.team }}</td>
                            <td>{{ team.score }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>
                <v-avatar color="white" min-width="170" min-height="170">
                  <span class="display-2">00:{{time}}</span>
                </v-avatar>
                <!-- <v-chip class="ma-2" x-large>00:15</v-chip> -->
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-dialog v-model="dialog" scrollable max-width="300px">
          <template v-slot:activator="{ on }">
            <v-btn color="#2196F" nuxt fixed bottom right fab v-on="on">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="title">SALIR DE SALA</v-card-title>

            <v-card-text class="subtitle-2">¿Esta seguro que desea cerrar la sala?</v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="endGame">Salir</v-btn>
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
import { infoTeam } from "../helpers/apiCalls/teams";
var executeFunction;
export default {
  data() {
    return {
      concepto: "En espera...",
      definicion: "En espera...",
      equipo: "En espera...",
      teamCode: "",
      questionCode: "",
      nextTeam: "",
      time: 30,
      teams: [],
      score: "En espera...",
      dialog: false,
      absolute: true,
      overlay: false,
      win: "",
      scoreWin: 0
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
      //this.score = data.data.score;
      for (let i = 0; i < this.teams.length; i++) {
        infoTeam(this.$route.query.codeRoom, this.teams[i].teamId).then(
          response => {
            this.teams[i].score = response.data.data.score;
          }
        );
      }
    });
    // socket.on("timer", data => {
    //   // this.time=data
    // });
    socket.on("sendQuestion", data => {
      this.concepto = data.body.concept;
      this.definicion = data.body.definition;
      this.teamCode = data.currentTeam;
      this.nextTeam = data.nextTeam;
      this.questionCode = data.idQuestion;
      this.teams = data.teams;
      for (let i = 0; i < this.teams.length; i++) {
        infoTeam(this.$route.query.codeRoom, this.teams[i].teamId).then(
          response => {
            this.teams[i].score = response.data.data.score;
          }
        );
      }
    });
    socket.on("gameOver", data => {
      clearInterval(executeFunction);
      socket.emit("changeRoomState", this.$route.query.codeRoom);
      this.winner()
      this.overlay = !this.overlay;
    });
  },
  methods: {
    setTime() {
      let counter = 0;
      executeFunction = setInterval(() => {
        if (counter >= 30) {
          counter = 0;
          this.time = 30;
          let currentCode = this.$route.query.codeRoom;
          socket.emit("getQuestion", {
            roomInfo: [
              currentCode,
              this.teamCode,
              this.questionCode,
              this.nextTeam
            ],
            teams: [...this.teams]
          });
        } else {
          counter++;
          this.time--;
        }
      }, 1000);
    },
    endGame() {
      clearInterval(executeFunction);
      socket.emit("changeRoomState", this.$route.query.codeRoom);
      this.dialog = false;
      this.winner()
      this.overlay = !this.overlay;
    },
    burbleSort() {
      let auxTeams = [...this.teams];
      for (var i = 1; i < auxTeams.length; i++) {
        for (var j = 0; j < auxTeams.length - i; j++) {
          if (auxTeams[j].score > auxTeams[j + 1].score) {
            let k = auxTeams[j + 1];
            auxTeams[j + 1] = auxTeams[j];
            auxTeams[j] = k;
            console.log("Cambiando men");
          }
        }
      }
      console.log(auxTeams);
      this.teams = auxTeams;
    },
    backTo() {
      this.overlay = false;
      this.$router.push(`/room`);
    },
    sort() {
      let array = [...this.teams]
      let mapped = array.map(function(el, i) {
        return { index: i, value: el.score };
      });

      mapped.sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        }
        if (a.value < b.value) {
          return -1;
        }
        return 0;
      });

      var result = mapped.map(function(el) {
        return array[el.index];
      });

      result.reverse();
      this.teams = result
    },
    winner(){
      this.teams.forEach(team => {
        if(team.score>this.scoreWin){
          this.scoreWin = team.score
          this.win = team.team
        }
      });
    }
  }
};
</script>
