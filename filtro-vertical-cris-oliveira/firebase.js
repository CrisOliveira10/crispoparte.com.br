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

    apiKey: "AIzaSyBrBHiizigUbanLpgCLSQTnJbjoqGBGxCw",

    authDomain:
        "curso-filtro-vertical-cris.firebaseapp.com",

    projectId:
        "curso-filtro-vertical-cris",

    storageBucket:
        "curso-filtro-vertical-cris.firebasestorage.app",

    messagingSenderId:
        "375262539919",

    appId:
        "1:375262539919:web:a4df2240b21a95d47f00fa"

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