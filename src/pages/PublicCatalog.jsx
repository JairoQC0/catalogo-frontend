import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import jsPDF from "jspdf";
import { useCatalogColors } from "../store/useCatalogColors";

// Componentes
import CatalogFilters from "../components/CatalogFilters";
import CatalogItem from "../components/CatalogItem";
import CatalogSidebar from "../components/CatalogSidebar";
import Toast from "../components/Toast";

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

  // 🔽 filtros separados
  const [filterType, setFilterType] = useState("all");
  const [sortName, setSortName] = useState("none");
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
      {/* Toast */}
      <Toast show={showToast} message="Reporte generado, revisa Descargas" />

      <div className="max-w-6xl mx-auto px-6">
        <h1
          className="text-4xl font-extrabold mb-6 tracking-tight text-center"
          style={{ color }}
        >
          {catalog.name}
        </h1>

        {/* Filtros */}
        <CatalogFilters
          filterType={filterType}
          setFilterType={setFilterType}
          sortName={sortName}
          setSortName={setSortName}
          sortPrice={sortPrice}
          setSortPrice={setSortPrice}
          color={color}
        />

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
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

          {/* Sidebar */}
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
