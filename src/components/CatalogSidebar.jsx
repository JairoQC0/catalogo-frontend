export default function CatalogSidebar({
  selectedItems,
  useQuantities,
  setUseQuantities,
  usePackages,
  setUsePackages,
  companyName,
  setCompanyName,
  totalPrice,
  handleGeneratePDF,
  color,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl h-fit sticky top-6 border border-gray-200">
      <h2
        className="text-2xl font-extrabold mb-6 tracking-tight"
        style={{ color }}
      >
        Resumen de selección
      </h2>

      {/* Opciones */}
      <div className="space-y-4 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useQuantities}
            onChange={(e) => setUseQuantities(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 focus:ring-2"
            style={{ accentColor: color }}
          />
          <span className="text-sm text-gray-700">Activar cantidades</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={usePackages}
            onChange={(e) => setUsePackages(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 focus:ring-2"
            style={{ accentColor: color }}
          />
          <span className="text-sm text-gray-700">Activar paquetes</span>
        </label>
      </div>

      {/* Nombre empresa */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wide">
          Empresa
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Nombre de la empresa"
          className="w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 transition"
          style={{
            borderColor: companyName.trim() === "" ? "#f87171" : color,
            boxShadow:
              companyName.trim() !== "" ? `0 0 0 1px ${color}55` : "none",
          }}
        />
        {companyName.trim() === "" && (
          <p className="text-xs text-red-500 mt-1">
            ⚠️ Campo obligatorio para el PDF
          </p>
        )}
      </div>

      {/* Lista seleccionados */}
      {selectedItems.length === 0 ? (
        <p className="text-gray-500 text-sm italic mb-6">
          No has seleccionado ningún elemento
        </p>
      ) : (
        <ul className="space-y-3 mb-6">
          {selectedItems.map((srv) => {
            const qty = useQuantities ? srv.quantity : 1;
            return (
              <li
                key={srv.key}
                className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg border"
                style={{ borderColor: `${color}33` }}
              >
                <span className="truncate">
                  {srv.name} <span className="text-gray-500">({srv.type})</span>{" "}
                  {useQuantities && (
                    <span className="text-xs text-gray-600">x{qty}</span>
                  )}
                </span>
                <span className="font-semibold text-gray-800">
                  S/. {(srv.price * qty).toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Total */}
      <div className="flex justify-between items-center mb-6 border-t pt-4">
        <p className="font-semibold text-gray-700">Total:</p>
        <p className="font-bold text-xl" style={{ color }}>
          S/. {totalPrice.toFixed(2)}
        </p>
      </div>

      {/* Botón PDF */}
      {selectedItems.length > 0 && (
        <button
          onClick={handleGeneratePDF}
          className="w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          style={{
            backgroundColor: color,
            color: "#fff",
          }}
        >
          Generar PDF
        </button>
      )}
    </div>
  );
}
