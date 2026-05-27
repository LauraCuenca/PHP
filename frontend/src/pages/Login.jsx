import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login as loginAPI} from "../services/apiServices";

export default function Login() {
const { login: loginDelContexto } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");

try {
  const res = await loginAPI({ email, password });
  const authHeader = res.headers.get('authorization');
  const userId = res.headers.get('x-user-id');
  console.log("TOKEN ORIGINAL:", authHeader);
  console.log("USER ID:", userId);

  if (authHeader) {

    const tokenLimpio = authHeader.split(' ')[1];
    await loginDelContexto(tokenLimpio, userId);
    navigate("/");

  } else {
    setError("No se recibió el token de autorización.");
  }

} catch (err) {
  console.error("Error real capturado:", err);
  setError(err.response?.data?.message || "Error al iniciar sesión");
}
};

  return (
    <div className="auth-container">

      <div className="card shadow auth-card">

        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button className="btn btn-primary w-100">
            Entrar
          </button>

        </form>

      </div>
    </div>
  );
}