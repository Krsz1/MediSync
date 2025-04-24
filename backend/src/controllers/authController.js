import { signOut, signInWithEmailAndPassword, sendEmailVerification, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { auth, firestore } from "../utils/firebaseConfig.js";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Registro de usuario
export const registerUser = async (req, res) => {
    const { email, password, ...rest } = req.body;

    try {
        // Crear el usuario con Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid;

        // Actualizar el perfil con el nombre de usuario
        await updateProfile(user, { displayName: rest.username });

        // Guardar usuario en Firestore
        await setDoc(doc(firestore, "users", uid), {
            uid: uid,
            email: email,
            ...rest,
        });

        // Enviar correo de verificación de email
        await sendEmailVerification(user);

        return res.status(201).json({ message: "Usuario creado exitosamente. Verifica tu correo para completar el proceso." });
    } catch (err) {
        return res.status(500).json({ message: "Error al crear el usuario.", error: err.message });
    }
};

// Iniciar sesión de usuario
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Intentamos obtener al usuario desde Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verificar si el correo está verificado
        if (!user.emailVerified) {
            // Si el correo no está verificado, impedir el inicio de sesión
            return res.status(400).json({
                message: "Por favor verifica tu correo electrónico antes de intentar iniciar sesión."
            });
        }

        // Si el correo está verificado, continuar con el login
        return res.status(200).json({
            message: "Usuario logueado exitosamente.",
        });

    } catch (err) {
        // En caso de error, manejarlo
        console.error(err); // Mostrar error en la consola para depuración

        return res.status(500).json({ 
            message: "Error al loguear el usuario.",
            error: err.message 
        });
    }
};

// Cerrar sesión
export const logoutUser = async (req, res) => {
    try {
        await signOut(auth);
        return res.status(200).json({ message: "Usuario deslogueado exitosamente." });
    } catch (err) {
        return res.status(500).json({ message: "Error al desloguear el usuario.", error: err.message });
    }
};

// Recuperar credenciales de acceso (restablecer contraseña)
export const recoverPassword = async (req, res) => {
    const { email } = req.body;  // El correo proporcionado por el cliente

    try {
        // Enviar el enlace de restablecimiento de contraseña a través de Firebase
        await sendPasswordResetEmail(auth, email);

        return res.status(200).json({
            message: "Enlace para restablecer la contraseña enviado al correo electrónico. El enlace expirará en 10 minutos."
        });
    } catch (err) {
        // Si el correo no está registrado
        return res.status(400).json({
            message: "No se pudo enviar el enlace. Verifique si el correo está registrado.",
            error: err.message
        });
    }
};
