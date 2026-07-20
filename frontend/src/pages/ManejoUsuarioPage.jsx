import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUsers } from "../services/apiServices";
import PaginacionComponent from "../components/PaginacionComponent";
import "../assets/styles/ManejoUsuario.css";

export default function ManejoUsuariosPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenDescendente, setOrdenDescendente] = useState(true);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

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

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, ordenDescendente]);

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

  const indiceUltimo =
    paginaActual * registrosPorPagina;

  const indicePrimero =
    indiceUltimo - registrosPorPagina;

  const usuariosPagina =
    usuariosFiltrados.slice(
      indicePrimero,
      indiceUltimo
    );

  const totalPaginas = Math.ceil(
    usuariosFiltrados.length /
      registrosPorPagina
  );

if (!user) {
  return (
    <section className="manejo-usuarios-page text-center">
      <h2>Manejo de usuarios</h2>

      <div className="alert alert-warning mt-4">
        <h5>🔒 Acceso restringido</h5>

        <p className="mb-0">
          Debes iniciar sesión con una cuenta de administrador
          para acceder a esta sección.
        </p>
      </div>
    </section>
  );
}

if (user.is_admin !== 1) {
  return (
    <section className="manejo-usuarios-page text-center">
      <h2>Manejo de usuarios</h2>

      <div className="alert alert-warning mt-4">
        <h5>⛔ Sin permisos</h5>

        <p className="mb-0">
          Esta funcionalidad está disponible únicamente para
          administradores.
        </p>
      </div>
    </section>
  );
}

  return (
    <section className="manejo-usuarios-page">
      <h2 className="mb-4 text-black">Manejo de usuarios</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-md-auto">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              setOrdenDescendente(!ordenDescendente)
            }
          >
            Ordenar por portfolio {ordenDescendente ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {cargando && <p>Cargando usuarios...</p>}

      {error && (
        <p className="manejo-usuarios-error">
          {error}
        </p>
      )}

      {!cargando && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Valor del portfolio</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuariosPagina.map((usuario, index) => (
                  <tr
                    key={usuario.id ?? index}
                    className={
                      Number(usuario.portfolio_value || 0) === mejorPortfolio
                        ? "usuario-destacado"
                        : ""
                    }
                  >
                    <td>
                      {Number(usuario.portfolio_value || 0) === mejorPortfolio && (
                        <i className="bi bi-trophy-fill text-warning me-2"></i>
                      )}
                      {usuario.name}
                    </td>

                    <td>
                      $
                      {Number(
                        usuario.portfolio_value || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
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
          </div>

          {usuariosFiltrados.length > 0 && (
            <PaginacionComponent
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              setPaginaActual={setPaginaActual}
            />
          )}

          {usuariosFiltrados.length === 0 && (
            <p>No se encontraron usuarios.</p>
          )}
        </>
      )}
    </section>
  );
}