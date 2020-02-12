<template>
  <div class="video-recognition">
    <NavigationDrawer />
    <v-btn
      fab
      depressed
      color="transparent"
      to="/"
      small
      dark
      style="position:fixed;z-index:2;left:5px;top:5px"
    >
      <v-icon color="white" style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
        >mdi-arrow-left</v-icon
      >
    </v-btn>
    <v-btn
      fab
      depressed
      color="transparent"
      small
      dark
      style="position:fixed;z-index:2;left:50px;top:5px"
      @click="toggle()"
      :loading="loadingModel"
    >
      <v-icon
        color="white"
        style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
        >{{ start ? "mdi-stop" : "mdi-play" }}</v-icon
      >
    </v-btn>

    <v-btn
      fab
      depressed
      color="transparent"
      small
      dark
      style="position:fixed;z-index:2;left:95px;top:5px"
      @click="save()"
      :loading="loadingSaveResult"
    >
      <v-icon color="white" style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
        >mdi-content-save</v-icon
      >
    </v-btn>

    <v-btn
      fab
      depressed
      color="transparent"
      small
      dark
      style="position:fixed;z-index:2;left:140px;top:5px"
      @click="showSavedResults()"
    >
      <v-icon color="white" style="text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);"
        >mdi-poll-box</v-icon
      >
    </v-btn>

    <div style="position:fixed;z-index:1;top:8vh;width:100%">
      <textarea
        v-model="question"
        placeholder="Write your question here..."
        v-html="question"
      ></textarea>
    </div>

    <div class="d-flex justify-center">
      <video ref="video" id="video" width="640" height="480" autoplay></video>
    </div>
    <!-- <div class="d-flex justify-center" style="margin-top:-50px;">
      <v-btn depressed rounded @click="toggle()" :loading="loading">{{start?'Stop':'Start'}}</v-btn>
    </div>-->
    <!-- <div class="chart-labels">
      <div class="chart">
        <div class="yes" :style="{ height: result[0] * 50 + 'px' }">
          {{ result[0] != 0 ? result[0] : " " }}
        </div>
        <div class="no" :style="{ height: result[1] * 50 + 'px' }">
          {{ result[1] != 0 ? result[1] : " " }}
        </div>
      </div>
      <div class="labels">
        <div class="yes-label">Yes</div>
        <div class="no-label">No</div>
      </div>
    </div> -->
    <canvas
      v-show="false"
      ref="canvas"
      id="canvas"
      width="640"
      height="480"
    ></canvas>
    <img
      :src="capture"
      id="image"
      ref="image"
      style="height:100vh;width:100vw"
      v-show="false"
    />
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
      result: [0, 0],
      video: {},
      canvas: {},
      capture: null,
      start: false,
      loadingModel: false,
      loadingSaveResult: false,
      interval: null,
      question: "",
      modelLoaded: false,
      net: null
    };
  },
  methods: {
    showSavedResults() {
      this.$store.commit("setNavigationDrawer", true);
    },
    save() {
      if (this.question == "") {
        this.$store.commit("setSnackbar", {
          color: "info",
          timeout: 3000,
          text: "Write a question before saving..."
        });
        return;
      }
      this.loadingSaveResult = true;

      fb.graphsCollection
        .add({
          result: this.result,
          createdOn: new Date(),
          question: this.question
        })
        .then(payload => {
          this.loadingSaveResult = false;
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
        this.loadingModel = true;
        this.start = true;
        this.predict();
      } else {
        this.start = false;
      }
    },
    predict() {
      this.$store.commit("setSnackbar", {
        color: "info",
        timeout: 3000,
        text: "Wait few seconds..."
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
          maxDetections: 20,
          scoreThreshold: 0.6,
          nmsRadius: 2
        });
        if (!this.start) return;
        this.numberOfVotes(poses);
        this.loadingModel = false;
        if (!this.modelLoaded) {
          this.$store.commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: "The model is now running"
          });
        }
        this.modelLoaded = true;
      }
      var t1 = performance.now();
      // console.log(t1 - t0);
      if (t1 - t0 > 1000) {
        this.estimateMultiplePosesOnImage();
      } else {
        let self = this;
        setTimeout(function() {
          self.estimateMultiplePosesOnImage();
        }, 1000 - (t1 - t0));
      }
    },
    // calculate number of votes
    numberOfVotes(poses) {
      // console.log(poses);
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
  async beforeMount() {
    this.net = await posenet.load();
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
.chart-fixed {
  position: fixed;
  right: 6vw;
  bottom: 2vh;
}
/*
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
} */

textarea {
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
