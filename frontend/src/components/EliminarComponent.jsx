import {deletePortfolioAsset} from "../services/apiServices";

export default function EliminarComponent({ asset, isOpen, onClose, onEliminarExitoso }) {
    if (!isOpen || !asset) return null;
    const handleEliminar = async () => {
        try {
            await deletePortfolioAsset(asset.asset_id);
            alert("Activo eliminado correctamente.");
            onEliminarExitoso();
            onClose();
        } catch (error) {
            alert(
                error.response?.data?.Mensaje ||
                "Error al eliminar el activo."
            );
        }
    };
    
    return (
        <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Eliminar Activo</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>¿Estás seguro de que quieres eliminar este activo de tu portfolio?</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button
                            className="btn btn-danger"
                            onClick={handleEliminar}
                        >Eliminar
                        </button>
                    </div>
                </div> 
            </div>
        </div>
    );
}
