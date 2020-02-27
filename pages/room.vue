<template>
  <v-app>
    <v-content>
      <v-card>
        <v-card-title class="font-weight-black">CREAR SALA</v-card-title>
        <v-spacer />
        <v-row align="center" justify="center">
          <v-col cols="11" sm="11">
            <v-text-field label="Categoria" outlined shaped></v-text-field>
            <v-btn min-width="100%" rounded color="primary" dark>Crear sala</v-btn>
          </v-col>
        </v-row>
      </v-card>
     
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
    return {};
  },
  created() {
    /**
     * Listerners for the sockets
     */
    socket.on("main", data => {
      console.log(data, "llamado");
    });

    socket.on("getWebTeams", data => {
      console.log(data);
    });
  },
  methods: {
    createUniqueRoom() {
      createRoom({ category: "holi" })
        .then(response => {
          console.log(response);
        })
        .catch(err => alert(err));
    }
  }
};
</script>
