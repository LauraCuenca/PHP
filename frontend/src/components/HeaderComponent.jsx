import { Link } from "react-router-dom";
import '../assets/styles/header.css';
import logo from '../assets/images/logo.png';
import NavBarComponent from "./NavBarComponent";

function HeaderComponent() {
  return (
    <header className="header">

      <div className="header-content">

        <Link to="/">
          <img
            className="header-logo"
            src={logo}
            alt="Logo WallyStreet"
          />
        </Link>

        <h1 className="header-title">
          WallyStreet - Tu guía financiera para invertir con confianza
        </h1>
      </div>

    <NavBarComponent />

    </header>
  );
}

export default HeaderComponent;