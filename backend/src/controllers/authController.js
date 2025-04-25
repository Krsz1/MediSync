import {
    signOut,
    signInWithEmailAndPassword,
    sendEmailVerification,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth, firestore } from "../utils/firebaseConfig.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { FIREBASE_ERRORS } from "../utils/constants.js";

// Registro
export const registerUser = async (req, res) => {
    const { email, password, ...rest } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid;

        await updateProfile(user, { displayName: rest.username });

        await setDoc(doc(firestore, "users", uid), {
            uid,
            email,
            ...rest,
        });

        await sendEmailVerification(user);

        return res.status(201).json({
            message: "Usuario creado exitosamente. Verifica tu correo para completar el proceso.",
        });
    } catch (err) {
        console.log(err.code);
        return res.status(400).json({
            message: FIREBASE_ERRORS[err.code] || "Ocurrió un error inesperado."
        });
    }
};

// Login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Por favor verifica tu correo electrónico antes de iniciar sesión.",
            });
        }

        return res.status(200).json({
            message: "Usuario logueado exitosamente.",
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            },
        });
    } catch (err) {
        return res.status(401).json({
            message: FIREBASE_ERRORS[err.code] || "Credenciales inválidas."
        });
    }
};

// Logout
export const logoutUser = async (req, res) => {
    try {
        await signOut(auth);
        return res.status(200).json({ message: "Sesión cerrada exitosamente." });
    } catch (err) {
        return res.status(500).json({
            message: FIREBASE_ERRORS[err.code] || "Credenciales inválidas.",
            error: err.code || err.message,
        });
    }
};

// Recuperar contraseña
export const recoverPassword = async (req, res) => {
    const { email } = req.body;

    try {
        await sendPasswordResetEmail(auth, email);
        return res.status(200).json({
            message: "Se ha enviado un enlace de recuperación a tu correo electrónico.",
        });
    } catch (err) {
        return res.status(400).json({
            message: FIREBASE_ERRORS[err.code] || "Credenciales inválidas."
        });
    }
};

export const checkAuth = async (req, res) => {
    const user = auth.currentUser;
    if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(docRef);
        const userData = userDoc.data();

        return res.json({ uid: user.uid, ...userData });
    } else {
        return res.status(401).json({ message: "No está autenticado" });
    }
};
