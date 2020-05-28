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
                <v-toolbar-title>Reestablecer contraseña</v-toolbar-title>
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
                <v-form ref="form" v-on:submit.prevent="restore" v-model="valid" lazy-validation>
                  <v-text-field
                    id="key"
                    label="Nueva contraseña"
                    name="key"
                    prepend-icon="mdi-key"
                    type="password"
                    :rules="passwordRules"
                    v-model="key"
                    required
                  />
                  <v-text-field
                    id="confirmKey"
                    label="Verificar contraseña"
                    name="verifyKey"
                    prepend-icon="mdi-key-change"
                    type="password"
                    v-model="verifyKey"
                    :rules="passwordRules"
                    required
                  />

                  <v-card-actions>
                    <v-spacer />
                    <v-row>
                      <v-col>
                        <v-btn rounded color="primary" :disabled="!valid" type="submit">Reestablecer</v-btn>
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
import { changePassword } from "../helpers/apiCalls/users";
export default {
  middleware: "notAuthenticated",
  data() {
    return {
      valid: false,
      loading: false,
      snackbar: false,
      snackbarSuccess: false,
      textSnackbar: "",
      key: "",
      verifyKey: "",
      passwordRules: [
        v => !!v || "Contraseña necesaria",
        v => (v && v.length >= 6) || "Contraseña demasiado corta"
      ]
    };
  },
  methods: {
    restore: function() {
      if (this.$refs.form.validate()) {
        if (this.key === this.verifyKey) {
          this.loading = true;
          let data = {
            email: this.$route.query.user.replace("%40", "@"),
            newPassword: this.verifyKey
          };
          let config = {
            headers: { authorization: this.$route.query.token }
          };
          changePassword(data, config)
            .then(response => {
              if (response.data.status) {
                this.textSnackbar = "Contraseña restaurada correctamente";
                this.snackbarSuccess = true;
                this.$router.push(`/login`);
                this.$refs.form.reset();
                this.loading = false;
              } else {
                this.textSnackbar =
                  "No eres tú, somos nosotros. Intenta más tarde.";
                this.snackbar = true;
                this.loading = false;
              }
            })
            .catch(error => {
              this.textSnackbar = error;
              this.snackbar = true;
            });
        } else {
          this.textSnackbar = "Los campos no coinciden";
          this.snackbar = true;
        }
      } else {
        this.textSnackbar = "Faltan campos por digitar";
        this.snackbar = true;
      }
    }
  }
};
</script>
