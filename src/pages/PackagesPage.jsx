import { useEffect, useState } from "react";
import api from "../api/axios";
import { PlusCircle, Pencil, Trash2, Package, Loader2, X } from "lucide-react";

// 📦 Formulario de Paquetes
function PackageForm({ initialData, catalogs, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || "");
  const [catalogId, setCatalogId] = useState(initialData?.catalogId || "");
  const [serviceIds, setServiceIds] = useState(
    initialData?.services?.map((s) => s.id) || []
  );
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 👉 Traer servicios por catálogo
  useEffect(() => {
    if (!catalogId) return setServices([]);
    api
      .get(`/catalogs/${catalogId}`)
      .then((res) => setServices(res.data.services || []))
      .catch((err) =>
        setError(err.response?.data?.error || "Error cargando servicios")
      );
  }, [catalogId]);

  const handleCheckboxChange = (id) => {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body = {
        name,
        description,
        price: Number(price),
        catalogId: Number(catalogId),
        serviceIds: serviceIds.map(Number),
      };
      await onSubmit(body);

      if (!initialData) {
        setName("");
        setDescription("");
        setPrice("");
        setCatalogId("");
        setServiceIds([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error procesando paquete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-gray-100"
    >
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Grid de inputs */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Precio (S/.)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Catálogo</label>
          <select
            value={catalogId}
            onChange={(e) => setCatalogId(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">-- Selecciona un catálogo --</option>
            {catalogs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {services.length > 0 && (
        <div>
          <label className="block text-sm font-semibold mb-2">Servicios</label>
          <div className="grid sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={serviceIds.includes(s.id)}
                  onChange={() => handleCheckboxChange(s.id)}
                  className="w-4 h-4 accent-blue-600"
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-indigo-700 transition"
        >
          <PlusCircle size={18} />
          {loading ? "Procesando..." : initialData ? "Actualizar" : "Crear"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

// 🖼️ Modal de confirmación
function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// 📄 Página principal
export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, catRes] = await Promise.all([
          api.get("/packages"),
          api.get("/catalogs"),
        ]);
        setPackages(pkgRes.data);
        setCatalogs(catRes.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (data) => {
    const res = await api.post("/packages", data);
    setPackages((prev) => [...prev, res.data]);
  };

  const handleUpdate = async (data) => {
    const res = await api.put(`/packages/${editingPackage.id}`, data);
    setPackages((prev) =>
      prev.map((p) => (p.id === res.data.id ? res.data : p))
    );
    setEditingPackage(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/packages/${deleteTarget.id}`);
    setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 flex items-center gap-3 text-gray-800">
          <Package className="text-blue-600" size={32} />
          Gestión de Paquetes
        </h1>

        {loading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" size={20} />
            Cargando paquetes...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingPackage ? "Editar Paquete" : "Nuevo Paquete"}
          </h2>
          <PackageForm
            key={editingPackage?.id || "new"}
            initialData={editingPackage}
            catalogs={catalogs}
            onSubmit={editingPackage ? handleUpdate : handleCreate}
            onCancel={editingPackage ? () => setEditingPackage(null) : null}
          />
        </div>

        {/* Lista de paquetes */}
        {packages.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">
            No hay paquetes registrados aún.
          </p>
        ) : (
          <ul className="space-y-4">
            {packages.map((pkg) => (
              <li
                key={pkg.id}
                className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {pkg.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {pkg.description}
                    </p>
                    <p className="text-sm font-semibold text-blue-600 mt-2">
                      S/. {pkg.price}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Catálogo: {pkg.catalog?.name || "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Servicios:{" "}
                      {pkg.services?.length > 0
                        ? pkg.services.map((s) => s.name).join(", ")
                        : "—"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPackage(pkg)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition shadow"
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => setDeleteTarget(pkg)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition shadow"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar Paquete"
        message={`¿Estás seguro de eliminar el paquete "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
