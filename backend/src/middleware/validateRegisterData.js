// src/middlewares/validateRegisterData.js
const validateRegisterData = (req, res, next) => {
    const { fullName, email, password, identification, gender, userType } = req.body;
  
    if (!fullName || !email || !password || !identification || !gender || !userType) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }
  
    next();
  };
  
  module.exports = validateRegisterData;
  