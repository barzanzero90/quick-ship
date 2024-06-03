import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAyodnW2NjJ7wBMtmNOqy62U6ZfB_cfURs",
    authDomain: "barzan-drop-shipping.firebaseapp.com",
    projectId: "barzan-drop-shipping",
    storageBucket: "barzan-drop-shipping.appspot.com",
    messagingSenderId: "549744078272",
    appId: "1:549744078272:web:8c427873a4d2ec4cd8ac25",
    measurementId: "G-KDN5EW9MNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };