import { useEffect, useState } from "react";
import api from "../api/axios";
import { PlusCircle, Pencil, Trash2, Briefcase, Loader2 } from "lucide-react";

export default function Services() {
  const [catalogs, setCatalogs] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Formulario nuevo servicio
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Edición de servicio
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      const res = await api.get("/catalogs");
      setCatalogs(res.data);
    } catch {
      setError("⚠️ Error al cargar catálogos");
    }
  };

  const fetchServices = async (catalogId) => {
    setLoading(true);
    try {
      const res = await api.get(`/catalogs/${catalogId}`);
      setServices(res.data.services || []);
    } catch {
      setError("⚠️ Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleCatalogChange = (e) => {
    const id = e.target.value;
    setSelectedCatalog(id);
    setServices([]);
    setEditingId(null);
    if (id) fetchServices(id);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedCatalog) {
      setError("Debes seleccionar un catálogo");
      return;
    }

    try {
      await api.post(`/catalogs/${selectedCatalog}/services`, {
        name,
        description,
        price: parseFloat(price),
      });
      setName("");
      setDescription("");
      setPrice("");
      fetchServices(selectedCatalog);
    } catch {
      setError("❌ No se pudo crear el servicio");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/catalogs/services/${id}`);
      fetchServices(selectedCatalog);
    } catch {
      setError("❌ No se pudo eliminar el servicio");
    }
  };

  const handleEdit = (srv) => {
    setEditingId(srv.id);
    setEditForm({
      name: srv.name,
      description: srv.description,
      price: srv.price,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/catalogs/services/${id}`, {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
      });
      setEditingId(null);
      fetchServices(selectedCatalog);
    } catch {
      setError("❌ No se pudo actualizar el servicio");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 flex items-center gap-3 text-gray-800">
          <Briefcase className="text-blue-600" size={32} />
          Gestión de Servicios
        </h1>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        {/* Selector de catálogo */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Selecciona un catálogo
          </label>
          <select
            value={selectedCatalog}
            onChange={handleCatalogChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">-- Selecciona --</option>
            {catalogs.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Formulario crear servicio */}
        {selectedCatalog && !editingId && (
          <form
            onSubmit={handleCreate}
            className="space-y-4 mb-10 bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Nuevo servicio
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del servicio"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-indigo-700 transition"
            >
              <PlusCircle size={18} /> Crear servicio
            </button>
          </form>
        )}

        {/* Lista de servicios */}
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" size={20} />
            Cargando servicios...
          </div>
        ) : services.length > 0 ? (
          <ul className="space-y-4">
            {services.map((srv) => (
              <li
                key={srv.id}
                className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                {editingId === srv.id ? (
                  <div className="space-y-3">
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      step="0.01"
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-40 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(srv.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition shadow"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {srv.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {srv.description}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 mt-2">
                        S/. {srv.price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(srv)}
                        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition shadow"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition shadow"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center mt-8">
            No hay servicios en este catálogo aún.
          </p>
        )}
      </div>
    </div>
  );
}
