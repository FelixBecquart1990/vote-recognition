<template>
  <div class="video-recognition">
    <v-btn
      fab
      depressed
      color="transparent"
      to="/"
      small
      style="position:fixed;z-index:2;left:5px;top:5px"
    >
      <v-icon color="white" style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);">mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn
      fab
      depressed
      color="transparent"
      small
      dark
      style="position:fixed;z-index:2;left:35px;top:5px"
      @click="toggle()"
      :loading="loading"
    >
      <v-icon
        color="white"
        style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
      >{{start?'mdi-stop':'mdi-play'}}</v-icon>
    </v-btn>

    <div class="d-flex justify-center">
      <video ref="video" id="video" width="640" height="480" autoplay></video>
    </div>
    <!-- <div class="d-flex justify-center" style="margin-top:-50px;">
      <v-btn depressed rounded @click="toggle()" :loading="loading">{{start?'Stop':'Start'}}</v-btn>
    </div>-->
    <div class="chart-labels">
      <div class="chart">
        <div class="yes" :style="{height:result[0]*50+'px', tran}">{{ result[0]!=0?result[0]:" " }}</div>
        <div class="no" :style="{height:result[1]*50+'px'}">{{ result[1]!=0?result[1]:" " }}</div>
      </div>
      <div class="labels">
        <div class="yes-label">Yes</div>
        <div class="no-label">No</div>
      </div>
    </div>
    <!-- <div class="d-flex justify-center mt-5">
      <BarChart
        style="width:100px; height:100px"
        msg="Welcome to Your Vue.js App"
        :result="result"
      />
    </div>-->
    <canvas v-show="false" ref="canvas" id="canvas" width="640" height="480"></canvas>
    <img :src="capture" id="image" style="height:100vh;width:100vw" v-show="false" />
  </div>
</template>


<script>
// @ is an alias to /src
import BarChart from "@/components/BarChart.vue";

import * as posenet from "@tensorflow-models/posenet";

export default {
  name: "video-recognition",
  components: {
    BarChart
  },
  data() {
    return {
      result: [2, 1],
      video: {},
      canvas: {},
      capture: null,
      start: false,
      loading: false,
      interval: null
    };
  },
  methods: {
    toggle() {
      if (this.start == false) {
        this.loading = true;
        this.start = true;
        this.predict();
        let self = this;
        this.interval = setInterval(self.predict(), 2000);
      } else {
        this.start = false;
        clearInterval(this.interval);
      }
    },
    predict() {
      if (!this.start) return;
      this.estimateMultiplePosesOnImage(document.getElementById("image"));
    },
    takePicture() {
      this.canvas = this.$refs.canvas;
      var context = this.canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, 640, 480);
      this.capture = this.canvas.toDataURL("image/png");
    },
    // multi-pose
    async estimateMultiplePosesOnImage(imageElement) {
      // let self = this
      // let timeoutRunning = true
      // let timeout = setTimeout(self.predict(), 1000);

      const net = await posenet.load();

      this.takePicture();

      // estimate poses
      const poses = await net.estimateMultiplePoses(imageElement, {
        flipHorizontal: false,
        maxDetections: 20,
        scoreThreshold: 0.6,
        nmsRadius: 2
      });
      if (!this.start) return;
      this.numberOfVotes(poses);
      this.loading = false;
      // next estimation
      this.predict();
    },
    // calculate number of votes
    numberOfVotes(poses) {
      let vote_yes = 0;
      let vote_no = 0;
      var i = 0;
      while (poses[i]) {
        if (poses[i].score > 0.2) {
          if (
            poses[i].keypoints[5].position.y >
              poses[i].keypoints[9].position.y ||
            poses[i].keypoints[6].position.y > poses[i].keypoints[10].position.y
          ) {
            vote_yes++;
          } else {
            vote_no++;
          }
        }
        i++;
      }
      this.result = [vote_yes, vote_no];
      console.log(this.result);
    }
  },
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream;
        this.video.play();
      });
    }
  }
};
</script>

<style>
#video {
  width: 100vw;
  height: 100vh;
  background-color: #2196f3;
  transform: scaleX(-1);
  object-fit: cover;
}
.chart-labels {
  position: fixed;
  right: 6vw;
  bottom: 2vh;
}
.chart {
  /* position: fixed;
  right: 10vw;
  bottom: calc(10vh + 60px); */
}
.chart > * {
  transition: height 1s;
  vertical-align: bottom;
  display: inline-block;
  margin-left: 30px;
  width: 60px;
  border-radius: 10px;
  text-align: center;
  padding-top: 5px;
  color: white;
  font-size: 30px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}
.yes {
  background-color: #53c0a1;
}

.no {
  background-color: #ef6d61;
}

.labels > * {
  vertical-align: bottom;
  display: inline-block;
  margin-left: 30px;
  width: 60px;
  text-align: center;
  color: white;
  font-size: 30px;
  text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
}
</style>