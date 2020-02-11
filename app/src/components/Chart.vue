<template>
  <div class="chart-labels">
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
  </div>
</template>

<script>
export default {
  props: ["result"]
};
</script>

<style scoped>
/* .chart-labels {
  position: fixed;
  right: 6vw;
  bottom: 2vh;
} */

.chart > * {
  transition: height 1s;
  vertical-align: bottom;
  display: inline-block;
  width: 60px;
  border-radius: 10px;
  text-align: center;
  padding-top: 5px;
  color: white;
  font-size: 30px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}
.yes {
  margin-right: 30px;
  background-color: #53c0a1;
}
.yes-label {
  margin-right: 30px;
}
.no {
  background-color: #ef6d61;
}

.labels > * {
  vertical-align: bottom;
  display: inline-block;
  width: 60px;
  text-align: center;
  color: white;
  font-size: 30px;
  text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
}
</style>
