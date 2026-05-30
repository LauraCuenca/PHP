export default function FiltroComponent({ filtroNombre, setFiltroNombre, minPrice, setMinPrice, maxPrice, setMaxPrice }) {
return (
    <div className="filtro-container"> 
    <input 
        type="text"
        placeholder="Nombre"
        value={filtroNombre}
        onChange={(e) => setFiltroNombre(e.target.value)}
    />
    <input
        type="number"
        placeholder="Precio mínimo"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
    />
    <input
        type="number"
        placeholder="Precio máximo"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
    />
    </div>
);
}