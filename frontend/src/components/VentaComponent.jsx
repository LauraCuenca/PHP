import {useState, useContext} from "react";
import { sellAsset } from "../services/apiServices";
import { AuthContext } from "../context/AuthContext";

export default function VentaComponent({ asset, isOpen, onClose, onVentaExitosa }) {
    const { user, updateUser } = useContext(AuthContext);
    const [cantidadVenta, setCantidadVenta] = useState(1);

    if (!isOpen || !asset) return null;

    const precioUnitario = parseFloat(asset.Precio);
    const maxCantidadVenta = Math.min(20, asset.quantity);
    const gananciaTotal = (precioUnitario * cantidadVenta).toFixed(2);
    const handleVenta = async (e) => {
        e.preventDefault();

        if (cantidadVenta > maxCantidadVenta) {
            alert(`No podés vender más de ${maxCantidadVenta} unidades.`);
            return;
        }
        if (precioUnitario <= 0) {
            alert("Este activo no está disponible para venta.");
            return;
        }

    try {
        await sellAsset(asset.id, cantidadVenta);
        
        const nuevoBalance = parseFloat(user.balance) + parseFloat(gananciaTotal);
        updateUser({ balance: nuevoBalance });

        alert("¡Operación de venta realizada con éxito!");
        onVentaExitosa(); // solo notifica al padre para refrescar
        onClose();
    } catch (error) {
        alert(
            error.response?.data?.Mensaje ||
            "Error al realizar la venta."
        );
    }
    };

    return (
        <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Vender Activo</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div> 
                        <form onSubmit={handleVenta}>
                            <div className="modal-body">
                                <div className="alert alert-info py-2 small d-flex justify-content-between">
                                    <span>Información de la venta</span>
                                </div>
                                <p className="mb-1">Activo: <span className="fw-bold">{asset.Nombre}</span></p>
                                <p>Precio unitario: <strong className="text-primary">${precioUnitario}</strong></p>
                                <div className="mb-3">
                                <label className="form-label">Cantidad a vender (máx {maxCantidadVenta}):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={cantidadVenta}
                                    onChange={(e) => setCantidadVenta(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max={maxCantidadVenta}
                                />
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fs-5">💰 Ganancia total:</span>
                                <span className={`fs-4 fw-bold ${gananciaTotal > 0 ? "text-danger" : "text-success"}`}>
                                ${gananciaTotal}
                            </span>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Vender
                            </button>
                            </div>
                            <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button 
                                type="submit" 
                                className="btn btn-success px-4" 
                                disabled={cantidadVenta < 1 || cantidadVenta > maxCantidadVenta || precioUnitario <= 0}
                            >
                            Confirmar Venta
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    );
}
