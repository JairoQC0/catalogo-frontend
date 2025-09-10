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
  const [selectedServices, setSelectedServices] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [useQuantities, setUseQuantities] = useState(false);

  // 🔹 usamos zustand para obtener el color dinámico
  const { colors } = useCatalogColors();
  const color = colors[id] || "#3b82f6"; // fallback azul

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

  const handleToggleService = (service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id, delta) => {
    setSelectedServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: Math.max(1, s.quantity + delta) } : s
      )
    );
  };

  const totalPrice = selectedServices.reduce(
    (sum, s) => sum + s.price * (useQuantities ? s.quantity : 1),
    0
  );

  const handleGeneratePDF = () => {
    if (selectedServices.length === 0) return;
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
    doc.text("Servicios seleccionados", 14, 55);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("N°", 14, y);
    doc.text("Servicio", 30, y);
    if (useQuantities) doc.text("Cant.", 140, y, { align: "right" });
    doc.text("Precio (S/.)", 196, y, { align: "right" });

    doc.line(14, y + 2, 196, y + 2);

    doc.setFont("helvetica", "normal");
    selectedServices.forEach((srv, index) => {
      y += 10;
      const qty = useQuantities ? srv.quantity : 1;
      const totalSrv = srv.price * qty;

      doc.text(`${index + 1}`, 14, y);
      doc.text(srv.name, 30, y);
      if (useQuantities) doc.text(`${qty}`, 140, y, { align: "right" });
      doc.text(totalSrv.toFixed(2), 196, y, { align: "right" });
    });

    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total:", 130, y);
    doc.text(`S/. ${totalPrice.toFixed(2)}`, 196, y, { align: "right" });

    let safeCompany = companyName.trim().replace(/\s+/g, "_");
    let filename = `${catalog.name}_servicios`;
    if (safeCompany) filename += `_${safeCompany}`;
    filename += ".pdf";

    doc.save(filename);
  };

  if (loading) return <p className="p-4">Cargando catálogo...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!catalog) return <p className="p-4">Catálogo no encontrado</p>;

  return (
    <div
      className="min-h-screen py-10"
      style={{
        background: `linear-gradient(135deg, ${color}15, white 70%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Título */}
        <h1
          className="text-4xl font-extrabold mb-12 tracking-tight text-center"
          style={{ color }}
        >
          {catalog.name}
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Lista de servicios */}
          <div className="lg:col-span-2 space-y-6">
            {catalog.services.map((srv) => {
              const isSelected = selectedServices.some((s) => s.id === srv.id);
              const current = selectedServices.find((s) => s.id === srv.id);

              return (
                <div
                  key={srv.id}
                  onClick={() => handleToggleService(srv)}
                  className={`cursor-pointer rounded-xl p-6 border transition-all duration-300 ease-in-out transform hover:shadow-md ${
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
                      <p className="font-bold mt-3">S/. {srv.price}</p>
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
                            onClick={() => handleQuantityChange(srv.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm"
                            style={{
                              backgroundColor: `${color}22`,
                              color: color,
                            }}
                          >
                            −
                          </button>
                          <span className="font-semibold text-gray-700 text-base min-w-[24px] text-center">
                            {current?.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(srv.id, +1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm"
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

          {/* Sidebar resumen */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-fit sticky top-6 border">
            <h2 className="text-2xl font-bold mb-6" style={{ color }}>
              Resumen de selección
            </h2>

            {/* Activar cantidades */}
            <div className="flex items-center mb-6">
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

            {/* Input empresa */}
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

            {selectedServices.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No has seleccionado ningún servicio
              </p>
            ) : (
              <ul className="space-y-3 mb-6 text-gray-700">
                {selectedServices.map((srv) => {
                  const qty = useQuantities ? srv.quantity : 1;
                  return (
                    <li
                      key={srv.id}
                      className="flex justify-between text-sm border-b pb-1"
                      style={{ borderColor: `${color}33` }}
                    >
                      <span>
                        {srv.name} {useQuantities && `x${qty}`}
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

            {/* Botón PDF */}
            {selectedServices.length > 0 && (
              <button
                onClick={handleGeneratePDF}
                className="w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: color,
                  color: "#fff",
                }}
              >
                📄 Generar PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
