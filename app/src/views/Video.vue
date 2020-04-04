<template>
  <div class="video-recognition">
    <NavigationDrawer />
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          fab
          depressed
          color="transparent"
          small
          dark
          style="position:fixed;z-index:2;left:5px;top:5px"
          @click="toggle()"
          :loading="loadingModel"
        >
          <v-icon
            color="white"
            style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
          >{{ start ? "mdi-stop" : "mdi-play" }}</v-icon>
        </v-btn>
      </template>
      <span>Start</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          fab
          depressed
          color="transparent"
          small
          dark
          style="position:fixed;z-index:2;left:50px;top:5px"
          @click="save()"
          :loading="loadingSaveResult"
        >
          <v-icon
            color="white"
            style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
          >mdi-content-save</v-icon>
        </v-btn>
      </template>
      <span>Save</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          fab
          depressed
          color="transparent"
          small
          dark
          style="position:fixed;z-index:2;left:100px;top:5px"
          @click="openNavigationDrawer()"
        >
          <v-icon color="white" style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);">mdi-poll-box</v-icon>
        </v-btn>
      </template>
      <span>Results</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          fab
          depressed
          color="transparent"
          small
          dark
          style="position:fixed;z-index:2;left:150px;top:5px"
          @click="openInformationDialog()"
        >
          <v-icon color="white" style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);">mdi-information</v-icon>
        </v-btn>
      </template>
      <span>Information</span>
    </v-tooltip>

    <div style="position:fixed;z-index:1;top:8vh;width:100%">
      <textarea v-model="question" placeholder="Write your question here..." v-html="question"></textarea>
    </div>

    <div class="d-flex justify-center">
      <video ref="video" id="video" width="640" height="480" autoplay></video>
    </div>

    <canvas v-show="false" ref="canvas" id="canvas" width="640" height="480"></canvas>
    <img :src="capture" id="image" ref="image" style="height:100vh;width:100vw" v-show="false" />
    <Chart :result="result" class="chart-fixed" />
  </div>
</template>

<script>
import * as posenet from "@tensorflow-models/posenet";
const fb = require("../firebaseConfig.js");
import NavigationDrawer from "../components/NavigationDrawer";
import Chart from "../components/Chart";

