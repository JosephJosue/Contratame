// auth.js - Actualizado con Firestore
import { auth } from './firebase-config.js';
import { firestoreService } from './firestore-service.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        const loggedInLinks = document.getElementById('logged-in-links');
        const loggedOutLinks = document.getElementById('logged-out-links');
        const userName = document.getElementById('user-name');

        if (user) {
            // User is signed in.
            loggedInLinks.style.display = 'flex';
            loggedOutLinks.style.display = 'none';
            userName.textContent = user.displayName || user.email;
            
            // lo nuevo comienza aca
            console.log("Usuario autenticado:", user);
            
            // Obtener o crear perfil del usuario en Firestore
            try {
                const profileResult = await firestoreService.getUserProfile(user.uid);
                if (profileResult.success) {
                    console.log("Perfil del usuario:", profileResult.data);
                } else {
                    console.log("Perfil no encontrado, creando uno nuevo...");
                    // Crear perfil básico si no existe
                    await firestoreService.saveUserProfile(user.uid, {
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        lastLogin: new Date()
                    });
                }
            } catch (error) {
                console.error("Error manejando perfil del usuario:", error);
            }
        // aca finaliza lo nuevo    
        
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
                console.error('Error al cerrar sesión:', error);
            });
        });
    }
});