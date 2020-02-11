import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbar: { active: false, color: "", mode: "", timeout: 0, text: "" },
    navigationDrawer: false,
    results: [
      { result: [1, 2], createdOn: "12/10/2010", question: "Is it working?" },
      { result: [3, 2], createdOn: "12/11/2010", question: "Really?" }
    ]
  },
  mutations: {
    setSnackbar(state, val) {
      state.snackbar = Object.assign({}, val, { active: true });
    },
    setNavigationDrawer(state, val) {
      state.navigationDrawer = val;
    },
    setResults(state, val) {
      state.results = val;
    }
  },
  actions: {},
  modules: {}
});
