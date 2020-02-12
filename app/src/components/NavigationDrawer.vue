<template>
  <v-navigation-drawer
    v-model="navigationDrawer"
    absolute
    temporary
    dark
    class="drawer"
  >
    <v-btn
      fab
      depressed
      color="transparent"
      small
      dark
      @click="navigationDrawer = false"
      class="ma-1"
      style="position:fixed;z-index:2;left:5px;top:5px"
    >
      <v-icon color="white" style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
        >mdi-arrow-left</v-icon
      >
    </v-btn>
    <div v-for="(result, index) in results" :key="index">
      <div class="d-flex justify-center">
        <Chart :result="result.result" />
      </div>
      <div class="d-flex justify-center mt-3 mx-5">
        <h2 style="color:white;font-size:30px;text-align:center">
          {{ result.question }}
        </h2>
      </div>
      <div class="d-flex justify-center mt-3 mx-5">
        <v-btn
          fab
          depressed
          color="transparent"
          small
          dark
          @click="deleteResult(result)"
          class="ma-1"
        >
          <v-icon
            color="red"
            style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
            >mdi-delete</v-icon
          >
        </v-btn>
      </div>

      <v-divider class="ma-5"></v-divider>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import Chart from "../components/Chart";
const fb = require("../firebaseConfig.js");

export default {
  components: {
    Chart
  },
  computed: {
    ...mapState(["results"]),
    navigationDrawer: {
      get() {
        return this.$store.state.navigationDrawer;
      },
      set(val) {
        return this.$store.commit("setNavigationDrawer", val);
      }
    }
  },
  methods: {
    deleteResult(result) {
      let self = this;
      fb.graphsCollection
        .doc(result.uid)
        .delete()
        .then(function() {
          self.$store.commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: "This result has been deleted"
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.drawer {
  background-color: rgba(0, 0, 0, 0.6);
}
.v-navigation-drawer {
  width: 100vw !important;
}
</style>
