export default function FiltroComponent({
  filtroNombre,
  setFiltroNombre,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice
}) {
  
  return (
    <div className="row g-3">

      <div className="col-md-auto">
        <input
          type="text"
          className="form-control rounded-3 filtro-input"
          placeholder="Activo"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
      </div>

      <div className="col-md-auto">
        <input
          type="number"
          className="form-control rounded-3 filtro-input"
          placeholder="Mín."
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div className="col-md-auto">
        <input
          type="number"
          className="form-control rounded-3 filtro-input"
          placeholder="Máx."
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

    </div>
  );
}