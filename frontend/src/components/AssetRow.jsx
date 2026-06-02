export default function AssetRow({ asset, precioAnterior, esPanel, onVerGrafico, onComprar }) {
  const subio = precioAnterior !== undefined && parseFloat(asset.Precio) > parseFloat(precioAnterior);
  const bajo = precioAnterior !== undefined && parseFloat(asset.Precio) < parseFloat(precioAnterior);

return (
  <li className="list-group-item asset-row d-flex justify-content-between align-items-center">
    
    <div className="asset-info">
      <span className="asset-nombre">{asset.Nombre}</span>
      
      <div className="asset-precio-contenedor">
        <span>${asset.Precio}</span>
        <span>
          {subio && <span className="text-success fw-bold">↑</span>}
          {bajo && <span className="text-danger fw-bold">↓</span>}
        </span>
      </div>
    </div>

    {esPanel && (
      <div className="btn-group gap-2">
        <button className="btn btn-sm btn-outline-primary" onClick={onVerGrafico}>
          Historial
        </button>
        <button className="btn btn-sm btn-success" onClick={onComprar}>
          Comprar
        </button>
      </div>
    )}
    
  </li>
);
}