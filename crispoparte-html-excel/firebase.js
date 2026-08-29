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

    apiKey: "AIzaSyD0ixwdgXb_IjiTzoiI-y82F-XZVlvJD7A",

    authDomain:
        "curso-html-crispoparte.firebaseapp.com",

    projectId:
        "curso-html-crispoparte",

    storageBucket:
        "curso-html-crispoparte.firebasestorage.app",

    messagingSenderId:
        "201299909454",

    appId:
        "1:201299909454:web:b7089ec282af59faca5c1f"

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