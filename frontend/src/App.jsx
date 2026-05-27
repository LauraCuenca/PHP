import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import { AuthProvider } from "./context/AuthContext";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegistroPage";
import Editar from "./pages/EditarPage";
import Assets from "./pages/StatPage";


function App() {
  return (
    <AuthProvider>
      <div className="app-container">

        <HeaderComponent />

        <main>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editar-perfil" element={<Editar />} />
        <Route path="/assets" element={<Assets />} />
        </Routes>
        </main>

        <FooterComponent />

      </div>
    </AuthProvider>
  );
}

export default App;