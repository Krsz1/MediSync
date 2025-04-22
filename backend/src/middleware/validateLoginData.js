// src/middlewares/validateLoginData.js
const validateLoginData = (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }
  
    next();
  };
  
  module.exports = validateLoginData;
  