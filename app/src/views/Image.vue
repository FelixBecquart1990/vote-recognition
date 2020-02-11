<template>
  <div class="image-recognition">
    <div class="d-flex justify-center mt-5">
      <v-btn depressed rounded @click="test()">Test</v-btn>
    </div>
    <div class="d-flex justify-center mt-5">
      <img id="cat" src="../assets/logo.jpg" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import * as posenet from "@tensorflow-models/posenet";

export default {
  name: "image-recognition",
  components: {
    BarChart
  },
  data() {
    return {
      imageElement: null,
      result: [0, 0]
    };
  },
  methods: {
    test() {
      this.imageElement = document.getElementById("cat");
      // console.log(this.imageElement);
      // this.estimatePoseOnImage(this.imageElement);
      this.estimateMultiplePosesOnImage(this.imageElement);
    },
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
  }
};
</script>
