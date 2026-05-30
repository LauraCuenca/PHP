import { useEffect, useState, useRef } from "react";
import "../assets/styles/StatPage.css";
import FiltroComponent from "../components/FiltroComponent";
const refreshInterval = 3*60*1000; // Intervalo de actualización (3 minutos)


export default function StatPage() {
  const [assets, setAssets] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const preciosAnteriores = useRef({});
  const fetchAssets = async () => {
    try {
    const params = new URLSearchParams();
    if (filtroNombre) params.append("type", filtroNombre);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    const response = await fetch(`http://localhost/assets?${params}`);
    const data = await response.json();
    setAssets(prev => {prev.forEach(asset => {preciosAnteriores.current[asset.Nombre] = asset.Precio;});
    return data.Activos;
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
  <div className="stat-container">
    <h1>Lista de Activos</h1>
    <h4>Filtrar por:</h4>
    <FiltroComponent
        filtroNombre={filtroNombre}
        setFiltroNombre={setFiltroNombre}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
    />    
  <ul className="assets-list">
  {assets.map(asset => {
    const precioAnterior = preciosAnteriores.current[asset.Nombre];
    const subio = precioAnterior !== undefined && parseFloat(asset.Precio) > parseFloat(precioAnterior);
    const bajo = precioAnterior !== undefined && parseFloat(asset.Precio) < parseFloat(precioAnterior);
    return (
    <li key={asset.Nombre} className="asset-item">
    <span className="asset-nombre">{asset.Nombre}</span>
    <span className="asset-precio">${asset.Precio}</span>
    <span className="asset-flecha">
        {subio && <span className="precio-sube">↑</span>}
        {bajo && <span className="precio-baja">↓</span>}
    </span>
</li>
    );
  })}
  </ul>
  </div>
);
}