import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {FirebaseApp, getApp, getApps, initializeApp} from "firebase/app";
import { Auth, createUserWithEmailAndPassword, getAuth, initializeAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile, } from "firebase/auth";
import {Firestore, doc, initializeFirestore, serverTimestamp, setDoc,} from "firebase/firestore";

const firebaseAuth = require("firebase/auth");

const persistence =
  typeof firebaseAuth?.getReactNativePersistence === "function"
    ? firebaseAuth.getReactNativePersistence(ReactNativeAsyncStorage)
    : undefined;

const firebaseConfig = {
  apiKey: "AIzaSyBvMiPdG6LtPizH7qaEwVyy5gVL9sWc0yI",
  authDomain: "autodex-1983d.firebaseapp.com",
  projectId: "autodex-1983d",
  storageBucket: "autodex-1983d.firebasestorage.app",
  messagingSenderId: "924167490491",
  appId: "1:924167490491:web:ead353ddeb896d8377d29e",
  measurementId: "G-G2FZXVSCNT"
};

let app: FirebaseApp | null = null;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  app = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

  try {
    auth = initializeAuth(app, { persistence });
  } catch (error) {
    console.log("Error initializing auth:", error);
    auth = getAuth(app);
  }

  firestore = initializeFirestore(app, {});

  return { app, auth, firestore, };
}

export async function signUp( fullName: string, email: string, password: string ) {
  const userCredential = await createUserWithEmailAndPassword( auth, email, password);

  const user = userCredential.user;

  await updateProfile(user, { displayName: fullName, });
  await setDoc(doc(firestore, "users", user.uid), { uid: user.uid, fullName: fullName, email: email, createdAt: serverTimestamp(), });

  return userCredential;
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function signOut() {
  return firebaseSignOut(auth);
}

export { app, auth, firestore };