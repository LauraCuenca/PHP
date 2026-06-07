import { useEffect, useState, useRef } from "react";
import { getAssets } from "../services/apiServices";
import "../assets/styles/StatPage.css";
import FiltroComponent from "../components/FiltroComponent";
import AssetRow from "../components/AssetRow";
const refreshInterval = 3*60*1000; // Intervalo de actualización (3 minutos)
const REFRESH_INTERVAL = 30 * 1000; // Intervalo de actualización (30 segundos) para prueba


export default function StatPage() {
  const [assets, setAssets] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const preciosAnteriores = useRef(JSON.parse(localStorage.getItem("preciosAnteriores")) || {});

  const fetchAssets = async () => {
    try {
    const params = new URLSearchParams();
    if (filtroNombre) params.append("type", filtroNombre);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    
    const res = await getAssets(params);
    const data = res.data;
    setAssets(prev => {
      prev.forEach(asset => {
        preciosAnteriores.current[asset.Nombre] = asset.Precio;
      });
      localStorage.setItem("preciosAnteriores", JSON.stringify(preciosAnteriores.current));
      return data.Activos || [];
    });
    }
    catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
    const interval = setInterval(fetchAssets, refreshInterval);
    return () => clearInterval(interval);
  }, [filtroNombre, minPrice, maxPrice]);

return (
  <div className="container mt-4">

    <div className="card shadow stat-card">

      <div className="card-body">

        <h2 className="card-title mb-4">Lista de Activos</h2>

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
              key={asset.Nombre}
              asset={asset}
              precioAnterior={preciosAnteriores.current[asset.Nombre]}
              esPanel={false}
              onVerGrafico={() => abrirModalGrafico(asset)}
              onComprar={() => abrirModalCompra(asset)}
            />
          ))}

        </ul>

      </div>

    </div>

  </div>
);
}