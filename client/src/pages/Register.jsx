import React, { useState } from "react";
import "./Register.css";
import logo from "../assets/logo_register.png";
import axios from 'axios'; // Para hacer solicitudes HTTP

export default function Register() {
  const [formData, setFormData] = useState({
    identification: "",
    fullName: "",
    gender: "",
    birthday: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "Patient"  // Default role set to 'Patient', can change if needed
  });
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar el formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coinciden
    if (formData.password !== formData.confirmPassword) {
      return alert("Las contraseñas no coinciden.");
    }

    try {
      // Enviar la solicitud de registro al backend
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        identification: formData.identification,
        gender: formData.gender,
        userType: formData.userType,  // Pasar el tipo de usuario aquí
      });

      // Manejo de la respuesta del backend
      if (response.status === 201) {
        alert('Usuario registrado exitosamente');
        // Redirigir a la página de login o hacer algo más
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un error al registrar el usuario. Intenta de nuevo.');
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-logo-container">
        <img src={logo} alt="MediSync Logo" className="register-logo" />
      </div>
      <h1 className="register-title">Register</h1>

      {/* Formulario de registro */}
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="identification"
          placeholder="Número de Identificación"
          value={formData.identification}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fullName"
          placeholder="Nombres y Apellidos"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar Género</option>
          <option value="Male">Masculino</option>
          <option value="Female">Femenino</option>
        </select>
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Número de Celular"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          required
        >
          <option value="Patient">Paciente</option>
          <option value="Medic">Médico</option>
          <option value="Admin">Administrador</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
