import React from "react";
import "./Login.css";
import logo from "../assets/logo_login.png"; 

export default function Login() {
  return (
    <div className="login-page-container">
      <div className="login-logo-container">
        <img src={logo} alt="MediSync Logo" className="login-logo" />
      </div>
      <h1 className="login-title">Login</h1>
    </div>
  );
}
