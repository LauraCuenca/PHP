import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getPortfolio, getUserById, buyAsset, sellAsset, deletePortfolioAsset } from "../services/apiServices";
import AssetComponent from "../components/AssetComponent";
import { Link } from "react-router-dom";
import CompraComponent from "../components/CompraComponent";
import VentaComponent from "../components/VentaComponent";
import EliminarComponent from "../components/EliminarComponent";

const REFRESH_INTERVAL = 30 * 1000; // 30 segundos

export default function PortfolioPage() {
    const {user, updateUser} = useContext(AuthContext);
    const [portfolio, setPortfolio] = useState([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [assetSeleccionado, setAssetSeleccionado] = useState(null);
    const [modalCompraAbierto, setModalCompraAbierto] = useState(false);
    const [modalVentaAbierto, setModalVentaAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

    const fetchPortfolio = async () => {
            try {
                const userId = user.id || user.id_user || localStorage.getItem("userId");
                if (!userId) {
                    setError("Error crítico: No se pudo determinar tu ID de usuario.");
                    setLoading(false);
                    return;
                }
                const response = await getPortfolio(userId);
                const data = response.data;
                setPortfolio(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
    const fetchBalance = async () => {
        try {
            const response = await getUserById(user.id);
            const data = response.data;
            setBalance(Number(data.balance).toFixed(2));
            updateUser({ balance: data.balance, portfolio_value: data.portfolio_value });
        } catch (error) {
            setError("Error al obtener balance: " + error.message);
        }
    };
    
    useEffect(() => {
        if (user) {
            fetchPortfolio();
            fetchBalance();
            const interval = setInterval(() => {
                fetchPortfolio();
                fetchBalance();
            }, REFRESH_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleVender = async (assetId, cantidad) => {
    try {
        await sellAsset(assetId, cantidad);
        fetchPortfolio();
        fetchBalance();
    } catch (error) {
        setError("Error al vender: " + error.message);
    }
    };
    const handleEliminar = async (assetId) => {
        try {
            await deletePortfolioAsset(assetId);
            fetchPortfolio();
        } catch (error) {
            setError("Error al eliminar: " + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow stat-card">
                <div className="card-body">
                <h2 className="card-title mb-4">Mi Portfolio</h2>
                <h4>Saldo disponible: <strong>${Number(balance).toFixed(2)}</strong></h4>
                {loading && (
                    <div className="d-flex align-items-center gap-3">
                        <div className="spinner-border text-primary" role="status"></div>
                        <span>Cargando tu portfolio...</span>
                    </div>
                )}
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                {!loading && !error && portfolio.length === 0 && (
                    <p className="alert alert-info">Aún no tienes activos en tu portafolio.</p>
                )}

                {!loading && !error && portfolio.length > 0 && (
                    portfolio.map((item, index) => (
                        <AssetComponent
                            key={item.asset_id || index}
                            item={item}
                            balance={Number(user.balance)}
                            onComprarClick={(asset) => {
                                setAssetSeleccionado(asset);
                                setModalCompraAbierto(true);
                            }}
                            onVenderClick={(asset) => {
                                setAssetSeleccionado(asset);
                                setModalVentaAbierto(true);
                            }}
                            onEliminar={(asset) => {
                                setAssetSeleccionado(asset);
                                setModalEliminarAbierto(true);
                            }}
                        />
                    ))
                )}
                <CompraComponent
                    asset={assetSeleccionado}
                    isOpen={modalCompraAbierto}
                    onClose={() => setModalCompraAbierto(false)}
                    onCompraExitosa={() => {
                        fetchPortfolio();
                        fetchBalance();
                    }}
                />
                <VentaComponent
                    asset={assetSeleccionado}
                    isOpen={modalVentaAbierto}
                    onClose={() => setModalVentaAbierto(false)}
                    onVentaExitosa={() => {
                        fetchPortfolio();
                        fetchBalance();
                    }}
                />
                <EliminarComponent
                    asset={assetSeleccionado}
                    isOpen={modalEliminarAbierto}
                    onClose={() => setModalEliminarAbierto(false)}
                    onEliminarExitoso={() => fetchPortfolio()}
                />
                <Link to="/panel" className="btn btn-primary mb-3">Ver Panel</Link>
                </div>
            </div>
        </div>
    );
}