import React from "react";
import "./Login.css";
import logo from "../assets/logo_login.png";
import { useAuth } from "../context/authContextInstance";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Login() {
  const { loginUser, error: loginErrors } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await loginUser(data);
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <h1>Iniciar sesión</h1>
        {loginErrors && (
          <span className="error-label" role="alert">
            {loginErrors}
          </span>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Este campo es obligatorio" })}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span className="error" role="alert">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Este campo es obligatorio",
              })}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <span className="error" role="alert">
                {errors.password.message}
              </span>
            )}
          </div>

          <button type="submit" className="btn-login">
            Iniciar sesión
          </button>
        </form>

        <p className="register-link">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="link-register">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
