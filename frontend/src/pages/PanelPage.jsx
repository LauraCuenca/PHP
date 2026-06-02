import { useEffect, useState, useRef } from "react";
import "../assets/styles/StatPage.css";
import "../assets/styles/panel.css";
import FiltroComponent from "../components/FiltroComponent";
import CompraComponent from "../components/CompraComponent";
import AssetRow from "../components/AssetRow";
import { AssetHistoryChart } from "../components/HistorialComponent";
import { buyAsset } from "../services/apiServices";

const refreshInterval = 3 * 60 * 1000; // 3 minutos para la lista general

export default function PanelPage() {
  const [assets, setAssets] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const [assetSeleccionado, setAssetSeleccionado] = useState(null);
  const [mostrarModalGrafico, setMostrarModalGrafico] = useState(false);
  const [mostrarModalCompra, setMostrarModalCompra] = useState(false);
  const [cantidadCompra, setCantidadCompra] = useState(1);

  const preciosAnteriores = useRef({});

  const fetchAssets = async () => {
    try {
      const params = new URLSearchParams();
      if (filtroNombre) params.append("type", filtroNombre);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);

      const response = await fetch(`http://localhost/assets?${params}`);
      const data = await response.json();

      assets.forEach(asset => {
        preciosAnteriores.current[asset.Nombre] = asset.Precio;
      });

      setAssets(data.Activos || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filtroNombre, minPrice, maxPrice]);

  useEffect(() => {
    const interval = setInterval(fetchAssets, refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const handleCompra = async (e) => {
    e.preventDefault();
    try {
      const response = await buyAsset(assetSeleccionado.Nombre, cantidadCompra);
      
      if (response.status === 201 || response.status === 200) {
        alert("¡Operación de compra realizada con éxito!");
        setMostrarModalCompra(false);
        fetchAssets();
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      alert(error.response?.data?.message || "Error al procesar la compra. Verifique sus fondos o inicio de sesión.");
    }
  };

  const abrirGrafico = (asset) => {
    setAssetSeleccionado(asset);
    setMostrarModalGrafico(true);
  };

  const abrirCompra = (asset) => {
    setAssetSeleccionado(asset);
    setCantidadCompra(1);
    setMostrarModalCompra(true);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow stat-card">
        <div className="card-body">
          <h2 className="card-title mb-4">Panel de Operaciones</h2>

          <FiltroComponent
            filtroNombre={filtroNombre}
            setFiltroNombre={setFiltroNombre}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />

          <ul className="list-group list-group-flush mt-4">
            {assets.map(asset => (
              <AssetRow
                key={asset.id || asset.Nombre}
                asset={asset}
                precioAnterior={preciosAnteriores.current[asset.Nombre]}
                esPanel={true} 
                onVerGrafico={() => abrirGrafico(asset)}
                onComprar={() => abrirCompra(asset)}
              />
            ))}
          </ul>
        </div>
      </div>
      
      {/* --- MODAL DEL GRÁFICO --- */}
      {mostrarModalGrafico && assetSeleccionado && assetSeleccionado.id && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Historial de Valores: {assetSeleccionado.Nombre}</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModalGrafico(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p className="text-muted small">Mostrando los últimos 5 movimientos globales registrados</p>

                <AssetHistoryChart 
                  assetId={assetSeleccionado.id} 
                  precioActual={assetSeleccionado.Precio} 
                />
                
                <small className="text-muted d-block mt-2">⏱️ Sincronizando variaciones en vivo cada 4 segundos.</small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setMostrarModalGrafico(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CompraComponent
        asset={assetSeleccionado}
        isOpen={mostrarModalCompra}
        onClose={() => setMostrarModalCompra(false)}
        onCompraExitosa={fetchAssets} 
      />
    </div>
  );
}