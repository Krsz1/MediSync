// Importamos las dependencias necesarias
import { jest } from "@jest/globals";  // Importación para usar Jest en ESM
import {
    registerUser,
    loginUser,
    logoutUser,
    recoverPassword,
    checkAuth
} from "../controllers/authController";  // Importamos las funciones que vamos a testear

import { auth, firestore } from "../utils/firebaseConfig";  // Importamos la configuración de Firebase
import { FIREBASE_ERRORS } from "../utils/constants";  // Importamos los errores personalizados de Firebase

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth";  // Importamos las funciones de autenticación de Firebase

import { doc, setDoc, getDoc } from "firebase/firestore";  // Importamos funciones de Firestore

// Mock de las funciones de Firebase para simular sus respuestas
jest.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: jest.fn(),  // Mock de la función para crear usuarios
    signInWithEmailAndPassword: jest.fn(),  // Mock de la función para hacer login
    signOut: jest.fn(),  // Mock de la función para cerrar sesión
    sendEmailVerification: jest.fn(),  // Mock de la función para enviar verificación de email
    sendPasswordResetEmail: jest.fn(),  // Mock de la función para enviar recuperación de contraseña
    updateProfile: jest.fn(),  // Mock de la función para actualizar el perfil del usuario
}));

jest.mock("firebase/firestore", () => ({
    doc: jest.fn(),  // Mock de la función para obtener un documento
    setDoc: jest.fn(),  // Mock de la función para guardar un documento
    getDoc: jest.fn(),  // Mock de la función para obtener un documento
}));

// Mock del archivo de configuración de Firebase
jest.mock("../utils/firebaseConfig", () => ({
    auth: { currentUser: null },  // Mock del objeto auth con el usuario actual
    firestore: {},  // Mock de firestore, vacío por ahora
}));

