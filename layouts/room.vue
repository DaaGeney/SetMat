<template>
  <v-app>
    <v-content>
      <h1>Title vue</h1>
      <button @click="createUniqueRoom">Create room</button>
    </v-content>
  </v-app>
</template>
<script>
import io from "socket.io-client";
import { url } from "../config";
import { createRoom } from "../helpers/apiCalls/rooms";

const socket = io(url);

export default {
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
      createRoom({ category: "pollo" })
        .then(response => {
          console.log(response);
        })
        .catch(err => alert(err));
    }
  }
};
</script>
