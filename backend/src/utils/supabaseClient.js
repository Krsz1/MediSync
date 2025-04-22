const { createClient } = require('@supabase/supabase-js');

// Crear una instancia del cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,  // URL de Supabase
  process.env.SUPABASE_KEY   // Clave de Supabase
);

module.exports = { supabase };  // Exportar el cliente para usarlo en otros archivos
