import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import jsPDF from "jspdf";
import { useCatalogColors } from "../store/useCatalogColors";

export default function PublicCatalog() {
  const { id } = useParams();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [useQuantities, setUseQuantities] = useState(false);
  const [usePackages, setUsePackages] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [expandedPackages, setExpandedPackages] = useState([]); // 👈 para "ver más"

  const { colors } = useCatalogColors();
  const color = colors[id] || "#3b82f6";

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/catalogs/${id}`);
        setCatalog(res.data);
      } catch {
        setError("Error al cargar el catálogo");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [id]);

  const handleToggleItem = (item, type) => {
    const key = `${type}-${item.id}`;
    if (selectedItems.find((s) => s.key === key)) {
      setSelectedItems(selectedItems.filter((s) => s.key !== key));
    } else {
      setSelectedItems([...selectedItems, { ...item, type, key, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (key, delta) => {
    setSelectedItems((prev) =>
      prev.map((s) =>
        s.key === key ? { ...s, quantity: Math.max(1, s.quantity + delta) } : s
      )
    );
  };

  const toggleExpandPackage = (pkgId) => {
    setExpandedPackages((prev) =>
      prev.includes(pkgId)
        ? prev.filter((id) => id !== pkgId)
        : [...prev, pkgId]
    );
  };

  const totalPrice = selectedItems.reduce(
    (sum, s) => sum + s.price * (useQuantities ? s.quantity : 1),
    0
  );

  const handleGeneratePDF = () => {
    if (selectedItems.length === 0) return;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(catalog.name, 105, 20, { align: "center" });

    if (companyName.trim() !== "") {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text(`Empresa: ${companyName}`, 14, 35);
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 42, 196, 42);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Seleccionados", 14, 55);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("N°", 14, y);
    doc.text("Item", 30, y);
    if (useQuantities) doc.text("Cant.", 140, y, { align: "right" });
    doc.text("Precio (S/.)", 196, y, { align: "right" });

    doc.line(14, y + 2, 196, y + 2);

    doc.setFont("helvetica", "normal");
    selectedItems.forEach((srv, index) => {
      y += 10;
      const qty = useQuantities ? srv.quantity : 1;
      const totalSrv = srv.price * qty;

      doc.text(`${index + 1}`, 14, y);
      doc.text(`${srv.name} (${srv.type})`, 30, y);
      if (useQuantities) doc.text(`${qty}`, 140, y, { align: "right" });
      doc.text(totalSrv.toFixed(2), 196, y, { align: "right" });
    });

    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total:", 130, y);
    doc.text(`S/. ${totalPrice.toFixed(2)}`, 196, y, { align: "right" });

    let safeCompany = companyName.trim().replace(/\s+/g, "_");
    let filename = `${catalog.name}_seleccionados`;
    if (safeCompany) filename += `_${safeCompany}`;
    filename += ".pdf";

    doc.save(filename);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <p className="p-4">Cargando catálogo...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!catalog) return <p className="p-4">Catálogo no encontrado</p>;

  return (
    <div
      className="min-h-screen py-10 relative"
      style={{
        background: `linear-gradient(135deg, ${color}15, white 70%)`,
      }}
    >
      {showToast && (
        <div className="fixed top-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in-down">
          Reporte generado, revisa Descargas
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6">
        {/* Encabezado */}
        <h1
          className="text-4xl font-extrabold mb-12 tracking-tight text-center"
          style={{ color }}
        >
          {catalog.name}
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paquetes */}
            {usePackages &&
              catalog.packages?.map((pkg) => {
                const isSelected = selectedItems.some(
                  (s) => s.key === `package-${pkg.id}`
                );
                const current = selectedItems.find(
                  (s) => s.key === `package-${pkg.id}`
                );
                const isExpanded = expandedPackages.includes(pkg.id);

                return (
                  <div
                    key={`package-${pkg.id}`}
                    className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ease-in-out ${
                      isSelected ? "scale-[1.01]" : ""
                    }`}
                    style={{
                      borderColor: isSelected ? color : "#d1d5db",
                      backgroundColor: isSelected ? `${color}10` : "white",
                    }}
                  >
                    {/* Franja superior */}
                    <div
                      className="h-1.5 w-full"
                      style={{ backgroundColor: color }}
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{pkg.name}</p>
                          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                            {pkg.description}
                          </p>
                          <p className="font-semibold mt-3 text-gray-800">
                            S/. {pkg.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleItem(pkg, "package")}
                            className="w-5 h-5 cursor-pointer"
                            style={{ accentColor: color }}
                          />
                          {useQuantities && isSelected && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(`package-${pkg.id}`, -1)
                                }
                                className="w-8 h-8 flex items-center justify-center rounded-full shadow-sm"
                                style={{
                                  backgroundColor: `${color}22`,
                                  color: color,
                                }}
                              >
                                −
                              </button>
                              <span className="font-semibold">
                                {current?.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(`package-${pkg.id}`, +1)
                                }
                                className="w-8 h-8 flex items-center justify-center rounded-full shadow-sm"
                                style={{
                                  backgroundColor: `${color}22`,
                                  color: color,
                                }}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botón Ver más */}
                      {pkg.services?.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => toggleExpandPackage(pkg.id)}
                            className="text-sm font-medium px-3 py-1 rounded-lg transition-all"
                            style={{
                              backgroundColor: `${color}15`,
                              color: color,
                            }}
                          >
                            {isExpanded ? "Ocultar servicios" : "Ver servicios"}
                          </button>
                        </div>
                      )}

                      {/* Servicios dentro del paquete */}
                      {isExpanded && (
                        <div className="mt-4 space-y-2">
                          {pkg.services.map((srv) => (
                            <div
                              key={srv.id}
                              className="pl-4 border-l-4 py-2 text-sm"
                              style={{ borderColor: color }}
                            >
                              <p className="font-semibold text-gray-800">
                                {srv.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {srv.description}
                              </p>
                              <p className="text-gray-600 text-sm">
                                S/. {srv.price}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Servicios */}
            {catalog.services?.map((srv) => {
              const isSelected = selectedItems.some(
                (s) => s.key === `service-${srv.id}`
              );
              const current = selectedItems.find(
                (s) => s.key === `service-${srv.id}`
              );

              return (
                <div
                  key={`service-${srv.id}`}
                  onClick={() => handleToggleItem(srv, "service")}
                  className={`cursor-pointer rounded-lg p-6 border transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1 ${
                    isSelected ? "scale-[1.01]" : ""
                  }`}
                  style={{
                    borderColor: isSelected ? color : "#e5e7eb",
                    backgroundColor: isSelected ? `${color}12` : "white",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">{srv.name}</p>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        {srv.description}
                      </p>
                      <p className="font-semibold mt-3 text-gray-800">
                        S/. {srv.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-5 h-5 cursor-pointer"
                        style={{ accentColor: color }}
                      />
                      {useQuantities && isSelected && (
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              handleQuantityChange(`service-${srv.id}`, -1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full shadow-sm"
                            style={{
                              backgroundColor: `${color}22`,
                              color: color,
                            }}
                          >
                            −
                          </button>
                          <span className="font-semibold">
                            {current?.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(`service-${srv.id}`, +1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full shadow-sm"
                            style={{
                              backgroundColor: `${color}22`,
                              color: color,
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-fit sticky top-6 border">
            <h2 className="text-2xl font-bold mb-6" style={{ color }}>
              Resumen de selección
            </h2>

            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={useQuantities}
                onChange={(e) => setUseQuantities(e.target.checked)}
                className="w-5 h-5 mr-2"
                style={{ accentColor: color }}
              />
              <label className="text-sm text-gray-700">
                Activar cantidades
              </label>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                checked={usePackages}
                onChange={(e) => setUsePackages(e.target.checked)}
                className="w-5 h-5 mr-2"
                style={{ accentColor: color }}
              />
              <label className="text-sm text-gray-700">Activar paquetes</label>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nombre de la empresa"
                className="w-full rounded-lg px-4 py-2 border focus:outline-none transition"
                style={{
                  borderColor: companyName.trim() === "" ? "#f87171" : color,
                  boxShadow:
                    companyName.trim() !== "" ? `0 0 0 2px ${color}55` : "none",
                }}
              />
            </div>

            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No has seleccionado ningún elemento
              </p>
            ) : (
              <ul className="space-y-3 mb-6 text-gray-700">
                {selectedItems.map((srv) => {
                  const qty = useQuantities ? srv.quantity : 1;
                  return (
                    <li
                      key={srv.key}
                      className="flex justify-between text-sm border-b pb-1"
                      style={{ borderColor: `${color}33` }}
                    >
                      <span>
                        {srv.name} ({srv.type}) {useQuantities && `x${qty}`}
                      </span>
                      <span className="font-medium">
                        S/. {(srv.price * qty).toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex justify-between items-center mb-6">
              <p className="font-medium text-gray-700">Total:</p>
              <p className="font-bold text-lg">S/. {totalPrice.toFixed(2)}</p>
            </div>

            {selectedItems.length > 0 && (
              <button
                onClick={handleGeneratePDF}
                className="w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02]"
                style={{
                  backgroundColor: color,
                  color: "#fff",
                }}
              >
                Generar PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
