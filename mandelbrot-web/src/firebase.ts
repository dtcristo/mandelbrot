import firebase from "firebase/app";
import "firebase/firestore";

export const app = firebase.initializeApp({ projectId: "mandelbrot-rust" });
export const firestore = firebase.firestore();
