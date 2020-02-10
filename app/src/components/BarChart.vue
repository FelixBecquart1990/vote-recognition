<template>
  <div>
    <reactive-bar-chart :chart-data="chartData" :options="options"></reactive-bar-chart>
    <!-- <div class="d-flex justify-center mt-5">
      <v-btn @click="getDataFromAPI()" depressed rounded :loading="loading"
        >Test API</v-btn>
    </div>-->
  </div>
</template>

<script>
import ReactiveBarChart from "./ReactiveBarChart.js";
export default {
  name: "App",
  props: ["result"],
  components: {
    ReactiveBarChart
  },
  data() {
    return {
      loading: false,
      // chartData: {},
      votes: [],
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              display: false,
              gridLines: {
                display: false
              },
              ticks: {
                display: false,
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    chartData() {
      return {
        labels: ["Yes: " + this.result[0], "No: " + this.result[1]],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#2196F3",
            data: this.result
          }
        ]
      };
    }
  },
  methods: {
    // getDataFromAPI() {
    //   this.loading = true;
    //   let self = this;
    //   fetch("http://127.0.0.1:5000/")
    //     .then(function(response) {
    //       return response.json();
    //     })
    //     .then(function(data) {
    //       self.chartData = {
    //         labels: ["Yes " + data[0], "No " + data[1]],
    //         datasets: [
    //           {
    //             label: "Data One",
    //             backgroundColor: "#2196F3",
    //             data: data
    //           }
    //         ]
    //       };
    //       self.loading = false;
    //     })
    //     .catch(function(err) {
    //       self.loading = false;
    //       console.log(err);
    //     });
    // },
    generateData() {
      this.votes = [];
      for (let i = 0; i < 2; i++) {
        let randomValue = Math.floor(Math.random() * 10);
        this.votes.push(randomValue);
      }

      this.chartData = {
        labels: ["Yes " + this.votes[0], "No " + this.votes[1]],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#2196F3",
            data: this.votes
          }
        ]
      };
    }
  },
  mounted() {
    // this.generateData();
    // setInterval(this.generateData, 5000);
  }
  // async mounted() {
  //   this.loaded = false;
  //   try {
  //     const { userlist } = await fetch(
  //       "api.openweathermap.org/data/2.5/weather?q=London"
  //     );
  //     console.log(userlist);
  //     // this.chartdata = userlist
  //     this.loaded = true;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
};
</script>

<style>
/* .small {
  max-width: 100px;
  margin: 0px auto;
} */
</style>
