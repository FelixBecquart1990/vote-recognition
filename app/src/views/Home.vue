<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <BarChart msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import BarChart from "@/components/BarChart.vue";

export default {
  name: "home",
  components: {
    BarChart
  }
};
</script>
