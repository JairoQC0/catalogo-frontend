import { motion } from "framer-motion";

export default function FooterJB() {
  const ICONS = [
    {
      icon: "globe",
      link: "https://consultoradeasesoriaempresarialjb.com/",
    },
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
    <footer className="bg-[#1F1F70] text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 text-center md:text-left">
        {/* LOGO + REDES */}
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between mb-8 gap-4">
          {/* Logo */}
          <motion.img
            src="/LOGO.png"
            alt="Consultora JB Logo"
            className="h-14 md:h-10 object-contain"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Redes sociales */}
          <motion.div
            className="flex gap-3 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {ICONS.map((r, i) => (
              <motion.a
                key={r.icon}
                href={r.link}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.15 }}
              >
                <i className={`bi bi-${r.icon} text-base md:text-lg`}></i>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* DESCRIPCIÓN */}
        <p className="text-gray-200 text-sm md:text-[15px] mb-8 leading-relaxed max-w-3xl mx-auto md:mx-0">
          En <strong>Consultora de Asesoría Empresarial JB</strong> creemos que
          el compromiso, la innovación y la excelencia son la base para brindar
          soluciones que transforman. Nos esforzamos día a día para superar
          expectativas y construir relaciones duraderas con nuestros clientes.
        </p>

        {/* INFORMACIÓN */}
        <div className="text-gray-300 text-sm space-y-2">
          <p>
            📍 <strong>Pje. Los Almanaces, S.J.L. – Lima</strong>
          </p>
          <p>📞 +51 981 480 343</p>
          <p>📧 consultorajasesoriajb@gmail.com</p>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/20 mt-8 pt-4 text-xs text-gray-400 text-center md:text-left">
          © {new Date().getFullYear()} Consultora de Asesoría Empresarial JB —{" "}
          Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
