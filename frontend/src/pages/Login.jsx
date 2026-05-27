import "../assets/styles/auth.css";

export default function Login() {
  return (
    <div className="auth-container">

      <div className="card shadow auth-card">

        <h2 className="text-center mb-4">Login</h2>

        <form>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" />
          </div>

          <button className="btn btn-primary w-100">
            Entrar
          </button>

        </form>

      </div>
    </div>
  );
}