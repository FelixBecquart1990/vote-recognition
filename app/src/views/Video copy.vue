<template>
  <div class="video-recognition">
    <div class="d-flex justify-center mt-5">
      <v-btn depressed rounded @click="takePicture()">Take picture</v-btn>
    </div>
    <div class="d-flex justify-center mt-5">
      <video autoplay style="transform: scaleX(-1);"></video>
    </div>
    <div class="d-flex justify-center mt-5">
      <div>screenshot</div>
      <img :src="capture" height="50" width="50" />
      <canvas class="screenshot"></canvas>
    </div>
    <BarChart msg="Welcome to Your Vue.js App" :result="result" />
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
      imageElement: null,
      result: [0, 0],
      video: null,
      canvas: null,
      capture: null,
      videoPlayer: null
    };
  },
  methods: {
    takePicture() {
      const picture = document.querySelector(".screenshot");
      const ctx = picture.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        document.querySelector("video"),
        0,
        0,
        picture.width,
        picture.height
      );
      // this.video = document.querySelector("video");
      // this.canvas = document.querySelector("canvas");
      // var context = this.canvas
      //   .getContext("2d")
      //   .drawImage(this.video, 0, 0, 640, 480);
      // this.capture = this.canvas.toDataURL("image/png");
      // console.log(this.video);
      // console.log(this.canvas);
      // console.log(this.capture);
      // this.estimateMultiplePosesOnImage(this.capture);
    },
    init() {
      if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
      ) {
        let constraints = {
          video: {
            width: {
              min: 640,
              ideal: 1280,
              max: 1920
            },
            height: {
              min: 360,
              ideal: 720,
              max: 1080
            }
          }
        };

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          this.videoPlayer = document.querySelector("video");
          this.videoPlayer.srcObject = stream;
          this.videoPlayer.play();
        });
      } else {
        alert("Cannot get Media Devices");
      }
    },
    // takePicture() {
    //   this.imageElement = document.querySelector("video");
    //   // this.estimatePoseOnImage(this.imageElement);
    //   this.estimateMultiplePosesOnImage(this.imageElement);
    // },
    // one pose
    async estimatePoseOnImage(imageElement) {
      // load the posenet model from a checkpoint
      const net = await posenet.load();

      const pose = await net.estimateSinglePose(imageElement, {
        flipHorizontal: false
      });
      console.log(pose);
      return pose;
    },
    // multi-pose
    async estimateMultiplePosesOnImage(imageElement) {
      const net = await posenet.load();

      // estimate poses
      const poses = await net.estimateMultiplePoses(imageElement, {
        flipHorizontal: false,
        maxDetections: 20,
        scoreThreshold: 0.6,
        nmsRadius: 2
      });
      console.log(poses);
      this.numberOfVotes(poses);
      return poses;
    },
    // calculate number of votes
    numberOfVotes(poses) {
      let vote_yes = 0;
      let vote_no = 0;
      var i = 0;
      while (poses[i]) {
        if (poses[i].score > 0.1) {
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
  beforeMount() {
    this.init();
  }
};
</script>
