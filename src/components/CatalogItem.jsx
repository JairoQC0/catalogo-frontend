import { useState } from "react";
import ServiceDescriptionModal from "./ServiceDescriptionModal";
import { motion } from "framer-motion";

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
  const [openDesc, setOpenDesc] = useState(false);

  const key = `${item.type}-${item.id}`;
  const isPackage = item.type === "package";
  const isExpanded = isPackage && expandedPackages.includes(item.id);
  const accent = color || "#3b82f6";

  // sacar un resumen corto del HTML
  const getShortText = (html, limit = 140) => {
    if (!html) return "Sin descripción.";
    // quitar tags
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "…";
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded-2xl border bg-white shadow-sm flex flex-col h-full"
        style={{
          borderColor: isSelected ? accent : "#e5e7eb",
          backgroundColor: isSelected ? `${accent}08` : "white",
        }}
      >
        {/* header */}
        <div className="flex justify-between gap-3 p-5 pb-2">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
              {isPackage ? "Paquete" : "Servicio"}
            </p>
            <h3 className="text-lg font-semibold text-gray-900 leading-snug">
              {item.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Precio</p>
            <p className="text-xl font-bold text-gray-800">
              S/. {item.price}
            </p>
          </div>
        </div>

        {/* resumen corto */}
        <div className="px-5 pt-1 pb-2 flex-1">
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            {getShortText(item.description)}
          </p>
          <button
            onClick={() => setOpenDesc(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Ver descripción
          </button>
        </div>

        {/* si es paquete, botón para ver servicios */}
        {isPackage && item.services?.length > 0 && (
          <div className="px-5 pb-1">
            <button
              type="button"
              onClick={() => toggleExpandPackage(item.id)}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              {isExpanded
                ? "Ocultar servicios incluidos"
                : "Ver servicios incluidos"}
            </button>
          </div>
        )}

        {/* servicios del paquete */}
        {isPackage && isExpanded && (
          <ul className="px-5 pb-3 pt-2 space-y-2">
            {item.services.map((srv) => (
              <li
                key={srv.id}
                className="text-sm bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
              >
                {srv.name}
              </li>
            ))}
          </ul>
        )}

        {/* pie */}
        <div className="px-5 py-4 mt-auto flex items-center justify-between gap-3 border-t bg-white rounded-b-2xl">
          {useQuantities && isSelected ? (
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1">
              <button
                onClick={() => handleQuantityChange(key, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-full font-bold"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                −
              </button>
              <span className="font-semibold text-gray-800">
                {current?.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(key, +1)}
                className="w-8 h-8 flex items-center justify-center rounded-full font-bold"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                +
              </button>
            </div>
          ) : (
            <span className="text-xs text-gray-400">
              {isPackage ? "Paquete disponible" : "Servicio disponible"}
            </span>
          )}

          <button
            onClick={() => handleToggleItem(item, item.type)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: isSelected ? accent : "white",
              color: isSelected ? "white" : accent,
              border: `1px solid ${accent}`,
            }}
          >
            {isSelected ? "Quitar" : "Seleccionar"}
          </button>
        </div>
      </motion.div>

      {/* MODAL DE DESCRIPCIÓN */}
      <ServiceDescriptionModal
        open={openDesc}
        onClose={() => setOpenDesc(false)}
        title={item.name}
        htmlDescription={item.description}
      />
    </>
  );
}
