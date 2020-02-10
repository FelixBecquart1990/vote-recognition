<template>
  <div class="video-recognition">
    <div class="d-flex justify-center">
      <video
        ref="video"
        id="video"
        width="640"
        height="480"
        autoplay
        style="transform: scaleX(-1);"
      ></video>
    </div>
    <div class="d-flex justify-center" style="margin-top:-50px;">
      <v-btn depressed rounded @click="toggle()" :loading="loading">{{start?'Stop':'Start'}}</v-btn>
    </div>
    <div class="d-flex justify-center mt-5">
      <BarChart
        style="width:100px; height:100px"
        msg="Welcome to Your Vue.js App"
        :result="result"
      />
    </div>

    <!-- <div class="d-flex justify-center mt-5">
      <div>screenshot</div>
      <img :src="capture" height="50" width="50" />
      <canvas class="screenshot"></canvas>
    </div>-->
    <!-- <div>
      <button id="snap" @click="takePicture()">Snap Photo</button>
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
      result: [0, 0],
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
