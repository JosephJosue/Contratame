// firestore-service.js
import { 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { db } from './firebase-config.js';

class FirestoreService {
    constructor() {
        this.db = db;
    }

async createDocument(collectionName, docId, data) {
    try {
        const docRef = doc(this.db, collectionName, docId);

        // --- ¡Añade esta línea para inspeccionar los datos! ---
        console.log("Datos que se enviarán a Firebase:", data);
        // -----------------------------------------------------

        await setDoc(docRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log('Documento creado exitosamente');
        return { success: true, id: docId };
    } catch (error) {
        console.error('Error creando documento:', error);
        return { success: false, error: error.message };
    }
}

    // Agregar documento con ID automático
    async addDocument(collectionName, data) {
        try {
            const docRef = await addDoc(collection(this.db, collectionName), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log('Documento agregado con ID:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error agregando documento:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener documento por ID
    async getDocument(collectionName, docId) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
            } else {
                console.log('Documento no encontrado');
                return { success: false, error: 'Documento no encontrado' };
            }
        } catch (error) {
            console.error('Error obteniendo documento:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener todos los documentos de una colección
    async getDocuments(collectionName, conditions = []) {
        try {
            let q = collection(this.db, collectionName);
            
            // Aplicar condiciones si existen
            if (conditions.length > 0) {
                const queryConstraints = conditions.map(condition => {
                    if (condition.type === 'where') {
                        return where(condition.field, condition.operator, condition.value);
                    } else if (condition.type === 'orderBy') {
                        return orderBy(condition.field, condition.direction || 'asc');
                    }
                });
                q = query(q, ...queryConstraints);
            }
            
            const querySnapshot = await getDocs(q);
            const documents = [];
            
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, data: documents };
        } catch (error) {
            console.error('Error obteniendo documentos:', error);
            return { success: false, error: error.message };
        }
    }

    // Actualizar documento
    async updateDocument(collectionName, docId, data) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
            console.log('Documento actualizado exitosamente');
            return { success: true };
        } catch (error) {
            console.error('Error actualizando documento:', error);
            return { success: false, error: error.message };
        }
    }

    // Eliminar documento
    async deleteDocument(collectionName, docId) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            await deleteDoc(docRef);
            console.log('Documento eliminado exitosamente');
            return { success: true };
        } catch (error) {
            console.error('Error eliminando documento:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener documentos del usuario actual
    async getUserDocuments(collectionName, userId) {
        const conditions = [
            { type: 'where', field: 'userId', operator: '==', value: userId },
            { type: 'orderBy', field: 'createdAt', direction: 'desc' }
        ];
        return await this.getDocuments(collectionName, conditions);
    }

    // Guardar CV del usuario
    async saveUserCV(userId, cvData) {
        return await this.createDocument('cvs', userId, {
            ...cvData,
            userId: userId
        });
    }

    // Obtener CV del usuario
    async getUserCV(userId) {
        return await this.getDocument('cvs', userId);
    }

    // Guardar perfil del usuario
    async saveUserProfile(userId, profileData) {
        return await this.createDocument('profiles', userId, {
            ...profileData,
            userId: userId
        });
    }

    // Obtener perfil del usuario
    async getUserProfile(userId) {
        return await this.getDocument('profiles', userId);
    }
}

// Exportar instancia del servicio
export const firestoreService = new FirestoreService();
export default firestoreService;