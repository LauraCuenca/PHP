import { useEffect, useState } from "react";
import { getTransactions } from "../services/apiServices";
import FiltroOperacionesComponent from "../components/FiltroOperacionesComponent";

export default function MisOperacionesPage() {
  const [operaciones, setOperaciones] = useState([]);
  const [tipo, setTipo] = useState("");
  const [assetSeleccionado, setAssetSeleccionado] = useState("");

  useEffect(() => {
    const cargarOperaciones = async () => {
      try {
        const res = await getTransactions();
        setOperaciones(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarOperaciones();
  }, []);

  const assetsUnicos = [
    ...new Set(
      operaciones.map((op) => op.asset_name)
    ),
  ];

  const operacionesFiltradas = operaciones.filter((op) => {
    const coincideTipo =
      tipo === "" || op.transaction_type === tipo;

    const coincideAsset =
      assetSeleccionado === "" ||
      op.asset_name === assetSeleccionado;

    return coincideTipo && coincideAsset;
  });

  return (
    <section className="manejo-usuarios-page">
      <h2 className="mb-4">Mis Operaciones</h2>

      <FiltroOperacionesComponent
        tipo={tipo}
        setTipo={setTipo}
        assetSeleccionado={assetSeleccionado}
        setAssetSeleccionado={setAssetSeleccionado}
        assetsUnicos={assetsUnicos}
      />

      <div className="table-responsive mt-4">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Asset</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {operacionesFiltradas.map((op) => (
              <tr key={op.id}>
                <td>
                  {new Date(op.transaction_date)
                    .toLocaleDateString("es-AR")
                    .replaceAll("/", "-")}
                </td>

                <td>{op.asset_name}</td>

                <td>
                  {op.transaction_type === "buy"
                    ? "Compra"
                    : "Venta"}
                </td>

                <td>{op.quantity}</td>

                <td>
                  ${Number(op.total_amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {operacionesFiltradas.length === 0 && (
        <p>No se encontraron operaciones.</p>
      )}
    </section>
  );
}