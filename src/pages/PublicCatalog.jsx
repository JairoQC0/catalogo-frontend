import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import jsPDF from "jspdf";
import { useCatalogColors } from "../store/useCatalogColors";
import CatalogFilters from "../components/CatalogFilters";
import CatalogSidebar from "../components/CatalogSidebar";
import CatalogItem from "../components/CatalogItem";
import Toast from "../components/Toast";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";
import "../quill-custom.css";
import HeaderJB from "../components/HeaderJB";
import FooterJB from "../components/FooterJB";
import { motion } from "framer-motion";

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

  // cargar catálogo
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/catalogs/${id}`);
        setCatalog(res.data);
      } catch (err) {
        setError("Error al cargar el catálogo");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [id]);

  // seleccionar / quitar
  const handleToggleItem = (item, type) => {
    const key = `${type}-${item.id}`;
    if (selectedItems.find((s) => s.key === key)) {
      setSelectedItems((prev) => prev.filter((s) => s.key !== key));
    } else {
      setSelectedItems((prev) => [
        ...prev,
        { ...item, type, key, quantity: 1 },
      ]);
    }
  };

  // cantidades
  const handleQuantityChange = (key, delta) => {
    setSelectedItems((prev) =>
      prev.map((s) =>
        s.key === key
          ? { ...s, quantity: Math.max(1, s.quantity + delta) }
          : s
      )
    );
  };

  // ver servicios de paquetes
  const toggleExpandPackage = (pkgId) => {
    setExpandedPackages((prev) =>
      prev.includes(pkgId)
        ? prev.filter((id) => id !== pkgId)
        : [...prev, pkgId]
    );
  };

  // total
  const totalPrice = selectedItems.reduce(
    (sum, s) => sum + s.price * (useQuantities ? s.quantity : 1),
    0
  );

  // PDF
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

  // filtrar + ordenar
  const getFilteredAndSortedItems = () => {
    if (!catalog) return [];
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Cargando catálogo...
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-center text-red-500 font-semibold">{error}</p>;
  }

  if (!catalog) {
    return (
      <p className="p-4 text-center text-gray-600">Catálogo no encontrado</p>
    );
  }

  const items = getFilteredAndSortedItems();

  return (
  <>
    {/* HEADER */}
    <HeaderJB />

    {/* CONTENIDO PRINCIPAL */}
    <div
      className="min-h-screen pb-12"
      style={{
        background: `radial-gradient(circle at top, ${color}11 0%, #ffffff 45%, #ffffff 100%)`,
      }}
    >
      <Toast show={showToast} message="Reporte generado, revisa Descargas" />

      {/* HERO */}
      <motion.header
        className="w-full bg-transparent pt-10 pb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-3 text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-gray-400">
            Catálogo público
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ color }}
          >
            {catalog.name}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Selecciona los servicios o paquetes y genera un PDF con tu cotización en segundos.
          </p>
        </div>
      </motion.header>

      {/* FILTROS */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <CatalogFilters
          filterType={filterType}
          setFilterType={setFilterType}
          sortName={sortName}
          setSortName={setSortName}
          sortPrice={sortPrice}
          setSortPrice={setSortPrice}
          color={color}
        />
      </div>

      {/* CONTENIDO */}
      <div className="max-w-6xl mx-auto px-6 mt-4 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10">
        {/* LISTA */}
        <div className="flex flex-col gap-5">
          <div className="grid md:grid-cols-2 gap-5">
            {getFilteredAndSortedItems().length === 0 ? (
              <p className="text-sm text-gray-400 col-span-full">
                No hay elementos que coincidan con el filtro seleccionado.
              </p>
            ) : (
              getFilteredAndSortedItems().map((item) => {
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
              })
            )}
          </div>
        </div>

        {/* SIDEBAR */}
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

    {/* FOOTER */}
    <FooterJB />
  </>
);

}
