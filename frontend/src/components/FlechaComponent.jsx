export default function FlechaPrecio({ precioActual, precioAnterior }) {
    const subio = precioAnterior !== undefined && parseFloat(precioActual) > parseFloat(precioAnterior);
    const bajo = precioAnterior !== undefined && parseFloat(precioActual) < parseFloat(precioAnterior);

    return (
        <span>
            {subio && <span className="text-success fw-bold">↑</span>}
            {bajo && <span className="text-danger fw-bold">↓</span>}
        </span>
    );
}