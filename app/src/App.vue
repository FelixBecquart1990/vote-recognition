<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
    <snackbar />
    <informationDialog />
  </v-app>
</template>

<script>
const fb = require("./firebaseConfig.js");
import Snackbar from "./components/Snackbar";
import InformationDialog from "./components/InformationDialog";

export default {
  name: "App",

  components: {
    Snackbar,
    InformationDialog
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
::-webkit-scrollbar {
  width: 0px;
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
