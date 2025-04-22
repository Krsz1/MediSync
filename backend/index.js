const dotenv = require('dotenv');
dotenv.config(); // Cargar las variables de entorno

const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');  // Asegúrate de que la ruta es correcta
const { createClient } = require('@supabase/supabase-js');  // Supabase client

dotenv.config(); // Cargar las variables de entorno

// Verificar si las variables de entorno están siendo cargadas correctamente
console.log("Supabase URL: ", process.env.SUPABASE_URL);
console.log("Supabase Key: ", process.env.SUPABASE_KEY);

const app = express();
const port = process.env.PORT || 5000; // Usar el puerto del entorno o 5000 por defecto

// Configuración de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,  // URL de Supabase
  process.env.SUPABASE_KEY   // Clave de Supabase
);

// Middleware para permitir solicitudes desde el frontend (CORS)
app.use(cors());

// Middleware para parsear el body como JSON
app.use(express.json());

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
