export default function Toast({ show, message }) {
  if (!show) return null;
  return (
    <div className="fixed top-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in-down">
      {message}
    </div>
  );
}
