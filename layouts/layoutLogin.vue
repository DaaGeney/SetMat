<template>
  <v-app id="app">
    <v-content>
      <v-snackbar v-model="snackbar" top color="error" :timeout="3000">{{ textSnackbar }}</v-snackbar>
      <v-snackbar v-model="snackbarSuccess" top color="success" :timeout="3000">{{ textSnackbar }}</v-snackbar>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5" xs="6">
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
                <v-form
                  ref="form"
                  v-if="!register"
                  v-on:submit.prevent="validate"
                  v-model="valid"
                  lazy-validation
                >
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
                    <v-row>
                      <v-col>
                        <v-btn color="primary" @click="change" text>¿No estás registrado?</v-btn>
                      </v-col>
                      <v-col>
                        <v-btn
                          rounded
                          color="primary"
                          :disabled="!valid"
                          type="submit"
                        >Iniciar sesion</v-btn>
                      </v-col>
                      <v-col align="center" justify="center">
                        <div class="text-center">
                          <v-dialog v-model="dialog" persistent width="500">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                class="caption"
                                color="primary"
                                v-on="on"
                                text
                              >Olvidé mi contraseña</v-btn>
                            </template>

                            <v-form
                              ref="formRestore"
                              v-on:submit.prevent="restorePassword"
                              lazy-validation
                            >
                              <v-card>
                                <v-card-title
                                  class="headline grey lighten-2"
                                  primary-title
                                >Restaurar Contraseña</v-card-title>

                                <v-card-text>
                                  <v-text-field
                                    id="emailRestore"
                                    label="Correo electronico"
                                    name="RestoreEmail"
                                    prepend-icon="email"
                                    type="email"
                                    :rules="emailRules"
                                    v-model="restoreEmail"
                                    required
                                  />
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
                                  <v-btn color="blue darken-1" text type="submit">Restaurar</v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-form>
                          </v-dialog>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-form>
                <v-form
                  v-else
                  ref="form"
                  v-model="valid"
                  v-on:submit.prevent="registerUser"
                  lazy-validation
                >
                  <div>
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
                  </div>

                  <v-card-actions>
                    <v-spacer />
                    <v-row>
                      <v-col>
                        <v-btn color="primary" @click="change" text>Estoy registrado</v-btn>
                      </v-col>
                      <v-col>
                        <v-btn rounded color="primary" :disabled="!valid" type="submit">Registrar</v-btn>
                      </v-col>
                    </v-row>
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
import { logIn, registerNewUser, sendEmail } from "../helpers/apiCalls/users";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  mounted() {},
  data() {
    return {
      dialog: false,
      textSnackbar: "",
      loading: false,
      restoreEmail: "",
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
        this.loading = true;
        let params = { email: this.emailLogin, password: this.passwordLogin };

        logIn(params)
          .then(response => {
            const auth = response.data.token;
            const id = response.data.data._id;
            this.$store.commit("setAuth", auth);
            this.$store.commit("setId", id); // mutating to store for client rendering
            Cookie.set("auth", auth); // saving token in cookie for server rendering
            Cookie.set("id", id); // saving token in cookie for server rendering
            this.loading = false;
            this.$refs.form.reset();
            this.$router.push("/");
          })
          .catch(error => {
            this.loading = false;
            this.textSnackbar = "El usuario o contraseña es incorrecto";
            this.snackbar = true;
          });
      }
    },
    registerUser() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        let params = {
          name: this.name,
          email: this.email,
          password: this.password
        };
        registerNewUser(params)
          .then(response => {
            this.textSnackbar = "Registro correcto";
            this.snackbarSuccess = true;
            this.loading = false;
            this.register = false;
            this.$refs.form.reset();
          })
          .catch(error => {
            this.textSnackbar = error.response.data.message;
            this.snackbar = true;
            this.loading = false;
          });
      }
    },
    change() {
      this.$refs.form.reset();
      this.register ? (this.register = false) : (this.register = true);
    },
    restorePassword: function() {
      if (this.$refs.formRestore.validate()) {
        sendEmail({ email: this.restoreEmail })
          .then(response => {
            this.textSnackbar = response.data.message;
            this.snackbarSuccess = true;
            this.$refs.formRestore.reset();
            this.dialog = false;
          })
          .catch(error => {
            this.textSnackbar = "Error interno, intenta mas tarde";
            this.snackbar = true;
          });
      } else {
        this.textSnackbar = "Digite un email válido";
        this.snackbar = true;
      }
    }
  }
};
</script>
