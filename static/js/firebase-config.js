// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCMxpue-kQsfvvPSfqqPaHGpt4CucdWAks",
    authDomain: "contratame-a433d.firebaseapp.com",
    projectId: "contratame-a433d",
    storageBucket: "contratame-a433d.firebasestorage.app",
    messagingSenderId: "615790161398",
    appId: "1:615790161398:web:0758c7168da5ba1347abd7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;