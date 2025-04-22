const bcrypt = require('bcryptjs');
const { supabase } = require('../utils/supabaseClient'); // Importa el cliente de Supabase configurado previamente

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { fullName, email, password, identification, gender, userType } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const { data: existingUser } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Verificar si el número de identificación ya está registrado
    const { data: existingId } = await supabase
      .from('User')
      .select('*')
      .eq('identification', identification)
      .single();

    if (existingId) {
      return res.status(400).json({ message: 'El número de identificación ya está registrado' });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en Supabase (autenticación)
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
    });

    if (error) {
      return res.status(500).json({ message: 'Error al registrar el usuario en Supabase', error: error.message });
    }

    // Insertar los datos adicionales del usuario en la base de datos
    const { data: userInsert, error: dbError } = await supabase
      .from('User')
      .insert([{
        name: fullName,
        identification,
        email,
        gender,
        user_type: userType, // 'Patient', 'Medic', 'Admin'
      }]);

    if (dbError) {
      return res.status(500).json({ message: 'Error al guardar los datos del usuario en la base de datos', error: dbError.message });
    }

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

module.exports = { registerUser };
