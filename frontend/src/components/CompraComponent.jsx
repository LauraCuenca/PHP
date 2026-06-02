import { useState, useContext } from "react";
import { buyAsset } from "../services/apiServices";
import { AuthContext } from "../context/AuthContext";

export default function CompraComponent({ asset, isOpen, onClose, onCompraExitosa }) {
  const { user, updateUser } = useContext(AuthContext);
  const [cantidadCompra, setCantidadCompra] = useState(1);

  if (!isOpen || !asset) return null;

  const dineroDisponible = user?.balance
    ? parseFloat(user.balance)
    : 0;

  const precioUnitario = parseFloat(asset.Precio);

  const maxPermitidoPorDinero =
    precioUnitario > 0
      ? Math.floor(dineroDisponible / precioUnitario)
      : 0;

  const limiteMaximoInput = Math.min(
    20,
    Math.max(0, maxPermitidoPorDinero)
  );

  const costoTotal = precioUnitario * cantidadCompra;

  const handleCompra = async (e) => {
    e.preventDefault();

    if (cantidadCompra > 20) {
      alert("No podés comprar más de 20 unidades por operación.");
      return;
    }

    if (precioUnitario <= 0) {
      alert("Este activo no está disponible para compra.");
      return;
    }

    if (costoTotal > dineroDisponible) {
      alert("Error: No tenés dinero suficiente disponible para realizar esta operación.");
      return;
    }

    try {
      const response = await buyAsset(asset.id, cantidadCompra);

      if (response.status === 200 || response.status === 201) {
        const nuevoBalance = dineroDisponible - costoTotal;

        updateUser({
          balance: nuevoBalance,
        });

        alert("¡Operación de compra realizada con éxito!");

        onCompraExitosa();
        onClose();
      }
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Response:", error.response);
      console.error("Data:", error.response?.data);

      alert(
        error.response?.data?.error ||
        "Error al procesar la compra."
      );
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nueva Orden de Compra</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleCompra}>
            <div className="modal-body">
              <div className="alert alert-info py-2 small d-flex justify-content-between">
                <span>💰 Tu saldo disponible:</span>
                <span className="fw-bold">${dineroDisponible.toFixed(2)}</span>
              </div>

              <p className="mb-1">Activo: <span className="fw-bold">{asset.Nombre}</span></p>
              <p>Precio unitario: <strong className="text-primary">${precioUnitario}</strong></p>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Cantidad a comprar (Máx. {limiteMaximoInput}):</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="1"
                  max={limiteMaximoInput}
                  value={cantidadCompra} 
                  onChange={(e) => setCantidadCompra(parseInt(e.target.value) || 0)} 
                  required 
                />
                {maxPermitidoPorDinero < 1 && (
                  <div className="text-danger small mt-1">⚠️ Tus fondos actuales no alcanzan para comprar este activo.</div>
                )}
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5">Monto Total:</span>
                <span className={`fs-4 fw-bold ${costoTotal > dineroDisponible ? "text-danger" : "text-success"}`}>
                  ${costoTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button 
                type="submit" 
                className="btn btn-success px-4" 
                disabled={costoTotal > dineroDisponible || cantidadCompra < 1 || cantidadCompra > 20 || precioUnitario <= 0}
              >
                Confirmar Transacción
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}