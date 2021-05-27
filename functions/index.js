/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable no-console */
const functions = require("firebase-functions");
const firebase = require("firebase-admin");
firebase.initializeApp();
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.onCreateAccount = functions.auth.user().onCreate((e) => {
  return firebase
    .firestore()
    .collection("/users")
    .doc(e.uid)
    .set({ likes: [], watchlist: [] })
    .then(() => e);
});
exports.onDeleteAccount = functions.auth.user().onDelete((e) => {
  return firebase
    .firestore()
    .collection("/users")
    .doc(e.uid)
    .delete()
    .then((r) => e)
    .catch((r) => console.error("Error", r));
});

exports.userAgent = functions.https.onRequest((req, res) => {
  const agents = req.headers["user-agent"];
  functions.logger.log(agents);
});
