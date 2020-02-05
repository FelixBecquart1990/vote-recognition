<template>
  <v-app>
    <v-app-bar app color="primary" dark
      ><v-spacer></v-spacer><v-toolbar-title>Yes/No</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <BarChart />
    </v-content>
  </v-app>
</template>

<script>
import BarChart from "./components/BarChart";

export default {
  name: "App",

  components: {
    BarChart
  },

  data: () => ({
    //
  })
};
</script>
