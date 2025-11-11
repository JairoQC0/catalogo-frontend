import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366F1", "#06B6D4", "#F59E0B", "#10B981", "#EF4444","#2a1f9a","#303030","#ffb800"];

// 🔹 Truncar texto largo
const truncateText = (text, maxLength = 12) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// 🔹 Tooltip personalizado
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, count } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 p-2 rounded shadow text-sm">
        <p className="font-semibold">{name}</p>
        <p>Cantidad: {count}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({
  servicesByCatalog,
  packagesByCatalog,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Servicios por catálogo */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Servicios por Catálogo</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={servicesByCatalog}>
            <XAxis dataKey="name" tickFormatter={(v) => truncateText(v, 10)} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Paquetes por catálogo */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Paquetes por Catálogo</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={packagesByCatalog}
              dataKey="count"
              nameKey="name"
              outerRadius={100}
              // ❌ Quitar labels dentro del gráfico
              label={false}
            >
              {packagesByCatalog?.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            {/* ✅ Solo leyenda y tooltip */}
            {packagesByCatalog?.length > 0 && (
              <>
                <Legend
                  formatter={(value) => truncateText(value, 15)}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
              </>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
