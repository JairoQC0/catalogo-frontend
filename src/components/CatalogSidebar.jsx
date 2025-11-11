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
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md h-fit sticky top-6 border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900">Resumen</h2>
      <p className="text-xs text-gray-400 mb-5">
        Revisa tus selecciones antes de generar el PDF.
      </p>

      {/* Opciones */}
      <div className="space-y-3 mb-6">
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
          <span className="text-sm text-gray-700">Mostrar paquetes</span>
        </label>
      </div>

      {/* Empresa */}
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
          }}
        />
        {companyName.trim() === "" && (
          <p className="text-xs text-red-500 mt-1">
            Campo obligatorio para el PDF
          </p>
        )}
      </div>

      {/* Items */}
      {selectedItems.length === 0 ? (
        <p className="text-gray-400 text-sm italic mb-6">
          Aún no seleccionas nada.
        </p>
      ) : (
        <ul className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
          {selectedItems.map((srv) => {
            const qty = useQuantities ? srv.quantity : 1;
            return (
              <li
                key={srv.key}
                className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg border"
                style={{ borderColor: `${color}22` }}
              >
                <span className="truncate mr-2">
                  {srv.name}
                  <span className="text-gray-400 text-xs">
                    {" "}
                    ({srv.type})
                  </span>
                  {useQuantities && (
                    <span className="text-xs text-gray-500 ml-1">
                      x{qty}
                    </span>
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

      {/* total */}
      <div className="flex justify-between items-center mb-5 pt-3 border-t">
        <p className="font-semibold text-gray-700">Total</p>
        <p className="font-bold text-xl" style={{ color }}>
          S/. {totalPrice.toFixed(2)}
        </p>
      </div>

      {selectedItems.length > 0 && (
        <button
          onClick={handleGeneratePDF}
          className="w-full py-3 rounded-xl font-semibold transition-all hover:shadow-md"
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
