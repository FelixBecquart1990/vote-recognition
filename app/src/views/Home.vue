<template>
  <v-item-group>
    <v-container>
      <v-row class="offset-md-3">
        <v-col cols="12" md="4" sm="6">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="active ? 'primary' : ''"
              class="d-flex align-center justify-center"
              height="200"
              @click="toggle"
              to="/image"
            >Image</v-card>
          </v-item>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="active ? 'primary' : ''"
              class="d-flex align-center justify-center"
              height="200"
              @click="toggle"
              to="/video"
            >Video</v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>
