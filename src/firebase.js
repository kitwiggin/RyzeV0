// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBivNkNWEw2widW6C3evyXYdme6NToeNTI",
  authDomain: "ryzev0.firebaseapp.com",
  projectId: "ryzev0",
  //databaseURL: "https://ryzev0.firebaseio.com",
  storageBucket: "ryzev0.appspot.com",
  messagingSenderId: "944867547647",
  appId: "1:944867547647:web:3e1ad793d9042c4516efca",
  measurementId: "G-VJSEFENJFH",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
//const analytics = getAnalytics(firebaseApp);

/// Google authentication

// Login
const googleProvider = new GoogleAuthProvider();
const logInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/// Email/password authentication

// Login
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Register
const registerWithEmailAndPassword = async (
  name,
  username,
  avatar,
  email,
  password
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      username,
      avatar,
      authProvider: "local",
      email,
      verified: false,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Reset password
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/// Logout
const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
