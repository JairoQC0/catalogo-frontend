import { useEffect, useState } from "react";
import api from "../api/axios";
import { PlusCircle, Pencil, Trash2, Package, Loader2, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";
import "../quill-custom.css";

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

  useEffect(() => {
    if (!catalogId) return setServices([]);
    api
      .get(`/catalogs/${catalogId}`)
      .then((res) => setServices(res.data.services || []))
      .catch(() =>
        setError("Error al cargar los servicios del catálogo seleccionado")
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
    } catch {
      setError("Error procesando el paquete");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Nombre del paquete
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Paquete de Marketing Digital"
            className="border border-gray-300 rounded-xl px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-white transition"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Precio (S/.)
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="S/. 0.00"
            className="border border-gray-300 rounded-xl px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-white transition"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-gray-700 mb-2">
            Descripción
          </label>
          <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition bg-gray-50">
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={quillModules}
              formats={quillFormats}
              className="custom-quill bg-white rounded-b-xl"
              placeholder="Describe el contenido del paquete, agrega listas, negritas, títulos..."
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Catálogo
          </label>
          <select
            value={catalogId}
            onChange={(e) => setCatalogId(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-white transition"
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
          <label className="block font-semibold text-gray-700 mb-2">
            Servicios incluidos
          </label>
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
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
        >
          <PlusCircle size={18} />
          {loading ? "Procesando..." : initialData ? "Actualizar" : "Crear"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-xl hover:bg-gray-300 transition font-medium shadow-sm"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

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
      } catch {
        setError("Error cargando datos");
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
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-gray-800">
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

        {packages.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">
            No hay paquetes registrados aún.
          </p>
        ) : (
          <ul className="space-y-4">
            {packages.map((pkg) => (
              <li
                key={pkg.id}
                className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">
                      {pkg.name}
                    </p>
                    <div
                      className="ql-bubble ql-editor p-0 text-gray-700 mt-3"
                      dangerouslySetInnerHTML={{ __html: pkg.description }}
                    />
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                      <span>
                        <strong className="text-blue-600">
                          S/. {pkg.price}
                        </strong>
                      </span>
                      <span>
                        Catálogo: <strong>{pkg.catalog?.name || "—"}</strong>
                      </span>
                      <span>
                        Servicios:{" "}
                        <strong>
                          {pkg.services?.length > 0
                            ? pkg.services.map((s) => s.name).join(", ")
                            : "—"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingPackage(pkg)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 transition shadow-md"
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => setDeleteTarget(pkg)}
                      className="flex items-center gap-1 bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition shadow-md"
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
