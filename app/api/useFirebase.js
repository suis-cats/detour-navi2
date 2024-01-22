import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOuumVV-tVLTFqTjE0VqUyuw_9ErxnjYI",
  authDomain: "detour-navi.firebaseapp.com",
  projectId: "detour-navi",
  storageBucket: "detour-navi.appspot.com",
  messagingSenderId: "265752970522",
  appId: "1:265752970522:web:a339f4ce94f48521d158a3",
  measurementId: "G-TV1GLXX0PG",
  storageBucket: "gs://detour-navi.appspot.com",
};

firebase.initializeApp(firebaseConfig);

var auth_obj = firebase.auth();
var storage_obj = firebase.storage();

export default firebase;
export const auth = auth_obj;
export const storage = storage_obj;
