import "../assets/styles/auth.css";

export default function Register() {
  return (
    <div className="auth-container">

      <div className="card shadow auth-card">

        <h2 className="text-center mb-4">Registro</h2>

        <form>

          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" />
          </div>

          <button className="btn btn-success w-100">
            Crear cuenta
          </button>

        </form>

      </div>
    </div>
  );
}