import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAi02viQy3XqDveavf5yxvQARtgKu9_JN8",
  authDomain: "play-book-99.firebaseapp.com",
  projectId: "play-book-99",
  storageBucket: "play-book-99.appspot.com",
  messagingSenderId: "83299396085",
  appId: "1:83299396085:web:6d9208d7010e17e823d8bc",
  measurementId: "G-XRYSXXRZH5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);