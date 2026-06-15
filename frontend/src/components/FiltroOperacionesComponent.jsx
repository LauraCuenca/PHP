export default function FiltroOperacionesComponent({
  tipo,
  setTipo,
  assetSeleccionado,
  setAssetSeleccionado,
  assetsUnicos
}) {
  return (
    <div className="row g-3 mb-4">

      <div className="col-md-auto">
        <select
          className="form-select rounded-3"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="buy">Compras</option>
          <option value="sell">Ventas</option>
        </select>
      </div>

      <div className="col-md-auto">
        <select
          className="form-select rounded-3"
          value={assetSeleccionado}
          onChange={(e) => setAssetSeleccionado(e.target.value)}
        >
          <option value="">Todos los assets</option>

          {assetsUnicos.map((asset) => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}