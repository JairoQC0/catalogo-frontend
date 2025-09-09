import { useState, useEffect } from "react";

// 🎨 10 colores predefinidos
export const COLORS = [
  "#f87171", // rojo
  "#fbbf24", // amarillo
  "#34d399", // verde
  "#60a5fa", // azul
  "#a78bfa", // morado
  "#f472b6", // rosa
  "#fb923c", // naranja
  "#2dd4bf", // turquesa
  "#4ade80", // verde claro
  "#c084fc", // lila
];

// Función para contraste texto (blanco o negro)
export function getContrastColor(hexcolor) {
  if (!hexcolor) return "#000";
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
}

// Hook para colores de catálogo
export function useCatalogColors() {
  const [colors, setColors] = useState({});

  // Leer desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("catalog-colors");
    if (saved) {
      setColors(JSON.parse(saved));
    }
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("catalog-colors", JSON.stringify(colors));
  }, [colors]);

  const setColor = (id, color) => {
    setColors((prev) => ({
      ...prev,
      [id]: color,
    }));
  };

  return { colors, setColor };
}
