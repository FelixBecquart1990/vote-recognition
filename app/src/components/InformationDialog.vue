<template>
  <div class="text-center">
    <v-dialog v-model="informationDialog" width="500">
      <v-card @click="informationDialog = false">
        <v-card-title class="headline white--text success" primary-title>Information</v-card-title>
        <v-card-title class="grey--text">
          <v-icon color="black" left class="grey--text">mdi-hand</v-icon>How to vote
        </v-card-title>
        <v-card-text class="pb-5 grey--text">Raise one of your wrists above your shoulders</v-card-text>
        <v-card-title class="grey--text">
          <v-icon color="black" left class="grey--text">mdi-content-save</v-icon>How to save the result
        </v-card-title>
        <v-card-text class="pb-5 grey--text">Raise your two elbows above your shoulders.</v-card-text>
        <v-card-title class="grey--text">
          <v-icon color="black" left class="grey--text">mdi-format-list-text</v-icon>How to see saved results
        </v-card-title>
        <v-card-text
          class="pb-5 grey--text"
        >Put your two wrists further to your right shoulder. To close this navigation drawer, put your two wrists further to your left shoulder.</v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  computed: {
    informationDialog: {
      get() {
        return this.$store.state.informationDialog;
      },
      set(val) {
        return this.$store.commit("setInformationDialog", val);
      }
    }
  }
};
</script>

<style scoped></style>