export default {
  name: "video-recognition",
  components: {
    NavigationDrawer,
    Chart
  },
  data() {
    return {
      frequency: 1000,
      result: [0, 0],
      video: {},
      canvas: {},
      capture: null,
      start: false,
      loadingModel: true,
      loadingSaveResult: false,
      interval: null,
      question: "",
      modelLoaded: false,
      net: null
    };
  },
  methods: {
    openInformationDialog() {
      this.$store.commit("setInformationDialog", true);
    },
    openNavigationDrawer() {
      this.$store.commit("setNavigationDrawer", true);
    },
    save() {
      if (this.loadingSaveResult == true) return;
      if (this.question == "") {
        this.$store.commit("setSnackbar", {
          color: "info",
          timeout: 3000,
          text: "Write a question before saving..."
        });
        return;
      }
      this.loadingSaveResult = true;
      let self = this;

      fb.graphsCollection
        .add({
          result: this.result,
          createdOn: new Date(),
          question: this.question
        })
        .then(payload => {
          setTimeout(function() {
            self.loadingSaveResult = false;
          }, 3000);
          this.$store.commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: "Result have been saved"
          });
        })
        .catch(err => {
          this.loadingSaveResult = false;
          console.log(err);
        });
    },
    toggle() {
      if (this.start == false) {
        this.start = true;
        this.predict();
      } else {
        this.start = false;
      }
    },
    predict() {
      this.$store.commit("setSnackbar", {
        color: "success",
        timeout: 3000,
        text: "Now raise your hand!"
      });
      // debugger;
      this.estimateMultiplePosesOnImage();
    },
    takePicture() {
      this.canvas = this.$refs.canvas;
      var context = this.canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, 640, 480);
      this.capture = this.canvas.toDataURL("image/png");
    },
    // multi-pose
    async estimateMultiplePosesOnImage() {
      var t0 = performance.now();
      this.takePicture();
      let imageElement = this.$refs.image;
      if (imageElement.src != "") {
        // const net = await posenet.load();
        // estimate poses
        const poses = await this.net.estimateMultiplePoses(imageElement, {
          flipHorizontal: false,
          maxDetections: 10,
          scoreThreshold: 0.6,
          nmsRadius: 20
        });
        if (!this.start) return;
        this.analyzePoses(poses);
      }
      var t1 = performance.now();
      // console.log(t1 - t0);
      // this.estimateMultiplePosesOnImage();

      if (t1 - t0 > this.frequency) {
        this.estimateMultiplePosesOnImage();
      } else {
        let self = this;
        setTimeout(function() {
          self.estimateMultiplePosesOnImage();
        }, this.frequency - (t1 - t0));
      }
    },
    // calculate number of votes
    analyzePoses(poses) {
      // console.log(poses);
      let vote_yes = 0;
      let vote_no = 0;
      var i = 0;
      while (poses[i]) {
        if (poses[i].score > 0.2) {
          this.isVotingYes(poses[i]) ? vote_yes++ : vote_no++;
          this.isSaving(poses[i]) ? this.save() : null;
          this.isTogglingNavigationDrawer(poses[i]);
        }
        i++;
      }
      this.result = [vote_yes, vote_no];
      // console.log(this.result);
    },
    isVotingYes(pose) {
      return (
        pose.keypoints[5].position.y > pose.keypoints[9].position.y ||
        pose.keypoints[6].position.y > pose.keypoints[10].position.y
      );
    },
    isSaving(pose) {
      if (this.loadingSaveResult) return;
      return (
        pose.keypoints[7].position.y < pose.keypoints[5].position.y &&
        pose.keypoints[8].position.y < pose.keypoints[6].position.y
      );
    },
    isTogglingNavigationDrawer(pose) {
      if (
        (pose.keypoints[9].position.y && pose.keypoints[10].position.y) <
        (pose.keypoints[6].position.y && pose.keypoints[5].position.y)
      ) {
        if (
          pose.keypoints[9].position.x < pose.keypoints[6].position.x &&
          pose.keypoints[10].position.x < pose.keypoints[6].position.x
        ) {
          // console.log("open");
          this.$store.commit("setNavigationDrawer", true);
        }
        if (
          pose.keypoints[9].position.x > pose.keypoints[5].position.x &&
          pose.keypoints[10].position.x > pose.keypoints[5].position.x
        ) {
          // console.log("open");
          this.$store.commit("setNavigationDrawer", false);
        }
      }
    },
    detectMob() {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
      ];

      return toMatch.some(toMatchItem => {
        return navigator.userAgent.match(toMatchItem);
      });
    }
  },
  async beforeMount() {
    this.$store.commit("setSnackbar", {
      color: "info",
      timeout: 3000,
      text: "Wait few seconds..."
    });
    if (this.detectMob()) {
      this.net = await posenet.load();
    } else {
      this.net = await posenet.load({
        architecture: "ResNet50",
        outputStride: 32
        // inputResolution: { width: 257, height: 257 }
      });
    }

    this.$store.commit("setSnackbar", {
      color: "success",
      timeout: 3000,
      text: "Ready to run!"
    });
    this.loadingModel = false;
  },
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream;
        this.video.play();
      });
    }
    var self = this;
    window.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        self.toggle();
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        } else if (document.selection) {
          document.selection.empty();
        }
      }
    });
  }
};
</script>

<style>
#video {
  width: 100vw;
  height: 100vh;
  background-color: #1e3f60;
  transform: scaleX(-1);
  object-fit: cover;
}
.chart-fixed {
  position: fixed;
  right: 6vw;
  bottom: 2vh;
}

div textarea {
  border: none;
  overflow: auto;
  outline: none;
  box-shadow: none;

  resize: none; /*remove the resize handle on the bottom right*/
  color: white;
  text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
  font-size: 40px;
  text-align: center;
  width: 90%;
  height: 300px;
  margin: auto 5vw;
}
textarea::placeholder {
  color: white;
}
</style>
