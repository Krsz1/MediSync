import { z } from 'zod';

// Campos comunes
const baseUserSchema = z.object({
    name: z
        .string()
        .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
        .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),
    email: z
        .string()
        .email({ message: "Correo electrónico inválido" })
        .nonempty({ message: "El correo es obligatorio" }),
    username: z
        .string()
        .min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" })
        .max(50, { message: "El nombre de usuario no puede exceder los 50 caracteres" }),
    password: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .refine((val) => (val.match(/[A-Z]/g) || []).length >= 2, {
            message: "La contraseña debe contener al menos 2 letras mayúsculas",
        })
        .refine((val) => (val.match(/[a-z]/g) || []).length >= 2, {
            message: "La contraseña debe contener al menos 2 letras minúsculas",
        })
        .refine((val) => (val.match(/[0-9]/g) || []).length >= 2, {
            message: "La contraseña debe contener al menos 2 números",
        })
        .refine((val) => (val.match(/[\W_]/g) || []).length >= 2, {
            message: "La contraseña debe contener al menos 2 caracteres especiales",
        })
});

// Schema por rol
const doctorSchema = baseUserSchema.extend({
    role: z.literal("medic"),
    specialty: z
        .string()
        .min(3, { message: "La especialidad debe tener al menos 3 caracteres." })
});

const patientSchema = baseUserSchema.extend({
    role: z.literal("patient"),
    dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Fecha inválida (Debe ser YYYY-MM-DD)" })
});

const adminSchema = baseUserSchema.extend({
    role: z.literal("admin"),
});

// Unión discriminada
export const registerSchema = z.discriminatedUnion("role", [
    doctorSchema,
    patientSchema,
    adminSchema,
]);

export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Correo inválido" }),
    password: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});
