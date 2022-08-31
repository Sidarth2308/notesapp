import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
const config = {
  apiKey: "AIzaSyBddi9bWMnPEDA-R6XfiucVaCLVl5m_IRA",
  authDomain: "notesapp-453d3.firebaseapp.com",
  projectId: "notesapp-453d3",
  storageBucket: "notesapp-453d3.appspot.com",
  messagingSenderId: "217906451333",
  appId: "1:217906451333:web:0a05e8bfa2e4fa6b0eaaec"
};

const firebase = Firebase.initializeApp(config);
export { firebase };
