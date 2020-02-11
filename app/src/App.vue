<template>
  <v-app>
    <v-app-bar app color="primary" dark short v-if="$route.name != 'video'">
      <v-btn
        v-if="$route.name != 'home'"
        fab
        depressed
        color="primary"
        to="/"
        small
        style="margin-right:-40px"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Yes/No</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
    <snackbar />
  </v-app>
</template>

<script>
import Home from "./views/Home";
const fb = require("./firebaseConfig.js");
import Snackbar from "./components/Snackbar";

export default {
  name: "App",

  components: {
    Home,
    Snackbar
  },

  data: () => ({
    //
  }),
  mounted() {
    fb.auth
      .signInAnonymously()
      .then(cred => {
        console.log(cred);
      })
      .catch(function(error) {
        console.log(error);
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    fb.graphsCollection
      .orderBy("createdOn", "desc")
      .limit(10)
      .onSnapshot(
        snapshot => {
          let listResults = [];
          snapshot.forEach(result => {
            listResults.push(Object.assign({ uid: result.id }, result.data()));
          });

          // listResults = listResults.filter(function(data) {
          //   return data.reported.length < 3;
          // });
          // console.log(listResults);
          // listResults.sort((a, b) =>
          //   a.createdOn > b.createdOn ? 1 : b.createdOn > a.createdOn ? -1 : 0
          // );
          this.$store.commit("setResults", listResults);
        },
        error => {
          console.log(error);
        }
      );
  }
};
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}

* {
  font-family: mainFont;
  /*color:#7B8790*/
}

@font-face {
  font-family: mainFont;
  src: url("./assets/gothamrnd-medium.ttf");
}
</style>
