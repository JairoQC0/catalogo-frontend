export default function CatalogItem({
  item,
  isSelected,
  current,
  handleToggleItem,
  handleQuantityChange,
  useQuantities,
  color,
  toggleExpandPackage,
  expandedPackages,
}) {
  const key = `${item.type}-${item.id}`;
  const isExpanded =
    item.type === "package" && expandedPackages.includes(item.id);

  // Helpers
  const hexToRgb = (hex) => {
    let h = (hex || "#3b82f6").replace("#", "");
    if (h.length === 3)
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgba = (hex, alpha = 1) => {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const accent = color || "#3b82f6";
  const neutralGray = "#9ca3af";
  const selectedBg = rgba(accent, 0.06);

  const badgeBg = item.type === "package" ? rgba(accent, 0.12) : "#f3f4f6";
  const badgeColor = item.type === "package" ? accent : "#6b7280";
  const badgeBorder = item.type === "package" ? accent : neutralGray;

  const leftAccent = item.type === "package" ? accent : neutralGray;
  const innerServiceBorder = rgba(accent, 0.18);

  return (
    <div
      key={key}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggleItem(item, item.type);
        }
      }}
      onClick={() => handleToggleItem(item, item.type)}
      className={`relative cursor-pointer rounded-xl p-6 border transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? "scale-[1.01]" : ""
      }`}
      style={{
        borderColor: isSelected ? accent : neutralGray,
        borderLeft: `4px solid ${leftAccent}`,
        backgroundColor: isSelected ? selectedBg : "white",
        outline: "none",
      }}
    >
      {/* Badge tipo */}
      <span
        className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-md shadow-sm"
        style={{
          backgroundColor: badgeBg,
          color: badgeColor,
          border: `1px solid ${badgeBorder}`, // 🔥 borde en la etiqueta
        }}
      >
        {item.type === "package" ? "Paquete" : "Servicio"}
      </span>

      {/* Contenido */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-bold text-lg text-gray-900 leading-tight">
            {item.name}
          </p>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
            {item.description}
          </p>
          <p className="font-semibold mt-3 text-gray-800 text-lg">
            S/. {item.price}
          </p>
        </div>

        {/* Acciones */}
        <div
          className="flex items-center justify-end gap-3 pt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            aria-checked={isSelected}
            className="w-5 h-5 cursor-pointer"
            style={{ accentColor: accent }}
          />

          {useQuantities && isSelected && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(key, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-full font-bold"
                style={{
                  backgroundColor: rgba(accent, 0.13),
                  color: accent,
                }}
              >
                −
              </button>
              <span className="font-semibold select-none">
                {current?.quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(key, +1)}
                className="w-8 h-8 flex items-center justify-center rounded-full font-bold"
                style={{
                  backgroundColor: rgba(accent, 0.13),
                  color: accent,
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Servicios dentro del paquete */}
      {item.type === "package" && item.services?.length > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandPackage(item.id);
            }}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-all hover:shadow-md"
            style={{
              backgroundColor: rgba(accent, 0.06),
              color: accent,
              border: `1px solid ${accent}`,
            }}
          >
            {isExpanded ? "Ocultar servicios" : "Ver servicios"}
          </button>

          {isExpanded && (
            <div
              className="mt-4 space-y-3 rounded-lg p-4"
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              {item.services.map((srv) => (
                <div
                  key={srv.id}
                  className="pl-3 border-l-4 py-2 text-sm bg-white rounded-md shadow-sm"
                  style={{ borderColor: innerServiceBorder }}
                >
                  <p className="font-semibold text-gray-800">{srv.name}</p>
                  <p className="text-gray-500 text-xs">{srv.description}</p>
                  <p className="text-gray-700 text-sm font-medium">
                    S/. {srv.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
