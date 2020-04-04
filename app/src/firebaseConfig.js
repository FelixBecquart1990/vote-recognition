import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
// firebase init
const config = {
  apiKey: "AIzaSyDHMD54UNFlh6euKdSm-cXHhrxYwVzQ8XU",
  authDomain: "vote-recognition.firebaseapp.com",
  databaseURL: "https://vote-recognition.firebaseio.com",
  projectId: "vote-recognition",
  storageBucket: "vote-recognition.appspot.com",
  messagingSenderId: "222754152177",
  appId: "1:222754152177:web:6e012c383dcec081d95350",
  measurementId: "G-57F98JFM4J",
};
firebase.initializeApp(config);
firebase.analytics();
Vue.prototype.$analytics = firebase.analytics();

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// firebase collections
const graphsCollection = db.collection("graphs");

export { db, auth, currentUser, graphsCollection };
