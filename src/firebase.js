import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';



var firebaseConfig = {
    apiKey: "AIzaSyChvTRbr_gl5oBDMQV1km_lt1dAqiq50q0",
    authDomain: "chat-sagas.firebaseapp.com",
    databaseURL: "https://chat-sagas.firebaseio.com",
    projectId: "chat-sagas",
    storageBucket: "chat-sagas.appspot.com",
    messagingSenderId: "332669953510",
    appId: "1:332669953510:web:dd1be2b3309ca0b739e227"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  export default firebase;