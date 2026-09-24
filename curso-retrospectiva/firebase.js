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

    apiKey: "AIzaSyDrQyWZfnaun7bjnTwT67fkR3W5vkdlV3c",

    authDomain:
        "retrospectiva-crispoparte.firebaseapp.com",

    projectId:
        "retrospectiva-crispoparte",

    storageBucket:
        "retrospectiva-crispoparte.firebasestorage.app",

    messagingSenderId:
        "96658475034",

    appId:
        "1:96658475034:web:5acaa5008fcccd04f4e9a3"

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