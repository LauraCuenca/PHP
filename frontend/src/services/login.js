import { useState } from "react";
import { login } from "../services/apiServices";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password });

      console.log("LOGIN OK:", res.data);

    } catch (error) {
      console.log("ERROR LOGIN:", error.response?.data || error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card shadow auth-card">

        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100">
            Entrar
          </button>

        </form>

      </div>
    </div>
  );
}