export default function PaginacionComponent({
  paginaActual,
  totalPaginas,
  setPaginaActual
}) {
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">

      <button
        className="btn btn-outline-secondary"
        disabled={paginaActual === 1}
        onClick={() =>
          setPaginaActual(paginaActual - 1)
        }
      >
        Anterior
      </button>

      <span>
        Página {paginaActual} de {totalPaginas}
      </span>

      <button
        className="btn btn-outline-secondary"
        disabled={paginaActual === totalPaginas}
        onClick={() =>
          setPaginaActual(paginaActual + 1)
        }
      >
        Siguiente
      </button>

    </div>
  );
}