import firebase from "../config/fbConfig";
import "firebase/auth";
import "firebase/firestore";

async function getUserData() {
  if (firebase.auth().currentUser === null) return;
  const r = await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .get();
  return r.data();
}

async function getLike(movie_id) {
  if (firebase.auth().currentUser === null) return;
  const r = await getUserData();
  return {
    liked: r["likes"].indexOf(movie_id) !== -1,
    watchlist: r["watchlist"].indexOf(movie_id) !== -1,
  };
}
/**
 *
 * @param {String} movie_id
 * @param {String} type like | watchlist
 */
function setLike(movie_id, type) {
  if (firebase.auth().currentUser === null) return;
  var t = "likes";
  if (type === "watchlist") t = "watchlist";

  return firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .update(t, firebase.firestore.FieldValue.arrayUnion(movie_id.toString()));
}
/**
 *
 * @param {String} movie_id
 * @param {String} type like | watchlist
 */
function removeLike(movie_id, type) {
  if (firebase.auth().currentUser === null) return;
  var t = "likes";
  if (type === "watchlist") t = "watchlist";

  return firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .update(t, firebase.firestore.FieldValue.arrayRemove(movie_id.toString()));
}
async function getWatchlist() {
  const r = await getUserData();
  return r["watchlist"];
}
export { getUserData, getLike, setLike, removeLike, getWatchlist };
