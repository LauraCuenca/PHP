import '../assets/styles/navbar.css';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <ul className="navbar-list">

        {user ? (
          <>
            <li>
              <span className="nav-welcome">Hola {user.name}</span>
            </li>
            <li>
              <span className="nav-portfolio">
                Portfolio: ${user.portfolio_value ?? 0}
              </span>
            </li>
            <li><Link to="/portfolio">Mi portfolio</Link></li>
            <li><Link to="/operaciones">Mis operaciones</Link></li>
            <li><Link to="/panel">Ver Panel</Link></li>
            <li><Link to="/editar-perfil">Editar usuario</Link></li>

            {user.role === 1 && (
              <li><Link to="/admin/usuarios" className="nav-admin-btn">Manejo usuarios</Link></li>
            )}
           <li>
           <button className="nav-logout-btn" onClick={logout} title="Cerrar sesión">
           <i className="bi bi-box-arrow-right"></i>
          </button>
         </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Registro</Link></li>
          </>
        )}

      </ul>
    </nav>
  );
}