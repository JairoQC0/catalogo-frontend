export default function DashboardStats({
  catalogs,
  servicesByCatalog,
  packagesByCatalog,
}) {
  const totalCatalogs = catalogs.length;
  const totalServices = servicesByCatalog.reduce((acc, c) => acc + c.count, 0);
  const totalPackages = packagesByCatalog.reduce((acc, c) => acc + c.count, 0);

  const stats = [
    { label: "Catálogos", value: totalCatalogs },
    { label: "Servicios", value: totalServices },
    { label: "Paquetes", value: totalPackages },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center"
        >
          <span className="text-3xl font-extrabold text-indigo-600">
            {s.value}
          </span>
          <span className="text-gray-600 mt-2">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
