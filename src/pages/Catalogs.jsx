import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import {
  COLORS,
  getContrastColor,
  useCatalogColors,
} from "../store/useCatalogColors";

export default function Catalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newName, setNewName] = useState("");
  const [openColorPicker, setOpenColorPicker] = useState(null);
  const [loading, setLoading] = useState(true);

  const { colors, setColor } = useCatalogColors();
  const pickerRef = useRef(null);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        openColorPicker !== null
      ) {
        setOpenColorPicker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openColorPicker]);

  const fetchCatalogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/catalogs");
      setCatalogs(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCatalog = async (id) => {
    await api.put(`/catalogs/${id}`, { name: newName });
    fetchCatalogs();
    setEditing(null);
    setNewName("");
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-r from-indigo-50 via-white to-cyan-50">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6">
        Catálogos
      </h2>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {catalogs.map((cat) => {
            const bg = colors[cat.id] || "#ffffff";
            const textColor = getContrastColor(bg);

            return (
              <div
                key={cat.id}
                className="relative p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between bg-white border"
              >
                {/* Franja de color superior */}
                <div
                  className="absolute top-0 left-0 w-full h-2 rounded-t-2xl"
                  style={{ backgroundColor: bg }}
                />

                {editing === cat.id ? (
                  <div className="space-y-3 mt-2">
                    <input
                      className="w-full border rounded-xl p-2 text-black"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nuevo nombre"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleUpdateCatalog(cat.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-between gap-3">
                    {/* Título */}
                    <span className="text-lg font-semibold truncate mt-2">
                      {cat.name}
                    </span>

                    {/* Botones */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <button
                        onClick={() => {
                          setEditing(cat.id);
                          setNewName(cat.name);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-xl text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          window.open(`/catalogs/${cat.id}`, "_blank")
                        }
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-xl text-sm"
                      >
                        Ver público
                      </button>
                      <button
                        onClick={() =>
                          setOpenColorPicker(
                            openColorPicker === cat.id ? null : cat.id
                          )
                        }
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-xl text-sm flex items-center justify-center gap-1"
                      >
                        🎨
                        <span
                          className="inline-block w-4 h-4 rounded-full border"
                          style={{ backgroundColor: bg }}
                        />
                      </button>
                    </div>

                    {/* Paleta flotante */}
                    {openColorPicker === cat.id && (
                      <div
                        ref={pickerRef}
                        className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl p-3 border flex flex-wrap gap-2"
                      >
                        {/* sin color */}
                        <button
                          onClick={() => {
                            setColor(cat.id, "#ffffff");
                            setOpenColorPicker(null);
                          }}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition ${
                            (!colors[cat.id] || colors[cat.id] === "#ffffff") &&
                            "ring-2 ring-black"
                          }`}
                          style={{ backgroundColor: "#ffffff" }}
                        >
                          ✕
                        </button>
                        {COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setColor(cat.id, c);
                              setOpenColorPicker(null);
                            }}
                            className={`w-8 h-8 rounded-full border hover:scale-110 transition ${
                              colors[cat.id] === c ? "ring-2 ring-black" : ""
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
