import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="p-6 bg-white shadow rounded-2xl w-full max-w-lg text-center">
        <h2 className="text-xl font-bold mb-2">Bienvenido Usuario</h2>
        {user && (
          <p className="text-gray-600">
            <strong>Rol:</strong> {user.role}
          </p>
        )}
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
