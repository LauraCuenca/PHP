import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUsers } from "../services/apiServices";
import "../assets/styles/ManejoUsuario.css";

export default function ManejoUsuariosPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenDescendente, setOrdenDescendente] = useState(true);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await getUsers();
        setUsuarios(res.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el listado de usuarios.");
      } finally {
        setCargando(false);
      }
    };

    if (user && user.is_admin === 1) {
      cargarUsuarios();
    } else {
      setCargando(false);
    }
  }, [user]);

  const texto = busqueda.toLowerCase().trim();

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(texto)
  );

  usuariosFiltrados.sort((a, b) => {
    const valorA = Number(a.portfolio_value || 0);
    const valorB = Number(b.portfolio_value || 0);

    if (ordenDescendente) {
      return valorB - valorA;
    }

    return valorA - valorB;
  });

  const mejorPortfolio = Math.max(
  ...usuarios.map((usuario) =>
    Number(usuario.portfolio_value || 0)
  )
);

  if (!user) {
    return (
      <section className="manejo-usuarios-page">
        <h2>Manejo de usuarios</h2>
        <p>Debes iniciar sesión para ver esta sección.</p>
      </section>
    );
  }

  if (user.is_admin !== 1) {
    return (
      <section className="manejo-usuarios-page">
        <h2>Manejo de usuarios</h2>
        <p>No tenés permisos para acceder a esta sección.</p>
      </section>
    );
  }

  return (
    <section className="manejo-usuarios-page">
      <h2>Manejo de usuarios</h2>

      <div className="manejo-usuarios-controles">
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setOrdenDescendente(!ordenDescendente)}
        >
          Ordenar por portfolio {ordenDescendente ? "↓" : "↑"}
        </button>
      </div>

      {cargando && <p>Cargando usuarios...</p>}

      {error && (
        <p className="manejo-usuarios-error">
          {error}
        </p>
      )}

      {!cargando && !error && (
        <>
          <table className="manejo-usuarios-tabla">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Valor del portfolio</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.map((usuario, index) => (
                <tr
                  key={usuario.id ?? index}
                  className={
                     Number(usuario.portfolio_value || 0) === mejorPortfolio
                       ? "usuario-destacado"
                       : ""
                  }
              >
                  <td>{usuario.name}</td>

                  <td>
                    $
                    {Number(
                      usuario.portfolio_value || 0
                    ).toFixed(2)}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/editar-perfil/${usuario.id}`)
                      }
                    >
                      Editar usuario
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {usuariosFiltrados.length === 0 && (
            <p>No se encontraron usuarios.</p>
          )}
        </>
      )}
    </section>
  );
}