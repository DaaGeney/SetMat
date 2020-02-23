<template>
  <v-app id="app">
    <v-content>
      
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>¡Hola, profe!</v-toolbar-title>
                <v-spacer />
              </v-toolbar>

              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    label="Correo electronico"
                    name="email"
                    prepend-icon="person"
                    type="email"
                    :rules="emailRules"
                    v-model="email"
                    required
                  />

                  <v-text-field
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="password"
                    :rules="passwordRules"
                    required
                  />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" :disabled="!valid" @click="validation">Iniciar sesion</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      emailRules: [
        v => !!v || "Correo electronico necesario",
        v => /.+@.+\..+/.test(v) || "Correo invalido"
      ],
      passwordRules: [v => !!v || "Contraseña necesaria"]
    };
  },
  props: {
    source: String
  },
  methods: {
    validation() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
        let params = { email: this.email, password: this.password };
        axios
          .post("https://socket-udem.herokuapp.com/user/login", params)
          .then(response => {
            const auth = response.data.token;
            const id = response.data.data._id;
            this.$store.commit("setAuth", auth);
            this.$store.commit("setId", id); // mutating to store for client rendering
            Cookie.set("auth", auth); // saving token in cookie for server rendering
            Cookie.set("id", id); // saving token in cookie for server rendering
            this.$router.push("/inspire");
          })
          .catch(error => {
            console.log(error.response);
          });
      }
    }
  }
};
</script>