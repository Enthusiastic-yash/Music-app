
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyDRk13pEHeJDJ_dDV2qdLDOBZFHq2nYY_o",
    authDomain: "music-4c72e.firebaseapp.com",
    projectId: "music-4c72e",
    storageBucket: "music-4c72e.appspot.com",
    messagingSenderId: "847087097187",
    appId: "1:847087097187:web:a45472ab78fb086fb4ef56"
  };
  


// Initialize Firebase
 firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

  const usersCollection = db.collection('users')
  const songsCollection = db.collection('songs')
  const commentsCollection = db.collection('comments')

  
export{
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage
}
  