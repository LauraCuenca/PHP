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

          {assets.map(asset => {
            const precioAnterior = preciosAnteriores.current[asset.Nombre];

            const subio =
              precioAnterior !== undefined &&
              parseFloat(asset.Precio) > parseFloat(precioAnterior);

            const bajo =
              precioAnterior !== undefined &&
              parseFloat(asset.Precio) < parseFloat(precioAnterior);

            return (
               <li
                 key={asset.Nombre}
                 className="list-group-item asset-row"
              >
              <span className="fw-semibold">
                      {asset.Nombre}
              </span>

              <span className="asset-precio">
                     ${asset.Precio}
              </span>

              <span>
                  {subio && <span className="text-success fw-bold">↑</span>}
                  {bajo && <span className="text-danger fw-bold">↓</span>}
              </span>
              </li>
            );
          })}

        </ul>

      </div>

    </div>

  </div>
);
}