import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser as registerAPI } from "../services/apiServices";
import "../assets/styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");

  if (!name || !email || !password) {
    setError("Todos los campos son obligatorios.");
    return;
  }

  try {
    const res = await registerAPI({ name, email, password });
    setMessage(res.data?.message || "¡Cuenta creada con éxito!");
    
    setName("");
    setEmail("");
    setPassword("");

    setTimeout(() => {
      navigate("/login"); 
    }, 2500);

  } catch (err) {
    console.error("Error real capturado en registro:", err);
    const apiErrorData = err.response?.data;

    if (apiErrorData) {
      if (apiErrorData["campos faltantes"]) {
        const campos = apiErrorData["campos faltantes"].join(", ");
        setError(`${apiErrorData.error}: (${campos})`);
      } else if (apiErrorData.error) {
        setError(apiErrorData.error);
      } else {
        setError("Error inesperado en el servidor.");
      }
    } else {
      setError("No se pudo conectar con el servidor.");
    }
  }
};

  return (
    <div className="auth-container">
      <div className="card shadow auth-card">
        <h2 className="text-center mb-4">Registro</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
}