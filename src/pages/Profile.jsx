import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <p className="p-4">No hay información de usuario</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>

      <div className="space-y-2">
        <p>
          <span className="font-medium">Correo:</span> {user.email}
        </p>
        <p>
          <span className="font-medium">Rol:</span> {user.role}
        </p>
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
