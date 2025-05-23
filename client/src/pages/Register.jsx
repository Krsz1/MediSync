import React from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContextInstance";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { registerUser, error: registerError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const role = watch("role");

  const onSubmit = async (data) => {
    const {
      fullName,
      email,
      username,
      password,
      role,
      specialty,
      dateOfBirth,
    } = data;

    const userData = {
      name: fullName,
      email,
      username,
      password,
      role: role.toLowerCase(),
      ...(role === "Medic" && { specialty }),
      ...(role === "Patient" && { dateOfBirth }),
    };
    registerUser(userData);
    navigate("/login");
  };

  return (
    <div className="register-page-container">
      <div className="register-container">
        <h1>Registro</h1>
        {registerError && (
          <span className="error-label" role="alert">
            {registerError}
          </span>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-group form-group-full">
            <label htmlFor="fullName">Nombre completo</label>
            <input
              type="text"
              id="fullName"
              placeholder="Nombre completo"
              {...register("fullName", {
                required: "Este campo es obligatorio",
              })}
              aria-invalid={errors.fullName ? "true" : "false"}
            />
            {errors.fullName && (
              <span className="error" role="alert">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="Correo electrónico"
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
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Nombre de usuario"
              {...register("username", {
                required: "Este campo es obligatorio",
              })}
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username && (
              <span className="error" role="alert">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirmar contraseña"
              {...register("confirmPassword", {
                required: "Este campo es obligatorio",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            {errors.confirmPassword && (
              <span className="error" role="alert">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Tipo de usuario</label>
            <select
              id="role"
              {...register("role", { required: "Este campo es obligatorio" })}
              aria-invalid={errors.role ? "true" : "false"}
            >
              <option value="">Seleccionar tipo de usuario</option>
              <option value="Patient">Paciente</option>
              <option value="Medic">Médico</option>
            </select>
            {errors.role && (
              <span className="error" role="alert">
                {errors.role.message}
              </span>
            )}
          </div>

          {role === "Medic" && (
            <div className="form-group">
              <label htmlFor="specialty">Especialidad</label>
              <input
                type="text"
                id="specialty"
                placeholder="Especialidad"
                {...register("specialty", {
                  required: "Este campo es obligatorio para médicos",
                })}
                aria-invalid={errors.specialty ? "true" : "false"}
              />
              {errors.specialty && (
                <span className="error" role="alert">
                  {errors.specialty.message}
                </span>
              )}
            </div>
          )}

          {role === "Patient" && (
            <div className="form-group">
              <label htmlFor="dateOfBirth">Fecha de nacimiento</label>
              <input
                type="date"
                id="dateOfBirth"
                placeholder="Fecha de nacimiento"
                {...register("dateOfBirth", {
                  required: "Este campo es obligatorio para pacientes",
                })}
                aria-invalid={errors.dateOfBirth ? "true" : "false"}
              />
              {errors.dateOfBirth && (
                <span className="error" role="alert">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>
          )}

          <button type="submit" className="btn-register">
            Registrarse
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="link-login">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
