import { useEffect, useState } from "react";

export default function FlechaComponent({ precioActual, precioAnterior, nombre, usarLocalStorage = false }) {
  const [direccion, setDireccion] = useState(null);
  const actual = Number(precioActual);
  const anterior = Number(precioAnterior);

useEffect(() => {
    if (isNaN(actual)) return;

    if (isNaN(anterior)) {
        // anterior es 0 o NaN 
        if (usarLocalStorage && nombre) {
            const guardada = localStorage.getItem(`flecha_${nombre}`);
            if (guardada) setDireccion(guardada);
        }
        return;
    }
    // comparacion normal
    if (actual > anterior) {
        setDireccion("up");
        if (usarLocalStorage && nombre) localStorage.setItem(`flecha_${nombre}`, "up");
    } else if (actual < anterior) {
        setDireccion("down");
        if (usarLocalStorage && nombre) localStorage.setItem(`flecha_${nombre}`, "down");
    }
}, [actual, anterior]);

  return (
    <span className="ms-2">
      {direccion === "up" && <span className="text-success fw-bold">↑</span>}
      {direccion === "down" && <span className="text-danger fw-bold">↓</span>}
    </span>
  );
}