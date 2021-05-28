import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/analytics";

//config for firebase
const firebaseConfig = {
  apiKey: "AIzaSyBwDrFy4oRXfUY61oMHF56JbMxsA-ouR8M",
  authDomain: "movie-sh.firebaseapp.com",
  databaseURL: "https://movie-sh.firebaseio.com",
  projectId: "movie-sh",
  storageBucket: "movie-sh.appspot.com",
  messagingSenderId: "725672511363",
  appId: "1:725672511363:web:031f61f9b427793c13d8b6",
  measurementId: "G-6NQ3LK2Y0J",
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase
  .firestore()
  .enablePersistence()
  .catch((err) => {
    if (err.code === "failed-precondition") {
      console.log(
        "Multiple tabs open, persistence can only be enabled in one tab at a a time."
      );
    } else if (err.code === "unimplemented") {
      console.log(
        " The current browser does not support all of the features required to enable persistence ..."
      );
    }
  });
export default firebase;
function FBAnalytics(event_name) {
  if (!window.location.hostname === "localhost")
    firebase.analytics().logEvent(event_name);
}
export { FBAnalytics };
