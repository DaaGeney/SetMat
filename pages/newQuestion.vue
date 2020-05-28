<template>
  <v-app>
    <v-content>
      <v-container>
        <v-snackbar v-model="snackbar" top color="error" :timeout="3000">{{ textSnackbar }}</v-snackbar>
        <v-snackbar v-model="snackbarSuccess" top color="success" :timeout="2500">{{ textSnackbar }}</v-snackbar>
        <v-tabs background-color="blue accent-4" class="elevation-2" ref="tabs"  dark centered grow>
          <v-tabs-slider></v-tabs-slider>
          <v-tab>Crear tematica</v-tab>
          <v-tab>Crear concepto</v-tab>
          <v-tab-item>
            <v-progress-linear
              :active="loading"
              :indeterminate="loading"
              absolute
              bottom
              color="primary"
            ></v-progress-linear>
            <v-card flat>
              <v-row align="center" justify="center">
                <v-col cols="11" sm="11">
                  <v-form ref="form2" v-on:submit.prevent="createSubject" lazy-validation>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="newSubject"
                          auto-grow
                          label="Tematica *"
                          rows="1"
                          :rules="nameRules"
                          required
                          outlined
                        ></v-textarea>
                        <v-subheader class="title">Categorias</v-subheader>
                      </v-col>

                      <v-col cols="12">
                        <v-textarea
                          v-model="newCategory1"
                          auto-grow
                          label="Categoria 1*"
                          rows="1"
                          :rules="nameRules"
                          required
                          outlined
                        ></v-textarea>
                        <v-textarea
                          v-model="newCategory2"
                          auto-grow
                          label="Categoria 2*"
                          rows="1"
                          :rules="nameRules"
                          required
                          outlined
                        ></v-textarea>
                        <v-textarea
                          v-model="newCategory3"
                          auto-grow
                          label="Categoria 3*"
                          rows="1"
                          :rules="nameRules"
                          required
                          outlined
                        ></v-textarea>
                        <v-textarea
                          v-model="newCategory4"
                          auto-grow
                          label="Categoria 4*"
                          rows="1"
                          :rules="nameRules"
                          required
                          outlined
                        ></v-textarea>
                      </v-col>
                    </v-row>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="exit2">Cancelar</v-btn>
                      <v-btn color="blue darken-1" text type="submit">Crear</v-btn>
                    </v-card-actions>
                  </v-form>
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-progress-linear
              :active="loading"
              :indeterminate="loading"
              absolute
              bottom
              color="primary"
            ></v-progress-linear>
            <v-row justify="center">
              <v-form v-on:submit.prevent="create" lazy-validation ref="form">
                <v-card flat>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-btn icon>
                            <v-icon color="grey lighten-1">mdi-information</v-icon>
                          </v-btn>
                          <small dense>Selecciona una tematica existente</small>

                          <v-autocomplete
                            no-data-text="No se encuentran tematicas"
                            v-model="subject"
                            :items="items"
                            label="Tematica *"
                            :rules="nameRules"
                            required
                            outlined
                            @change="saludar"
                          ></v-autocomplete>
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
                            outlined
                            disabled
                          ></v-textarea>
                          <v-textarea
                            v-model="category2"
                            auto-grow
                            label="Categoria 2*"
                            rows="1"
                            :rules="nameRules"
                            outlined
                            disabled
                          ></v-textarea>
                          <v-textarea
                            v-model="category3"
                            auto-grow
                            label="Categoria 3*"
                            rows="1"
                            :rules="nameRules"
                            outlined
                            disabled
                          ></v-textarea>
                          <v-textarea
                            v-model="category4"
                            auto-grow
                            label="Categoria 4*"
                            rows="1"
                            :rules="nameRules"
                            outlined
                            disabled
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
          </v-tab-item>
        </v-tabs>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { createCategory } from "../helpers/apiCalls/categories";
import { getAllSubjects, createSubjects } from "../helpers/apiCalls/subjects";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  middleware: "authenticated",
  data() {
    return {
      items: [],
      subject: "",
      newSubject: "",
      definition: "",
      concept: "",
      category1: "Seleccione una tematica...",
      category2: "Seleccione una tematica...",
      category3: "Seleccione una tematica...",
      category4: "Seleccione una tematica...",

      newCategory1: "",
      newCategory2: "",
      newCategory3: "",
      newCategory4: "",

      radio: "",
      nameRules: [v => !!v || "Campo necesario"],
      config: "",
      snackbar: "",
      snackbarSuccess: "",
      loading: false,
      textSnackbar: "",
      infoSubject: [],
    };
  },
  mounted() {
    this.config = {
      headers: { authorization: Cookie.get("auth") }
    };
    this.getAllSubjects();
  },
  methods: {
    saludar: function(event) {
      if (this.subject == "" || this.subject == null) {
        this.category1 = "Seleccione una tematica...";
        this.category2 = "Seleccione una tematica...";
        this.category3 = "Seleccione una tematica...";
        this.category4 = "Seleccione una tematica...";
      } else {
        this.infoSubject.forEach(element => {
          if (this.subject == element.subject) {
            console.log(element.categories);
            this.category1 = element.categories[0].body;
            this.category2 = element.categories[1].body;
            this.category3 = element.categories[2].body;
            this.category4 = element.categories[3].body;
          }
        });
      }
    },
    createSubject: function() {
      const hasDuplicates = array => new Set(array).size !== array.length;
      if (
        hasDuplicates([
          this.newCategory1,
          this.newCategory2,
          this.newCategory3,
          this.newCategory4
        ])
      ) {
        this.textSnackbar = "las categorias deben ser distintas";
        this.snackbar = true;
      } else {
        if (this.$refs.form2.validate()) {
          this.loading = true;
          const data = {
            subject: this.newSubject,
            categories: [
              {
                body: this.newCategory1,
                status: false
              },
              {
                body: this.newCategory2,
                status: false
              },
              {
                body: this.newCategory3,
                status: false
              },
              {
                body: this.newCategory4,
                status: false
              }
            ]
          };
          createSubjects(data, this.config)
            .then(response => {
              this.$refs.form2.reset();
              this.loading = false;
              this.textSnackbar = "Tematica creada correctamente";
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
      }
    },
    getAllSubjects: function() {
      getAllSubjects(this.config)
        .then(response => {
          // this.items = response.data.data;
          this.infoSubject = response.data.data;
          console.log(this.infoSubject);
          response.data.data.forEach(element => {
            this.items.push(element.subject);
          });
        })
        .catch(error => {
          
        });
    },
    create() {
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
    },
    exit() {
       this.$refs.form.reset();
    },
    exit2() {
       this.$refs.form2.reset();
    }
  }
};
</script>