describe("Auth Controller", () => {
    let req, res;  // Variables que representan la solicitud (req) y la respuesta (res)

    beforeEach(() => {
        // Configuramos los mocks antes de cada test
        req = { body: {} };  // Simulamos el cuerpo de la solicitud
        res = {
            status: jest.fn(() => res),  // Mock de la función de respuesta para el estado HTTP
            json: jest.fn(),  // Mock de la función de respuesta para enviar JSON
        };
        jest.clearAllMocks();  // Limpiamos los mocks antes de cada prueba
    });

    // Test para registrar un usuario
    describe("registerUser", () => {
        it("debería registrar un usuario correctamente", async () => {
            const mockUser = { uid: "123", email: "test@example.com" };  // Usuario simulado
            const mockUserCredential = { user: mockUser };  // Credenciales simuladas de usuario

            req.body = { email: "test@example.com", password: "password123", username: "testuser" };  // Datos del formulario
            createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);  // Mock de la creación del usuario
            updateProfile.mockResolvedValue();  // Mock de la actualización del perfil
            setDoc.mockResolvedValue();  // Mock de la creación del documento en Firestore
            sendEmailVerification.mockResolvedValue();  // Mock del envío de verificación de email
            doc.mockReturnValue({});  // Mock de la función doc (no importa el valor aquí)

            await registerUser(req, res);  // Llamada a la función que estamos testeando

            // Comprobamos que las funciones se hayan llamado con los argumentos correctos
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
            expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: "testuser" });
            expect(setDoc).toHaveBeenCalled();  // Verificamos que el documento fue creado
            expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);  // Verificamos que el email fue enviado
            expect(res.status).toHaveBeenCalledWith(201);  // Comprobamos que la respuesta es un estado 201
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringContaining("Usuario creado exitosamente"),  // Verificamos el mensaje de la respuesta
            });
        });

        it("debería manejar error en registro", async () => {
            req.body = { email: "test@example.com", password: "password123" };  // Datos del formulario
            createUserWithEmailAndPassword.mockRejectedValue({ code: "auth/email-already-in-use" });  // Simulamos error de email ya en uso

            await registerUser(req, res);  // Llamada a la función que estamos testeando

            expect(res.status).toHaveBeenCalledWith(400);  // Comprobamos que el código de estado es 400
            expect(res.json).toHaveBeenCalledWith({
                message: FIREBASE_ERRORS["auth/email-already-in-use"],  // Comprobamos el mensaje de error
            });
        });
    });

    // Test para loguear un usuario
    describe("loginUser", () => {
        it("debería loguear usuario con email verificado", async () => {
            const mockUser = { uid: "123", email: "test@example.com", emailVerified: true, displayName: "TestUser" };  // Usuario simulado
            const mockUserCredential = { user: mockUser };  // Credenciales simuladas de usuario
            req.body = { email: "test@example.com", password: "password123" };  // Datos del formulario
            signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);  // Mock de la función de login

            await loginUser(req, res);  // Llamada a la función que estamos testeando

            expect(res.status).toHaveBeenCalledWith(200);  // Verificamos que el código de estado es 200
            expect(res.json).toHaveBeenCalledWith({
                message: "Usuario logueado exitosamente.",
                user: {
                    uid: mockUser.uid,
                    email: mockUser.email,
                    displayName: mockUser.displayName,
                },
            });
        });

        it("debería bloquear login si el email no está verificado", async () => {
            const mockUser = { emailVerified: false };  // Usuario simulado con email no verificado
            signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });  // Mock de la función de login
            req.body = { email: "test@example.com", password: "password123" };  // Datos del formulario

            await loginUser(req, res);  // Llamada a la función que estamos testeando

            expect(res.status).toHaveBeenCalledWith(403);  // Verificamos que el código de estado es 403
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringContaining("verifica tu correo"),  // Comprobamos el mensaje de error
            });
        });
    });

    // Test para cerrar sesión
    describe("logoutUser", () => {
        it("debería cerrar sesión correctamente", async () => {
            signOut.mockResolvedValue();  // Mock de la función de logout

            await logoutUser(req, res);  // Llamada a la función que estamos testeando

            expect(signOut).toHaveBeenCalledWith(auth);  // Verificamos que se llame a la función signOut
            expect(res.status).toHaveBeenCalledWith(200);  // Verificamos que el código de estado es 200
            expect(res.json).toHaveBeenCalledWith({ message: "Sesión cerrada exitosamente." });  // Comprobamos el mensaje de éxito
        });
    });

    // Test para recuperación de contraseña
    describe("recoverPassword", () => {
        it("debería enviar correo de recuperación", async () => {
            sendPasswordResetEmail.mockResolvedValue();  // Mock de la función de recuperación de contraseña
            req.body = { email: "test@example.com" };  // Datos del formulario

            await recoverPassword(req, res);  // Llamada a la función que estamos testeando

            expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, "test@example.com");  // Verificamos que se llame a la función con el email correcto
            expect(res.status).toHaveBeenCalledWith(200);  // Verificamos que el código de estado es 200
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringContaining("Se ha enviado un enlace de recuperación"),  // Verificamos el mensaje de éxito
            });
        });
    });

    // Test para comprobar si el usuario está autenticado
    describe("checkAuth", () => {
        it("debería devolver el usuario si está autenticado", async () => {
            auth.currentUser = { uid: "123", email: "test@example.com" };  // Usuario simulado autenticado
            const mockUserData = { username: "TestUser" };  // Datos simulados del usuario
            getDoc.mockResolvedValue({ data: () => mockUserData });  // Mock de la función getDoc
            doc.mockReturnValue({});  // Mock de la función doc (no importa el valor aquí)

            await checkAuth(req, res);  // Llamada a la función que estamos testeando

            expect(res.json).toHaveBeenCalledWith({
                uid: "123",  // Verificamos que se devuelve el UID correcto
                ...mockUserData,  // Verificamos los datos del usuario
            });
        });

        it("debería devolver 401 si no está autenticado", async () => {
            auth.currentUser = null;  // Simulamos que no hay usuario autenticado

            await checkAuth(req, res);  // Llamada a la función que estamos testeando

            expect(res.status).toHaveBeenCalledWith(401);  // Verificamos que el código de estado es 401
            expect(res.json).toHaveBeenCalledWith({
                message: "No está autenticado",  // Verificamos el mensaje de error
            });
        });
    });
});
