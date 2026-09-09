import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyAc3mGk3rZRMdXsxBtAE8OS3zLVcEkiFDI",

    authDomain:
        "curso-cinema-crispoparte.firebaseapp.com",

    projectId:
        "curso-cinema-crispoparte",

    storageBucket:
        "curso-cinema-crispoparte.firebasestorage.app",

    messagingSenderId:
        "971444990421",

    appId:
        "1:971444990421:web:d524c3634698433d4c8d5c"

};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);


export {

    onAuthStateChanged,

    doc,

    setDoc,

    getDoc,

    collection,

    getDocs

};