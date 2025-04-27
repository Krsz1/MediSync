import { jest } from "@jest/globals"; 
import {
    registerUser,
    loginUser,
    logoutUser,
    recoverPassword,
    checkAuth
} from "../controllers/authController"; 

import { auth, firestore } from "../utils/firebaseConfig"; 
import { FIREBASE_ERRORS } from "../utils/constants";  

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth"; 

import { doc, setDoc, getDoc } from "firebase/firestore";  

jest.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: jest.fn(),  
    signInWithEmailAndPassword: jest.fn(), 
    signOut: jest.fn(), 
    sendEmailVerification: jest.fn(),  
    sendPasswordResetEmail: jest.fn(), 
    updateProfile: jest.fn(),  
}));

jest.mock("firebase/firestore", () => ({
    doc: jest.fn(), 
    setDoc: jest.fn(),  
    getDoc: jest.fn(),  
}));

jest.mock("../utils/firebaseConfig", () => ({
    auth: { currentUser: null },  
    firestore: {}, 
}));

describe("Auth Controller", () => {
    let req, res;  
    beforeEach(() => {
        
        req = { body: {} };  
        res = {
            status: jest.fn(() => res), 
            json: jest.fn(),  
        };
        jest.clearAllMocks();  
    });

    describe("registerUser", () => {
        it("debería registrar un usuario correctamente", async () => {
            const mockUser = { uid: "123", email: "test@example.com" };  
            const mockUserCredential = { user: mockUser };  

            req.body = { email: "test@example.com", password: "password123", username: "testuser" };  
            createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);  
            updateProfile.mockResolvedValue();  
            setDoc.mockResolvedValue();  
            sendEmailVerification.mockResolvedValue(); 
            doc.mockReturnValue({});  

            await registerUser(req, res);  

        
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
            expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: "testuser" });
            expect(setDoc).toHaveBeenCalled(); 
            expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);  
            expect(res.status).toHaveBeenCalledWith(201); 
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringContaining("Usuario creado exitosamente"), 
            });
        });

        it("debería manejar error en registro", async () => {
            req.body = { email: "test@example.com", password: "password123" }; 
            createUserWithEmailAndPassword.mockRejectedValue({ code: "auth/email-already-in-use" });  

            await registerUser(req, res);  

            expect(res.status).toHaveBeenCalledWith(400); 
            expect(res.json).toHaveBeenCalledWith({
                message: FIREBASE_ERRORS["auth/email-already-in-use"],  
            });
        });
    });

    describe("loginUser", () => {
        it("debería loguear usuario con email verificado", async () => {
            const mockUser = { uid: "123", email: "test@example.com", emailVerified: true, displayName: "TestUser" };  // Usuario simulado
            const mockUserCredential = { user: mockUser };  
            req.body = { email: "test@example.com", password: "password123" }; 
            signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);  

            await loginUser(req, res);  

            expect(res.status).toHaveBeenCalledWith(200); 
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
            const mockUser = { emailVerified: false };  
            signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });  
            req.body = { email: "test@example.com", password: "password123" };  

            await loginUser(req, res);  

            expect(res.status).toHaveBeenCalledWith(403); 
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringContaining("verifica tu correo"),  
            });
        });
    });

    describe("logoutUser", () => {
        it("debería cerrar sesión correctamente", async () => {
            signOut.mockResolvedValue();  

            await logoutUser(req, res);  

            expect(signOut).toHaveBeenCalledWith(auth);  
            expect(res.status).toHaveBeenCalledWith(200); 
            expect(res.json).toHaveBeenCalledWith({ message: "Sesión cerrada exitosamente." });  
        });
    });


    describe("recoverPassword", () => {
        it("debería enviar correo de recuperación", async () => {
            sendPasswordResetEmail.mockResolvedValue();  
            req.body = { email: "test@example.com" }; 

            await recoverPassword(req, res);  

            expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, "test@example.com");  
            expect(res.status).toHaveBeenCalledWith(200);  
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringContaining("Se ha enviado un enlace de recuperación"), 
            });
        });
    });


    describe("checkAuth", () => {
        it("debería devolver el usuario si está autenticado", async () => {
            auth.currentUser = { uid: "123", email: "test@example.com" };  
            const mockUserData = { username: "TestUser" };  
            getDoc.mockResolvedValue({ data: () => mockUserData });  
            doc.mockReturnValue({}); 

            await checkAuth(req, res);  

            expect(res.json).toHaveBeenCalledWith({
                uid: "123",  
                ...mockUserData,  
            });
        });

        it("debería devolver 401 si no está autenticado", async () => {
            auth.currentUser = null; 

            await checkAuth(req, res);  

            expect(res.status).toHaveBeenCalledWith(401);  
            expect(res.json).toHaveBeenCalledWith({
                message: "No está autenticado",  
            });
        });
    });
});
