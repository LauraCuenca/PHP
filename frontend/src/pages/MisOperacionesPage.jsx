import { useEffect, useState } from "react";
import { getTransactions } from "../services/apiServices";

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
      <h2>Mis Operaciones</h2>

      <div className="manejo-usuarios-controles">

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="buy">Compras</option>
          <option value="sell">Ventas</option>
        </select>

        <select
          value={assetSeleccionado}
          onChange={(e) => setAssetSeleccionado(e.target.value)}
        >
          <option value="">Todos los assets</option>

          {assetsUnicos.map((asset) => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
        </select>

      </div>

      <table className="manejo-usuarios-tabla">
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
              <td>{op.transaction_date.split(" ")[0]}</td>
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

      {operacionesFiltradas.length === 0 && (
        <p>No se encontraron operaciones.</p>
      )}
    </section>
  );
}