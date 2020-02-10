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
  </v-app>
</template>

<script>
import Home from "./views/Home";

export default {
  name: "App",

  components: {
    Home
  },

  data: () => ({
    //
  })
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