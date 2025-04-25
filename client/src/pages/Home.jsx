import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import background from "../assets/background.png";
import logo from "../assets/logo.png";

import { useAuth } from "../context/authContextInstance"; // Importar el contexto de autenticación

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutUser } = useAuth(); // Obtener el usuario del contexto de autenticación

  return (
    <div className="home-wrapper">
      <div
        className="home-container"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="logo-container">
          <img src={logo} alt="MediSync Logo" className="logo-overlay" />
        </div>

        {/* Botones posicionados por separado */}
        <div className="button-container">
          {isAuthenticated && user ? (
            // Mostrar botón de logout si el usuario está autenticado
            <button className="btn btn-logout" onClick={logoutUser}>
              Logout
            </button>
          ) : (
            // Mostrar botones de registro e inicio de sesión si no está autenticado
            <>
              <button
                className="btn btn-register"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
              <button
                className="btn btn-signin"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </>
          )}
        </div>

        {/* Contenido visible en el centro */}
        <main className="description-content">
          <div className="home-content">
            <h2>WELCOME TO MEDISYNC</h2>
            <h1>Salud Total Private Clinic Network</h1>
            <p>
              MediSync is a centralized system that optimizes medical
              appointment management in the Salud Total Private Clinic Network,
              improving coordination and efficiency across the network’s 25
              clinics.
            </p>
          </div>

          {/* Textos alineados a íconos del background */}
          <div className="icon-texts">
            <p className="icon-text first">
              Centralized Appointment
              <br />
              Management
            </p>
            <p className="icon-text second">Access to Medical Records</p>
            <p className="icon-text third">Automatic Reminders</p>
          </div>

          <div className="spacer-bottom"></div>
        </main>
      </div>
    </div>
  );
}
