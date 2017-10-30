// Initialize Firebase
var config = {
  apiKey: "AIzaSyA-9Ptg8z-7lWpEwE9O78dIXLe9vuwbwgg",
  authDomain: "wedapp-f45b8.firebaseapp.com",
  databaseURL: "https://wedapp-f45b8.firebaseio.com",
  projectId: "wedapp-f45b8",
  storageBucket: "wedapp-f45b8.appspot.com",
  messagingSenderId: "157005132056"
};
firebase.initializeApp(config);


// ref to firebase functions
let dataBase = firebase.database()
let fireStorage = firebase.storage()
let auth = firebase.auth();


