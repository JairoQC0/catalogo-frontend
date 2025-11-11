import { useState, useEffect } from "react";

// Paleta de colores predeterminados
export const COLORS = [
  "#f87171", // rojo
  "#fb923c", // naranja
  "#facc15", // amarillo
  "#4ade80", // verde
  "#2dd4bf", // turquesa
  "#60a5fa", // azul
  "#a78bfa", // violeta
  "#f472b6", // rosa
  "#2a1f9a",
  "#303030",
  "#ffb800",
];

// Utilidad para contraste (blanco o negro según el fondo)
export const getContrastColor = (hex) => {
  if (!hex) return "#000000";
  const c = hex.substring(1); // quitar #
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminancia > 150 ? "#000000" : "#ffffff";
};

// Hook para manejar colores por catálogo
export const useCatalogColors = () => {
  const [colors, setColors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("catalogColors");
    if (saved) {
      setColors(JSON.parse(saved));
    }
  }, []);

  const setColor = (id, color) => {
    setColors((prev) => {
      const updated = { ...prev, [id]: color };
      localStorage.setItem("catalogColors", JSON.stringify(updated));
      return updated;
    });
  };

  return { colors, setColor };
};
