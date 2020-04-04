import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
const fb = require("./firebaseConfig.js");

Vue.config.productionTip = false;

// handle page reloads
let app;
fb.auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      vuetify,
      render: (h) => h(App),
    });
  }
});
