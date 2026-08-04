import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC4v_E2w7fHoZ1AZlBGLEtr3VWsWbUKTqU",
  authDomain: "mobile-web-app-40ae4.firebaseapp.com",
  databaseURL: "https://mobile-web-app-40ae4-default-rtdb.firebaseio.com",
  projectId: "mobile-web-app-40ae4",
  storageBucket: "mobile-web-app-40ae4.firebasestorage.app",
  messagingSenderId: "426457591853",
  appId: "1:426457591853:web:8b7aaa9aae8f0fe38688a4",
  measurementId: "G-GWB7K1N0WJ",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
