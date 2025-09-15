import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Wrench,
  Boxes, // 👈 nuevo ícono
} from "lucide-react";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/catalogs", label: "Catálogos", icon: <Package size={18} /> },
    { to: "/admin/services", label: "Servicios", icon: <Wrench size={18} /> },
    { to: "/admin/packages", label: "Paquetes", icon: <Boxes size={18} /> }, // ✅ nuevo
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-gray-100 flex flex-col transform 
        transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        <h2 className="text-2xl font-bold p-4 border-b border-gray-800">
          Admin Panel
        </h2>
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${
                  active
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-800"
                }
                `}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay en mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between md:justify-start md:gap-6">
          {/* Botón menu en mobile */}
          <button
            className="text-gray-700 hover:text-gray-900 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 className="text-lg font-bold text-gray-800">Admin</h1>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
