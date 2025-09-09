import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Admin() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get("/user/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch {
        setError("Error al cargar datos de administrador");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
        Panel de Administración
      </h1>

      {loading && (
        <p className="text-gray-600 animate-pulse">Cargando datos...</p>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información del Administrador
          </h2>

          {/* Grid de datos */}
          <div className="grid sm:grid-cols-2 gap-6">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow transition"
              >
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {key}
                </p>
                <p className="font-medium text-gray-800 break-words">
                  {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : value?.toString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
