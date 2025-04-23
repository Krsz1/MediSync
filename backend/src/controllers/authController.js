import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../utils/firebaseConfig.js";

export const registerUser = async (req, res) => {
    const { email, password, ...rest } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;
        const uid = user.uid;

        updateProfile(user, {
            displayName: rest.username
        });

        await setDoc(doc(firestore, "users", uid), {
            uid: uid,
            email: email,
            ...rest,
        });

        return res.status(201).json({ message: "Usuario creado exitosamente." });
    } catch (err) {
        return res.status(500).json({ message: "Error al crear el usuario.", error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        return res.status(200).json({ message: "Usuario logueado exitosamente.", uid });
    } catch (err) {
        return res.status(500).json({ message: "Error al loguear el usuario.", error: err.message });
    }
}

export const logoutUser = async (req, res) => {
    try {
        await signOut(auth);
        return res.status(200).json({ message: "Usuario deslogueado exitosamente." });
    } catch (err) {
        return res.status(500).json({ message: "Error al desloguear el usuario.", error: err.message });
    }
}
