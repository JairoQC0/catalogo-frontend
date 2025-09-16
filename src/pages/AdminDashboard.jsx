import { useEffect, useState } from "react";
import api from "../api/axios";
import { PlusCircle, Trash2, FolderKanban, AlertTriangle } from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import DashboardCharts from "../components/DashboardCharts";

export default function AdminDashboard() {
  const [catalogs, setCatalogs] = useState([]);
  const [packages, setPackages] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError("");
      const [catRes, pkgRes] = await Promise.all([
        api.get("/catalogs"),
        api.get("/packages"),
      ]);
      setCatalogs(catRes.data);
      setPackages(pkgRes.data);
    } catch {
      setError("⚠️ Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      await api.post("/catalogs", { name });
      setName("");
      setSuccess("✅ Catálogo creado con éxito");
      fetchData();
    } catch {
      setError("❌ No se pudo crear el catálogo");
    }
  };

  const confirmDelete = (id) => setDeleteId(id);

  const handleDelete = async () => {
    try {
      setError("");
      setSuccess("");
      await api.delete(`/catalogs/${deleteId}`);
      setSuccess("🗑️ Catálogo eliminado");
      setDeleteId(null);
      fetchData();
    } catch {
      setError("❌ No se pudo eliminar el catálogo");
    }
  };

  if (loading)
    return (
      <p className="p-6 text-gray-600 animate-pulse text-center">Cargando...</p>
    );

  // Procesar datos para gráficos
  const servicesByCatalog = catalogs.map((c) => ({
    name: c.name,
    count: c.services ? c.services.length : 0,
  }));

  const packagesByCatalog = catalogs.map((c) => ({
    name: c.name,
    count: packages.filter((p) => p.catalogId === c.id).length,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* título */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">
          <FolderKanban className="text-indigo-600" size={28} />
          Panel de Administración
        </h1>

        {/* mensajes */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* stats */}
        <DashboardStats
          catalogs={catalogs}
          servicesByCatalog={servicesByCatalog}
          packagesByCatalog={packagesByCatalog}
        />

        {/* charts */}
        <DashboardCharts
          servicesByCatalog={servicesByCatalog}
          packagesByCatalog={packagesByCatalog}
        />

        {/* CRUD catálogos */}
        <form
          onSubmit={handleCreate}
          className="flex gap-3 mt-10 bg-white border rounded-xl shadow-md p-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del catálogo"
            className="border rounded px-4 py-2 flex-1"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            <PlusCircle size={18} /> Crear
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {catalogs.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border rounded-xl shadow-sm p-4 flex justify-between items-center"
            >
              <span className="font-semibold text-gray-800">{cat.name}</span>
              <button
                onClick={() => confirmDelete(cat.id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
              >
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-3" size={36} />
            <h2 className="text-lg font-bold mb-2">¿Eliminar catálogo?</h2>
            <p className="text-gray-600 text-sm mb-5">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
