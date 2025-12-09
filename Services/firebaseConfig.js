// services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmpiDMIbXxKrcdUBsZZiKkqMJpvbihIUI",
  authDomain: "ma-ca2-prjt.firebaseapp.com",
  projectId: "ma-ca2-prjt",
  storageBucket: "ma-ca2-prjt.firebasestorage.app",
  messagingSenderId: "899014832526",
  appId: "1:899014832526:web:d0e2a13c4c943be4e8b4df"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);