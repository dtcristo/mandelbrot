import firebase from "firebase/app";
import "firebase/firestore";

export const app = firebase.initializeApp({ projectId: "mandelbrot-9b386" });
export const firestore = firebase.firestore();
