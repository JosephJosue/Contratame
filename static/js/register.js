//Cambios para Login con Google.
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMxpue-kQsfvvPSfqqPaHGpt4CucdWAks",
    authDomain: "contratame-a433d.firebaseapp.com",
    projectId: "contratame-a433d",
    storageBucket: "contratame-a433d.firebasestorage.app",
    messagingSenderId: "615790161398",
    appId: "1:615790161398:web:0758c7168da5ba1347abd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: 'select_account'
});

// Función para validar el formato de contraseña
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
        errors.push(`Mínimo ${minLength} caracteres.`);
    }
    if (!hasUpperCase) {
        errors.push("Debe contener al menos una letra mayúscula.");
    }
    if (!hasLowerCase) {
        errors.push("Debe contener al menos una letra minúscula.");
    }
    if (!hasNumbers) {
        errors.push("Debe contener al menos un número.");
    }
    if (!hasSpecialChars) {
        errors.push("Debe contener al menos un carácter especial.");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// función para manejar errores de Firebase 
function handleFirebaseError(error) {
    let message = "Ocurrió un error inesperado.";

    switch (error.code) {
        case 'auth/email-already-in-use':
            message = "El correo electrónico ya está en uso.";
            break;
        case 'auth/invalid-email':
            message = "El correo electrónico no es válido.";
            break;
        case 'auth/weak-password':
            message = "La contraseña es demasiado débil.";
            break;
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

// Función para el registro con Google
function signInWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            alert(`¡Cuenta creada exitosamente! Bienvenido, ${user.displayName}!`);
            console.log("Usuario autenticado con Google:", user);
            window.location.href = '/';
        })
        .catch((error) => {
            const errorMessage = handleFirebaseError(error);
            alert(errorMessage);
            console.error("Error en el registro con Google:", error);
        });
}

function initCarousel() {
    let currentSlide = 0;
    const totalSlides = 4;
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.indicator');

    function updateCarousel() {
        if (track) {
            track.style.transform = `translateX(-${currentSlide * 25}%)`;
        }
        if (indicators) {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        currentSlide = (currentSlide + 1) % totalSlides;
    }

    setInterval(updateCarousel, 5000);
}


// Manejar formulario de registro
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado");

    initCarousel();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log("Formulario de registro encontrado")

        registerForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission
            console.log("Formulario de registro enviado")

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (!name || !email || !password || !confirmPassword) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }

            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                alert(`Contraseña inválida: ${passwordValidation.errors.join(', ')}`);
                return;
            }

            console.log("Intentando crear usuario en Firebase")
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    return updateProfile(user, {
                        displayName: name
                    }).then(() => {
                        alert("Cuenta creada exitosamente");
                        console.log("Usuario creado:", user);
                        window.location.href = '/';
                    });
                })
                .catch((error) => {
                    console.error("Error en el registro:", error);
                    const errorMessage = handleFirebaseError(error);
                    alert(errorMessage);
                });
        });
    } else {
        console.log("Formulario de registro no encontrado")
    }

    // Event listener para TODOS los botones de Google
    const googleSignInButtons = document.querySelectorAll('.social');
    console.log("Botones de Google encontrados", googleSignInButtons.length)

    googleSignInButtons.forEach((button, index) => {
        console.log(`Configurando boon google ${index + 1}`);
        button.addEventListener('click', function (event) {
            event.preventDefault();
            console.log("Botón de Google presionado")
            signInWithGoogle();
        });
    });
});