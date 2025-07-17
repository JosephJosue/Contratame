import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCMxpue-kQsfvvPSfqqPaHGpt4CucdWAks",
    authDomain: "contratame-a433d.firebaseapp.com",
    projectId: "contratame-a433d",
    storageBucket: "contratame-a433d.firebasestorage.app",
    messagingSenderId: "615790161398",
    appId: "1:615790161398:web:0758c7168da5ba1347abd7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        const loggedInLinks = document.getElementById('logged-in-links');
        const loggedOutLinks = document.getElementById('logged-out-links');
        const userName = document.getElementById('user-name');

        if (user) {
            // User is signed in.
            loggedInLinks.style.display = 'flex';
            loggedOutLinks.style.display = 'none';
            userName.textContent = user.displayName || user.email;
            console.log("Este es el usuario: ",user)
        } else {
            // User is signed out.
            loggedInLinks.style.display = 'none';
            loggedOutLinks.style.display = 'flex';
        }
    });

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                window.location.href = '/';
            }).catch((error) => {
                console.error('Logout Error:', error);
            });
        });
    }
});
