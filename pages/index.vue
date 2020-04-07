<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on }">
              <v-hover v-slot:default="{ hover }" close-delay="200">
                <v-card v-on="on" class="ma-2" :elevation="hover ? 16 : 2">
                  <v-card-text class="headline">
                    Crear concepto y categorias
                    <v-icon size="60" color="grey lighten-1">mdi-plus-circle-outline</v-icon>
                  </v-card-text>
                </v-card>
              </v-hover>
            </template>
            <v-form v-on:submit.prevent="create" lazy-validation ref="form">
              <v-card>
                <v-card-title>
                  <span class="headline">CONCEPTO Y CATEGORIAS</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-combobox
                          v-model="subject"
                          :items="items"
                          label="Tematica *"
                          :rules="nameRules"
                          required
                        ></v-combobox>
                        <v-btn icon>
                          <v-icon color="grey lighten-1">mdi-information</v-icon>
                        </v-btn>
                        <small
                          dense
                        >Digite el nombre de una nueva tematica o selecciona una existente</small>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="concept" :rules="nameRules" label="Concepto *"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="definition"
                          auto-grow
                          label="Definición *"
                          rows="1"
                          :rules="nameRules"
                          required
                        ></v-textarea>
                      </v-col>
                      <v-subheader>Categorias</v-subheader>
                      <v-col cols="12">
                        <v-textarea
                          v-model="category1"
                          auto-grow
                          label="Categoria 1*"
                          rows="1"
                          :rules="nameRules"
                          required
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="category2"
                          auto-grow
                          label="Categoria 2*"
                          rows="1"
                          :rules="nameRules"
                          required
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="category3"
                          auto-grow
                          label="Categoria 3*"
                          rows="1"
                          :rules="nameRules"
                          required
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="category4"
                          auto-grow
                          label="Categoria 4*"
                          rows="1"
                          :rules="nameRules"
                          required
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
          </v-dialog>
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
      dialog: false,
      subject: "",
      definition: "",
      concept: "",
      category1: "",
      category2: "",
      category3: "",
      category4: "",
      radio: "",
      nameRules: [v => !!v || "Campo necesario"],
      config: ""
    };
  },
  mounted() {
    this.config = {
      headers: { authorization: Cookie.get("auth") }
    };
    getSubjects(this.config)
      .then(response => {
        this.items = response.data.data;
      })
      .catch(error => {
        alert(error);
      });
  },
  methods: {
    create() {
      if (this.$refs.form.validate()) {
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
            console.log(response);
            this.$refs.form.reset();
            this.dialog = false;
          })
          .catch(error => {
            alert(error);
          });
      } else {
      }
    },
    exit() {
      this.$refs.form.reset();
      this.dialog = false;
    }
  }
};
</script>
