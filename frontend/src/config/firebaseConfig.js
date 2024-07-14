import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDQgPkMNgFQEYkLQl58t_HJDqGZsEHo2G4",
//   authDomain: "play-book2024.firebaseapp.com",
//   projectId: "play-book2024",
//   storageBucket: "play-book2024.appspot.com",
//   messagingSenderId: "737454250893",
//   appId: "1:737454250893:web:66cdae83824c11f4e57bc4",
//   measurementId: "G-HMGBZ8DB61"
// };

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);

export { auth };