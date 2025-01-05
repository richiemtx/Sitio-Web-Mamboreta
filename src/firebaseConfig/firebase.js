import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqyMAMByTX0b0bqvHu-o9IoJSG3voYjsw",
  authDomain: "mambo-4f8ba.firebaseapp.com",
  projectId: "mambo-4f8ba",
  storageBucket: "mambo-4f8ba.firebasestorage.app",
  messagingSenderId: "326320108967",
  appId: "1:326320108967:web:2076ef0192aebbc7657282"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);