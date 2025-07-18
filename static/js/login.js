import {initializeApp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: 'select_account'
});

function handleFirebaseError(error) {
    let message = "Ocurrió un error inesperado.";
    switch (error.code) {
        case 'auth/user-not-found':
            message = "No se encontró el usuario.";
            break;
        case 'auth/wrong-password':
            message = "La contraseña es incorrecta.";
            break;
        case 'auth/too-many-requests':
            message = "Demasiados intentos fallidos. Por favor, inténtalo de nuevo más tarde.";
            break;
        case 'auth/network-request-failed':
            message = "Error de red. Por favor, verifica tu conexión a Internet.";
            break;
        case 'auth/popup-closed-by-user':
            message = "El popup fue cerrado antes de completar el inicio de sesión.";
            break;
        case 'auth/popup-blocked':
            message = "El popup fue bloqueado por el navegador. Por favor, permite los popups para este sitio.";
            break;
        default:
            message = error.message || "Ocurrió un error inesperado.";
    }
    return message;
}

import { firestoreService } from './firestore-service.js';

async function checkUserProfile(user) {
    try {
        const profile = await firestoreService.getUserProfile(user.uid);
        if (profile.success && profile.data.profileComplete) {
            window.location.href = '/';
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error checking user profile:', error);
        // Redirect to profile form by default if there's an error
        window.location.href = '/';
    }
}

function signInWithGoogle() {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            const user = result.user;
            console.log("Usuario autenticado con Google:", user);
            checkUserProfile(user);
        })
        .catch((error) => {
            const errorMessage = handleFirebaseError(error);
            alert(errorMessage);
            console.error("Error en el inicio de sesión con Google:", error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Carousel functionality
    let currentSlide = 0;
    const totalSlides = 4;
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.indicator');

    function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * 25}%)`;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        currentSlide = (currentSlide + 1) % totalSlides;
    }

    setInterval(updateCarousel, 5000);

    // Google Login
    const googleLoginButton = document.getElementById('googleLogin');
    googleLoginButton.addEventListener('click', (e) => {
        e.preventDefault();
        signInWithGoogle();
    });

    // Email/Password Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Usuario autenticado:', user);
                    checkUserProfile(user);
                })
                .catch((error) => {
                    const errorMessage = handleFirebaseError(error);
                    alert(errorMessage);
                });
        });
    }

    // Forgot Password
    const forgotPasswordButton = document.getElementById('forgotPassword');
    forgotPasswordButton.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (!email) {
            alert('Por favor, ingresa tu correo electrónico para restablecer la contraseña.');
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Se ha enviado un correo para restablecer tu contraseña.');
            })
            .catch((error) => {
                alert(handleFirebaseError(error));
            });
    });
});
