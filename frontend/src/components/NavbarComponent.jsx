import '../assets/styles/navbar.css';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function NavBarComponent() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();  
    navigate("/");  
  };

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
                Portfolio: ${Number(user.portfolio_value ?? 0).toFixed(2)}
              </span>
            </li>
            <li><Link to="/assets">Listado Assets</Link></li>
            <li><Link to="/portfolio">Mi portfolio</Link></li>
            <li><Link to="/operaciones">Mis operaciones</Link></li>
            <li><Link to="/panel">Ver Panel</Link></li>
            <li><Link to="/editar-perfil">Editar usuario</Link></li>

            {user.role === 1 && (
              <li><Link to="/admin/usuarios" className="nav-admin-btn">Manejo usuarios</Link></li>
            )}
           <li>
           <button className="nav-logout-btn" onClick={handleLogout} title="Cerrar sesión">
           <i className="bi bi-box-arrow-right"></i>
          </button>
         </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Registro</Link></li>
            <li><Link to="/assets">Listado Assets</Link></li>
          </>
        )}

      </ul>
    </nav>
  );
}