// services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// ✅ YOUR ACTUAL FIREBASE CONFIG - PASTE FROM CONSOLE
export const firebaseConfig = {
  apiKey: "AIzaSyBmpiDMIbXxKrcdUBsZZiKkqMJpvbihIUI",
  authDomain: "ma-ca2-prjt.firebaseapp.com",
  projectId: "ma-ca2-prjt",
  storageBucket: "ma-ca2-prjt.firebasestorage.app",
  messagingSenderId: "899014832526",
  appId: "1:899014832526:web:d0e2a13c4c943be4e8b4df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// ✅ REAL Firebase service functions
export const FirebaseService = {
  // Initialize Firebase connection
  initialize: () => {
    console.log("✅ Firebase Initialized Successfully!");
    console.log("Project ID:", firebaseConfig.projectId);
    return Promise.resolve(app);
  },

  // Save data to Firebase
  saveData: async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString()
      });
      console.log(`✅ Saved to ${collectionName} with ID:`, docRef.id);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`❌ Error saving to ${collectionName}:`, error);
      throw error;
    }
  },

  // Get all data from a collection
  getData: async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ Fetched ${data.length} items from ${collectionName}`);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching from ${collectionName}:`, error);
      throw error;
    }
  },

  // Update existing data
  updateData: async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated ${collectionName}/${id}`);
      return { id, ...data };
    } catch (error) {
      console.error(`❌ Error updating ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  // Delete data
  deleteData: async (collectionName, id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      console.log(`✅ Deleted ${collectionName}/${id}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  // 🔐 AUTHENTICATION FUNCTIONS
  // Sign up with email/password
  signUp: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ User signed up:", userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error("❌ Sign up error:", error.message);
      throw error;
    }
  },

  // Sign in with email/password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ User signed in:", userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error("❌ Sign in error:", error.message);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      console.log("✅ User signed out");
      return true;
    } catch (error) {
      console.error("❌ Sign out error:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  }
};

// Export Firebase instances directly if needed
export { app, db, auth };

// Export as default
export default FirebaseService;