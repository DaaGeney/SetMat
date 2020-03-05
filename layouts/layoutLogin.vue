<template>
  <v-app id="app">
    <v-content>
      <v-snackbar v-model="snackbar" top color="error" :timeout="3000">
        {{
        textSnackbar
        }}
      </v-snackbar>
      <v-snackbar v-model="snackbarSuccess" top color="success" :timeout="3000">{{ textSnackbar }}</v-snackbar>

      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>¡Hola, profe!</v-toolbar-title>
               
                <v-spacer />
              </v-toolbar>
               <v-progress-linear
                  :active="loading"
                  :indeterminate="loading"
                  absolute
                  bottom
                  color="primary"
                ></v-progress-linear>

              <v-card-text>
                <v-form ref="form" v-if="!register" v-model="valid" lazy-validation>
                  <v-text-field
                    id="emailLogin"
                    label="Correo electronico"
                    name="emailLogin"
                    prepend-icon="email"
                    type="email"
                    :rules="emailRules"
                    v-model="emailLogin"
                    required
                  />

                  <v-text-field
                    id="passwordLogin"
                    label="Contraseña"
                    name="passwordLogin"
                    prepend-icon="lock"
                    type="password"
                    v-model="passwordLogin"
                    :rules="passwordRules"
                    required
                  />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="register = true" text>¿No estás registrado?</v-btn>

                    <v-btn
                      rounded
                      color="primary"
                      :disabled="!valid"
                      @click="validate"
                    >Iniciar sesion</v-btn>
                  </v-card-actions>
                </v-form>
                <v-form v-else ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    id="name"
                    label="Nombre"
                    name="name"
                    prepend-icon="person"
                    type="text"
                    :rules="nameRules"
                    v-model="name"
                    required
                  />

                  <v-text-field
                    id="email"
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
                    <v-btn color="primary" @click="register = false" text>Estoy registrado</v-btn>

                    <v-btn
                      rounded
                      color="primary"
                      :disabled="!valid"
                      @click="registerUser"
                    >Registrar</v-btn>
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
import { logIn, registerNewUser } from "../helpers/apiCalls/users";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  data() {
    return {
      textSnackbar: "",
      loading:false,
      name: "",
      register: false,
      snackbar: false,
      snackbarSuccess: false,
      valid: false,
      email: "",
      password: "",
      emailLogin: "",
      passwordLogin: "",
      emailRules: [
        v => !!v || "Correo electronico necesario",
        v => /.+@.+\..+/.test(v) || "Correo invalido"
      ],
      passwordRules: [
        v => !!v || "Contraseña necesario",
        v => (v && v.length >= 6) || "Contraseña demasiado corta"
      ],
      nameRules: [v => !!v || "Nombre necesario"]
    };
  },
  props: {
    source: String
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.loading=true
        let params = { email: this.emailLogin, password: this.passwordLogin };

        logIn(params)
          .then(response => {
            const auth = response.data.token;
            const id = response.data.data._id;
            this.$store.commit("setAuth", auth);
            this.$store.commit("setId", id); // mutating to store for client rendering
            Cookie.set("auth", auth); // saving token in cookie for server rendering
            Cookie.set("id", id); // saving token in cookie for server rendering
            this.loading=false
            this.$router.push("/");
          })
          .catch(error => {
            this.loading=false
            this.textSnackbar = "El usuario o contraseña es incorrecto";
            this.snackbar = true;
            (this.name = ""), (this.password = "");
            this.email = "";
          });
      }
    },
    registerUser() {
      if (this.$refs.form.validate()) {
        let params = {
          name: this.name,
          email: this.email,
          password: this.password
        };
        registerNewUser(params)
          .then(response => {
            this.snackbarSuccess = true;
            this.textSnackbar = "Registro correcto";
            this.snackbarSuccess = true;

            this.register = false;
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