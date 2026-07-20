import {deletePortfolioAsset} from "../services/apiServices";
import { useState, useEffect } from "react";

export default function EliminarComponent({ asset, isOpen, onClose, onEliminarExitoso }) {
    const [mensaje, setMensaje] = useState("");
    
    useEffect(() => {
        if (isOpen) {
            setMensaje("");
        }
    }, [isOpen]);

    if (!isOpen || !asset) return null;
    
    const handleEliminar = async () => {
        try {
            await deletePortfolioAsset(asset.asset_id);
            setMensaje("Activo eliminado correctamente.");
            setTimeout(() => {
                onEliminarExitoso();
            onClose();
        }, 1500); // cierra después de 1.5 segundos
        } catch (error) {
            alert(
                error.response?.data?.Mensaje ||
                "Error al eliminar el activo."
            );
        }
    };
    
    return (
        <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Eliminar Activo</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>¿Estás seguro de que quieres eliminar este activo de tu portfolio?</p>
                    </div>
                    
                <div className="modal-footer">
                    {mensaje ? (
                    <div className={`alert ${mensaje.includes("Error") ? "alert-danger" : "alert-success"} w-100 mb-0`}>
                    {mensaje}
                    </div>
                    ) : (
                    <>
                    <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-danger" onClick={handleEliminar}>Eliminar</button>
                    </>
                    )}
                </div>
                </div> 
            </div>
        </div>
    );
}