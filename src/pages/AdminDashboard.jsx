import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [catalogs, setCatalogs] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleDelete = async (id) => {
    try {
      setError("");
      setSuccess("");
      await api.delete(`/catalogs/${id}`);
      setSuccess("🗑️ Catálogo eliminado");
      fetchCatalogs();
    } catch {
      setError("❌ No se pudo eliminar el catálogo");
    }
  };

  if (loading)
    return (
      <p className="p-6 text-gray-600 animate-pulse">Cargando catálogos...</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Panel de Administración
      </h1>

      {/* mensajes de estado */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* formulario para crear catálogo */}
      <form
        onSubmit={handleCreate}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del catálogo"
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition shadow-sm"
        >
          Crear
        </button>
      </form>

      {/* lista de catálogos */}
      <ul className="space-y-3">
        {catalogs.map((cat) => (
          <li
            key={cat.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
          >
            <span className="font-medium text-gray-800">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition shadow-sm"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {catalogs.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          No hay catálogos creados aún.
        </p>
      )}
    </div>
  );
}
