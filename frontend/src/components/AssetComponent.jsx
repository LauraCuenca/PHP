import { useState } from "react";
import FlechaComponent from "./FlechaComponent";

export default function AssetComponent({ item, balance, onComprarClick, onVenderClick, onEliminar }) {
    const [modo, setModo] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const maxCompra = Math.min(20, Math.floor(balance / item.current_price));
    const costoTotal = (cantidad * item.current_price).toFixed(2);
    const ganancia = (cantidad * item.current_price).toFixed(2);

return (
    <div className="card shadow-sm mb-3">
        <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{item.name}</h5>
                <span className="d-flex align-items-center gap-1">
                    <FlechaComponent 
                        precioActual={item.current_price}
                        precioAnterior={item.avg_purchase_price}
                    />
                    <span className="text-primary fw-bold">${Number(item.current_price).toFixed(2)}</span>
                </span>
            </div>
                <p className="card-text mb-1">Cantidad: {item.quantity}</p>
                <p className="card-text mb-3">Valor Total: <span className="text-success fw-bold">${Number(item.total_value).toFixed(2)}</span></p>

                {/*Botones*/}
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-success btn-sm"
                        disabled={Number(balance) < Number(item.current_price)}
                        onClick={() => onComprarClick({
                            id: item.asset_id,
                            Nombre: item.name,
                            Precio: item.current_price
                        })}
                    >
                        Comprar
                    </button>
                    <button
                        className="btn btn-sm btn-warning btn-sm"
                        onClick={() => onVenderClick({
                            id: item.asset_id,
                            Nombre: item.name,
                            Precio: item.current_price,
                            quantity: item.quantity
                        })}
                    >
                        Vender
                    </button>
                    {item.quantity === 0 && (
                        <button
                            className="btn btn-sm btn-danger btn-sm"
                            onClick={() => onEliminar({
                                asset_id: item.asset_id,
                            })}
                        >
                            Eliminar
                        </button>
                    )}
                </div>
        </div>
    </div>
    );
}