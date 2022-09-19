import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAz7l5p5ynBVZq_vxNIcp-PipMdzXAF5fI",
    authDomain: "the-hyper-art-tutorials.firebaseapp.com",
    projectId: "the-hyper-art-tutorials",
    storageBucket: "the-hyper-art-tutorials.appspot.com",
    messagingSenderId: "660259225596",
    appId: "1:660259225596:web:7123660f306657a2637c79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { db, storage }