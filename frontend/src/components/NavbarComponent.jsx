import '../assets/styles/navbar.css';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

return (
  <nav className="navbar">
    <ul className="navbar-list">

      {user ? (
        <>
          <li><span>Hola {user.name}</span></li>
          <li><button onClick={logout}>Logout</button></li>
        </>
      ) : (
        <>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Registro</a></li>
        </>
      )}

    </ul>
  </nav>
);
}