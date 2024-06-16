import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAjtZ3QqYvM74jmEcQSGxr745BX4KBibGE",
    authDomain: "quic-shipping.firebaseapp.com",
    projectId: "quic-shipping",
    storageBucket: "quic-shipping.appspot.com",
    messagingSenderId: "543136669497",
    appId: "1:543136669497:web:6f488db35cd9477f6212e8",
    measurementId: "G-PYN4Q9C0SW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };