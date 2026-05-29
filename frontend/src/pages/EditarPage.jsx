import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../services/apiServices";
import "../assets/styles/auth.css";

export default function EditarPage() {
  const { user, updateUser: updateUserContext } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div className="auth-container text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Cargando datos del perfil...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const userIdFinal = user.id || user.id_user || localStorage.getItem("userId");

    if (!userIdFinal) {
      setError("Error crítico: No se pudo determinar tu ID de usuario.");
      return;
    }

    if (!name && !password) {
      setError("Debe rellenar al menos el campo de Nombre o de Contraseña.");
      return;
    }

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (password) dataToUpdate.password = password;

    try {
      const res = await updateUser(userIdFinal, dataToUpdate);
      if (name) {
        updateUserContext({ name: name });
     }

      setMessage(res.data?.message || "Usuario actualizado correctamente");
      setPassword("");
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      setError(err.response?.data?.error || "Error al actualizar el perfil");
    }
  };

  return (
    <div className="auth-container">
      <div className="card shadow auth-card">
        <h2 className="text-center mb-4">Editar Perfil</h2>

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
            <label className="form-label">Nueva Contraseña (Opcional)</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
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

          <button type="submit" className="btn btn-warning w-100 text-white">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}