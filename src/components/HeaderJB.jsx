import { motion } from "framer-motion";

export default function HeaderJB() {
  const ICONS = [
    {
      icon: "facebook",
      link: "https://www.facebook.com/p/Consultora-de-Asesor%C3%ADa-Empresarial-JB-61560072496156/?locale=es_LA",
    },
    {
      icon: "youtube",
      link: "https://www.youtube.com/@ConsultoradeAsesor%C3%ADaEmpresaria",
    },
    {
      icon: "linkedin",
      link: "https://www.linkedin.com/in/consultora-de-asesor%C3%ADa-empresarial-jb-345b54311/",
    },
    {
      icon: "instagram",
      link: "https://www.instagram.com/consultoradeasesoriajb/#",
    },
    { icon: "tiktok", link: "https://www.tiktok.com/@consultorajb" },
  ];

  return (
    <motion.header
      className="bg-[#1F1F70] text-white py-5 md:py-4 shadow-md sticky top-0 z-[100]"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* LOGO */}
        <motion.div
          className="flex justify-center md:justify-start"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <img
            src="/LOGO.png"
            alt="Consultora JB Logo"
            className="h-14 md:h-10 object-contain" // 👈 más grande en mobile
          />
        </motion.div>

        {/* REDES */}
        <motion.div
          className="flex justify-center md:justify-end gap-3 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {ICONS.map((r, i) => (
            <motion.a
              key={r.icon}
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white text-[#1F1F70] rounded-full"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              whileHover={{ scale: 1.1, rotate: 3 }}
            >
              <i className={`bi bi-${r.icon} text-base md:text-lg`}></i>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.header>
  );
}
