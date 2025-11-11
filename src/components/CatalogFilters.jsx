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
    <div className="flex flex-wrap gap-4 items-stretch bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col min-w-[170px] flex-1">
        <label className="text-xs font-semibold text-gray-500 mb-1">
          Filtrar por
        </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: color }}
        >
          <option value="all">Todos</option>
          <option value="service">Servicios</option>
          <option value="package">Paquetes</option>
        </select>
      </div>

      <div className="flex flex-col min-w-[170px] flex-1">
        <label className="text-xs font-semibold text-gray-500 mb-1">
          Ordenar por nombre
        </label>
        <select
          value={sortName}
          onChange={(e) => {
            setSortName(e.target.value);
            setSortPrice("none");
          }}
          className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: color }}
        >
          <option value="none">Ninguno</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>

      <div className="flex flex-col min-w-[170px] flex-1">
        <label className="text-xs font-semibold text-gray-500 mb-1">
          Ordenar por precio
        </label>
        <select
          value={sortPrice}
          onChange={(e) => {
            setSortPrice(e.target.value);
            setSortName("none");
          }}
          className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: color }}
        >
          <option value="none">Ninguno</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </select>
      </div>
    </div>
  );
}
