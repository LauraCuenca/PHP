import FlechaComponent from "./FlechaComponent";

export default function AssetRow({ asset, precioAnterior, esPanel, onVerGrafico, onComprar }) {


  return (
    <li className="list-group-item asset-row d-flex justify-content-between align-items-center">
      
      <div className="asset-info">
        <span className="asset-nombre">{asset.Nombre}</span>
        <span className="asset-precio-contenedor text-primary fw-bold">
          <span>${Number(asset.Precio).toFixed(2)}</span>
        <FlechaComponent 
          precioActual={asset.Precio}
          precioAnterior={precioAnterior}
          nombre={asset.Nombre}
          usarLocalStorage={true}
        />
        </span>
      </div>

      {esPanel && (
        <div className="btn-group gap-2">
          <button className="btn btn-sm btn-outline-primary" onClick={onVerGrafico}>Historial</button>
          <button className="btn btn-sm btn-success" onClick={onComprar}>Comprar</button>
        </div>
      )}
      
    </li>
  );
}