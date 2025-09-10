import { useEffect, useState } from "react";
import api from "../api/axios";
import { PlusCircle, Trash2, FolderKanban, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [catalogs, setCatalogs] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState(null); // 👈 para modal

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      setError("");
      const res = await api.get("/catalogs");
      setCatalogs(res.data);
    } catch {
      setError("⚠️ Error al cargar catálogos");
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
      fetchCatalogs();
    } catch {
      setError("❌ No se pudo crear el catálogo");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      setError("");
      setSuccess("");
      await api.delete(`/catalogs/${deleteId}`);
      setSuccess("🗑️ Catálogo eliminado");
      setDeleteId(null); // cerrar modal
      fetchCatalogs();
    } catch {
      setError("❌ No se pudo eliminar el catálogo");
    }
  };

  if (loading)
    return (
      <p className="p-6 text-gray-600 animate-pulse text-center">
        Cargando catálogos...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* título */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">
          <FolderKanban className="text-indigo-600" size={28} />
          Panel de Administración
        </h1>

        {/* mensajes */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg mb-4 shadow-sm text-sm sm:text-base">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded-lg mb-4 shadow-sm text-sm sm:text-base">
            {success}
          </div>
        )}

        {/* formulario */}
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-3 mb-10 bg-white border border-gray-200 rounded-xl shadow-md p-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del catálogo"
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2 rounded-lg transition shadow-md text-sm sm:text-base"
          >
            <PlusCircle size={18} /> Crear
          </button>
        </form>

        {/* lista */}
        {catalogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {catalogs.map((cat) => (
              <div
                key={cat.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:shadow-lg transition"
              >
                <span className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                  {cat.name}
                </span>
                <button
                  onClick={() => confirmDelete(cat.id)}
                  className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 rounded-lg transition shadow-md text-sm sm:text-base"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10 text-sm sm:text-base">
            No hay catálogos creados aún.
          </p>
        )}
      </div>

      {/* modal de confirmación */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-3" size={36} />
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              ¿Eliminar catálogo?
            </h2>
            <p className="text-gray-600 text-sm mb-5">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition text-sm"
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
