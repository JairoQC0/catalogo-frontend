import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import jsPDF from "jspdf";
import { useCatalogColors } from "../store/useCatalogColors";
import CatalogFilters from "../components/CatalogFilters";
import CatalogSidebar from "../components/CatalogSidebar";
import Toast from "../components/Toast";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";
import "../quill-custom.css";

function CatalogItem({
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
  const isPackage = item.type === "package";
  const isExpanded = expandedPackages.includes(item.id);
  const [showDescription, setShowDescription] = useState(false);
  const bg = isSelected ? `${color}10` : "white";
  const border = isSelected ? color : "#e5e7eb";

  return (
    <div
      className="p-6 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      style={{ borderColor: border, background: bg }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 leading-snug">
          {item.name}
        </h3>
        <span className="text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
          S/. {item.price}
        </span>
      </div>

      <button
        onClick={() => setShowDescription(!showDescription)}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition mb-3"
      >
        {showDescription ? "Ocultar descripción" : "Ver descripción"}
      </button>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          showDescription ? "max-h-64" : "max-h-0"
        }`}
      >
        {showDescription && (
          <div className="ql-bubble ql-editor text-gray-700 text-sm leading-relaxed border rounded-lg p-3 bg-gray-50 overflow-y-auto max-h-60">
            <div dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>
        )}
      </div>

      {isPackage && item.services?.length > 0 && (
        <button
          onClick={() => toggleExpandPackage(item.id)}
          className="text-sm text-blue-600 mt-3 hover:underline"
        >
          {isExpanded ? "Ocultar servicios" : "Ver servicios incluidos"}
        </button>
      )}

      {isPackage && isExpanded && (
        <ul className="mt-3 ml-4 list-disc text-gray-600 text-sm space-y-1">
          {item.services.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between mt-6">
        {useQuantities && isSelected && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(current.key, -1)}
              className="bg-gray-200 px-3 py-1 rounded-full font-bold hover:bg-gray-300 transition"
            >
              −
            </button>
            <span className="font-medium">{current.quantity}</span>
            <button
              onClick={() => handleQuantityChange(current.key, 1)}
              className="bg-gray-200 px-3 py-1 rounded-full font-bold hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={() => handleToggleItem(item, item.type)}
          style={{
            backgroundColor: isSelected ? color : "white",
            color: isSelected ? "white" : color,
            borderColor: color,
          }}
          className="border px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
        >
          {isSelected ? "Quitar" : "Seleccionar"}
        </button>
      </div>
    </div>
  );
}

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
  const [expandedPackages, setExpandedPackages] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortName, setSortName] = useState("asc");
  const [sortPrice, setSortPrice] = useState("none");
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
    doc.text("N°", 14, y);
    doc.text("Item", 30, y);
    if (useQuantities) doc.text("Cant.", 140, y, { align: "right" });
    doc.text("Precio (S/.)", 196, y, { align: "right" });
    doc.line(14, y + 2, 196, y + 2);
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

  const getFilteredAndSortedItems = () => {
    let items = [];
    if (usePackages) {
      items = [
        ...items,
        ...(catalog.packages?.map((p) => ({ ...p, type: "package" })) || []),
      ];
    }
    items = [
      ...items,
      ...(catalog.services?.map((s) => ({ ...s, type: "service" })) || []),
    ];
    if (filterType !== "all") {
      items = items.filter((i) => i.type === filterType);
    }
    if (sortName === "asc") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortName === "desc") {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortPrice === "asc") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortPrice === "desc") {
      items.sort((a, b) => b.price - a.price);
    }
    return items;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Cargando catálogo...
      </div>
    );
  if (error)
    return (
      <p className="p-4 text-center text-red-500 font-semibold">{error}</p>
    );
  if (!catalog)
    return (
      <p className="p-4 text-center text-gray-600">Catálogo no encontrado</p>
    );

  return (
    <div
      className="min-h-screen py-12 relative"
      style={{
        background: `linear-gradient(135deg, ${color}20, white 70%)`,
      }}
    >
      <Toast show={showToast} message="Reporte generado, revisa Descargas" />
      <div className="max-w-6xl mx-auto px-6">
        <h1
          className="text-4xl font-extrabold mb-10 tracking-tight text-center"
          style={{ color }}
        >
          {catalog.name}
        </h1>

        <CatalogFilters
          filterType={filterType}
          setFilterType={setFilterType}
          sortName={sortName}
          setSortName={setSortName}
          sortPrice={sortPrice}
          setSortPrice={setSortPrice}
          color={color}
        />

        <div className="grid lg:grid-cols-3 gap-10 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {getFilteredAndSortedItems().map((item) => {
              const key = `${item.type}-${item.id}`;
              const isSelected = selectedItems.some((s) => s.key === key);
              const current = selectedItems.find((s) => s.key === key);
              return (
                <CatalogItem
                  key={key}
                  item={item}
                  isSelected={isSelected}
                  current={current}
                  handleToggleItem={handleToggleItem}
                  handleQuantityChange={handleQuantityChange}
                  useQuantities={useQuantities}
                  color={color}
                  toggleExpandPackage={toggleExpandPackage}
                  expandedPackages={expandedPackages}
                />
              );
            })}
          </div>

          <CatalogSidebar
            selectedItems={selectedItems}
            useQuantities={useQuantities}
            setUseQuantities={setUseQuantities}
            usePackages={usePackages}
            setUsePackages={setUsePackages}
            companyName={companyName}
            setCompanyName={setCompanyName}
            totalPrice={totalPrice}
            handleGeneratePDF={handleGeneratePDF}
            color={color}
          />
        </div>
      </div>
    </div>
  );
}
