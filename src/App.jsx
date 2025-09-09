import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Catalogs from "./pages/Catalogs";
import Services from "./pages/Services";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import PublicCatalog from "./pages/PublicCatalog";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogs/:id" element={<PublicCatalog />} />
          {/* Usuario normal */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserLayout>
                  <Profile />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin con sidebar */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="catalogs" element={<Catalogs />} />
            <Route path="services" element={<Services />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
