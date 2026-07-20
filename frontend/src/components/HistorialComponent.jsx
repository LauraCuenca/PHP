import React, { useState, useEffect } from 'react';
import { getAssetHistory } from '../services/apiServices';
import '../assets/styles/panel.css'; 

export const AssetHistoryChart = ({ assetId, precioActual }) => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let intervalo;

    const obtenerDatos = async () => {
      try {
        const response = await getAssetHistory(assetId, 5);
        const datosCrudos = response.data?.Historial || [];

        setHistorial([...datosCrudos].reverse());
        setCargando(false);
      } catch (error) {
        console.error("Error al traer el historial:", error);
        setCargando(false);
      }
    };

    obtenerDatos();
    intervalo = setInterval(obtenerDatos, 4000);

    return () => clearInterval(intervalo);
  }, [assetId]);

  if (cargando) {
    return <div className="w-100 text-center pb-4 text-secondary">Cargando variaciones del mercado...</div>;
  }

  if (historial.length === 0) {
    return <div className="w-100 text-center pb-4 text-muted">No hay transacciones registradas para este activo.</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-end gap-3 my-4 grafico-contenedor">
      {historial.map((item, idx) => {
        const precioNumerico = parseFloat(item.Precio);
        const alturaBase = (precioNumerico / parseFloat(precioActual)) * 100;
        const alturaFinal = Math.max(20, Math.min(alturaBase, 130));
        const hora = item.Fecha.split(' ')[1] || item.Fecha;

        return (
          <div key={idx} className="text-center">
            <small className="d-block text-muted mb-1 grafico-precio-etiqueta">
              ${precioNumerico.toFixed(2)}
            </small>
            
            <div 
              className="bg-primary text-white rounded-top px-2 pt-1 font-monospace grafico-barra grafico-barra-dinamica" 
              style={{ height: `${alturaFinal}px` }} 
              title={`Tipo: ${item.Tipo}`}
            >
              ${precioNumerico.toFixed(0)}
            </div>

            <span className="text-muted d-block mt-1 text-version grafico-hora-etiqueta">
              {hora}
            </span>
          </div>
        );
      })}
    </div>
  );
};