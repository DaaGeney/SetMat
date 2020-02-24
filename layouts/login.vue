<template>
  <v-app id="app">
    <v-content>
      <v-snackbar v-model="snackbar" top color="error" :timeout="3000">{{ textSnackbar }}</v-snackbar>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>¡Hola, profe!</v-toolbar-title>
                <v-spacer />
              </v-toolbar>

              <v-card-text>
                <v-form ref="form" v-if="!register" v-model="valid" lazy-validation>
                  <v-text-field
                    label="Correo electronico"
                    name="email"
                    prepend-icon="email"
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
                    <v-btn color="primary" @click="register=true" text>¿No estás registrado?</v-btn>

                    <v-btn color="primary" :disabled="!valid" @click="validation">Iniciar sesion</v-btn>
                  </v-card-actions>
                </v-form>
                <v-form v-else ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    label="Nombre"
                    name="name"
                    prepend-icon="person"
                    type="text"
                    :rules="nameRules"
                    v-model="name"
                    required
                  />

                  <v-text-field
                    label="Correo electronico"
                    name="email"
                    prepend-icon="email"
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
                    <v-btn color="primary" @click="register=false" text>Estoy registrado</v-btn>

                    <v-btn color="primary" :disabled="!valid" @click="registerUser">Registrar</v-btn>
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
      textSnackbar: '',
      name:'',
      register: false,
      snackbar: false,
      valid: false,
      email: "",
      password: "",
      emailRules: [
        v => !!v || "Correo electronico necesario",
        v => /.+@.+\..+/.test(v) || "Correo invalido"
      ],
      passwordRules: [v => !!v || "Contraseña necesario"],
      nameRules:[v => !!v || "Nombre necesaria"],
    };
  },
  props: {
    source: String
  },
  methods: {
    validation() {
      if (this.$refs.form.validate()) {
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
            this.$router.push("/");
          })
          .catch(error => {
            console.log(error.response);
            this.textSnackbar = "El usuario o contraseña es incorrecto";
            this.snackbar = true;
            this.name='',
            this.password=''
            this.email=''
          });
      }
    },
    registerUser(){
      if (this.$refs.form.validate()) {
        let params = { name: this.name, email: this.email, password: this.password };
        axios
          .post("https://socket-udem.herokuapp.com/user/createUser", params)
          .then(response => {
            this.textSnackbar = "registro correcto";
            this.snackbar = true;
            this.register=false
          })
          .catch(error => {
            this.textSnackbar = error.response.data.message;
            this.snackbar = true;
          });
      
      }
    }
  }
};
</script>