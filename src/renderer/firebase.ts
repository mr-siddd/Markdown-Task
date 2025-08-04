//import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
    onAuthStateChanged
} from 'firebase/auth';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC78E6oX_aitbEAHsz8JZWgMkCwpNxvbGI",
  authDomain: "vibetesting-1cr.firebaseapp.com",
  projectId: "vibetesting-1cr",
  storageBucket: "vibetesting-1cr.firebasestorage.app",
  messagingSenderId: "193087041235",
  appId: "1:193087041235:web:3d6321d2a488cdbc24ae26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  return signOut(auth);
};

export { onAuthStateChanged }; 
   export type { User };

