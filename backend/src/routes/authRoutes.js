import { Router } from 'express';
import { registerUser, loginUser, logoutUser, recoverPassword, checkAuth } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.post("/recover-password", recoverPassword); //ruta para recuperación de contraseña
router.get('/check-auth', checkAuth);

export default router;