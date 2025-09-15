export default function CatalogFilters({
  filterType,
  setFilterType,
  sortName,
  setSortName,
  sortPrice,
  setSortPrice,
  color,
}) {
  return (
    <div className="flex flex-wrap gap-6 justify-center mb-12">
      {/* Filtro por tipo */}
      <div
        className="flex flex-col bg-white shadow-md rounded-xl p-4 w-52 transition hover:shadow-lg"
        style={{ borderTop: `3px solid ${color}` }}
      >
        <label className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Filtrar por
        </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:outline-none"
          style={{
            borderColor: color,
            boxShadow: `0 0 0 1px ${color}33`,
          }}
        >
          <option value="all">Todos</option>
          <option value="service">Servicios</option>
          <option value="package">Paquetes</option>
        </select>
      </div>

      {/* Ordenar por nombre */}
      <div
        className="flex flex-col bg-white shadow-md rounded-xl p-4 w-52 transition hover:shadow-lg"
        style={{ borderTop: `3px solid ${color}` }}
      >
        <label className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Ordenar por nombre
        </label>
        <select
          value={sortName}
          onChange={(e) => {
            setSortName(e.target.value);
            setSortPrice("none");
          }}
          className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:outline-none"
          style={{
            borderColor: color,
            boxShadow: `0 0 0 1px ${color}33`,
          }}
        >
          <option value="none">Ninguno</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>

      {/* Ordenar por precio */}
      <div
        className="flex flex-col bg-white shadow-md rounded-xl p-4 w-52 transition hover:shadow-lg"
        style={{ borderTop: `3px solid ${color}` }}
      >
        <label className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Ordenar por precio
        </label>
        <select
          value={sortPrice}
          onChange={(e) => {
            setSortPrice(e.target.value);
            setSortName("none");
          }}
          className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:outline-none"
          style={{
            borderColor: color,
            boxShadow: `0 0 0 1px ${color}33`,
          }}
        >
          <option value="none">Ninguno</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </select>
      </div>
    </div>
  );
}
