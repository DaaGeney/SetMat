<template>
  <v-app id="inspire">
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
                <v-form ref="form" v-if="!autenticado" v-model="valid" lazy-validation>
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
                    <v-btn
                      color="primary"
                      type="submit"
                      :disabled="!valid || prueba=='melo2'"
                      @click="validation"
                    >Iniciar sesion</v-btn>
                  </v-card-actions>
                </v-form>
                <v-form v-else></v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      autenticado: false,
      prueba: "melo",
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
    async validation() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
        try {
          const state = await axios.post("https://socket-udem.herokuapp.com/user/login", {
            email: this.email,
            password: this.password
          })
           alert("Entro en teoria")
        } catch (error) {
          alert(error)
          throw error;
        }

        this.autenticado = true;
      }
    }
  }
};
</script>