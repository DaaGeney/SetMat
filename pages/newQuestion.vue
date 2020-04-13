<template>
  <v-app>
    <v-content>
      <v-container>
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          bottom
          color="primary"
        ></v-progress-linear>
        <v-row justify="center">
          <v-snackbar v-model="snackbar" top color="error" :timeout="3000">{{ textSnackbar }}</v-snackbar>
          <v-snackbar
            v-model="snackbarSuccess"
            top
            color="success"
            :timeout="2500"
          >{{ textSnackbar }}</v-snackbar>
          <v-form v-on:submit.prevent="create" lazy-validation ref="form">
            <v-card>
              <v-card-title>
                <span class="headline">CONCEPTO Y CATEGORIAS</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-btn icon>
                        <v-icon color="grey lighten-1">mdi-information</v-icon>
                      </v-btn>
                      <small dense>Digite el nombre de una nueva tematica o selecciona una existente</small>
                      <v-combobox
                        v-model="subject"
                        :items="items"
                        label="Tematica *"
                        :rules="nameRules"
                        required
                        outlined
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="concept"
                        :rules="nameRules"
                        label="Concepto *"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="definition"
                        auto-grow
                        label="Definición *"
                        rows="1"
                        :rules="nameRules"
                        required
                        outlined
                      ></v-textarea>
                      <v-subheader class="title">Categorias</v-subheader>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="category1"
                        auto-grow
                        label="Categoria 1*"
                        rows="1"
                        :rules="nameRules"
                        required
                        outlined
                      ></v-textarea>
                      <v-textarea
                        v-model="category2"
                        auto-grow
                        label="Categoria 2*"
                        rows="1"
                        :rules="nameRules"
                        required
                        outlined
                      ></v-textarea>
                      <v-textarea
                        v-model="category3"
                        auto-grow
                        label="Categoria 3*"
                        rows="1"
                        :rules="nameRules"
                        required
                        outlined
                      ></v-textarea>
                      <v-textarea
                        v-model="category4"
                        auto-grow
                        label="Categoria 4*"
                        rows="1"
                        :rules="nameRules"
                        required
                        outlined
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-subheader>Seleccione la categoria correcta</v-subheader>
                  <v-radio-group v-model="radio" mandatory row>
                    <v-radio label="Categoria 1" value="radio-1"></v-radio>
                    <v-radio label="Categoria 2" value="radio-2"></v-radio>
                    <v-radio label="Categoria 3" value="radio-3"></v-radio>
                    <v-radio label="Categoria 4" value="radio-4"></v-radio>
                  </v-radio-group>
                </v-container>
                <small>*Campos obligatorios</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="exit">Cancelar</v-btn>
                <v-btn color="blue darken-1" text type="submit">Crear</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { createCategory } from "../helpers/apiCalls/categories";
import { getSubjects } from "../helpers/apiCalls/categories";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  middleware: "authenticated",
  data() {
    return {
      items: [],
      subject: "",
      definition: "",
      concept: "",
      category1: "",
      category2: "",
      category3: "",
      category4: "",
      radio: "",
      nameRules: [v => !!v || "Campo necesario"],
      config: "",
      snackbar: "",
      snackbarSuccess: "",
      loading: false,
      textSnackbar: ""
    };
  },
  mounted() {
    this.config = {
      headers: { authorization: Cookie.get("auth") }
    };
    this.getAllSubjects();
  },
  methods: {
    getAllSubjects: function() {
      getSubjects(this.config)
        .then(response => {
          this.items = response.data.data;
        })
        .catch(error => {
          alert(error);
        });
    },
    create() {
      const hasDuplicates = array => new Set(array).size !== array.length;
      if (
        !hasDuplicates([
          this.category1,
          this.category2,
          this.category3,
          this.category4
        ])
      ) {
        if (this.$refs.form.validate()) {
          this.loading = true;
          let dates = {
            subject: this.subject,
            concept: this.concept,
            definition: this.definition,
            img: "",
            categories: [
              {
                body: this.category1,
                status: this.radio == "radio-1" ? true : false
              },
              {
                body: this.category2,
                status: this.radio == "radio-2" ? true : false
              },
              {
                body: this.category3,
                status: this.radio == "radio-3" ? true : false
              },
              {
                body: this.category4,
                status: this.radio == "radio-4" ? true : false
              }
            ]
          };
          createCategory(dates, this.config)
            .then(response => {
              this.$refs.form.reset();
              this.loading = false;
              this.textSnackbar = "Concepto creado";
              this.snackbarSuccess = true;
              this.getAllSubjects();
            })
            .catch(error => {
              this.loading = false;
              this.textSnackbar = error;
              this.snackbar = true;
            });
        } else {
          this.textSnackbar = "Faltan campos por digitar";
          this.snackbar = true;
        }
      } else {
        this.textSnackbar = "Verifique que las categorias sean diferentes";
        this.snackbar = true;
      }
    },
    exit() {
      this.$refs.form.reset();
    }
  }
};
</script>
