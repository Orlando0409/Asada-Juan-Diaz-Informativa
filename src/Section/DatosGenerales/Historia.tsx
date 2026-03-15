import { motion, type Variants } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { MdWaterDrop } from 'react-icons/md';
import Data from '../../data/Data.json';
import { useImagenesPublic } from '../../Hook/Historia/hookHistoria';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stats = [
  { icon: FiMapPin,    label: 'Ubicación',    value: 'Juan Díaz, Guanacaste' },
  { icon: MdWaterDrop, label: 'Servicio',      value: 'Agua potable comunitaria' },
  { icon: FiUsers,     label: 'Comunidades',   value: 'Juan Díaz y Oriente' },
];

const Historia = () => {
  const historia = Data.historia;
  const imagenFeatured = `/${Data.imagenHistoria.src}`;
  const { data: imagenes, isLoading, isError } = useImagenesPublic();

  return (
    <div className="w-full flex flex-col">

      {/* ── Hero strip ── */}
      <section className="w-full bg-sky-50 border-b border-sky-100 px-6 py-16 sm:px-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto"
        >
          
          <h1 className="pt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Historia de la{' '}
            <span className="text-blue-600">ASADA de Juan Díaz</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl">
            La historia de una comunidad que priorizó el acceso al agua potable sobre cualquier otra iniciativa.
          </p>
          <div className="h-1 w-14 bg-blue-600 rounded-full" />
        </motion.div>
      </section>

      {/* ── Narrativa + imagen destacada ── */}
      <section className="w-full bg-white px-6 py-14 sm:px-10 lg:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start"
        >
          {/* Texto */}
          <motion.div variants={itemVariants} className="flex-1 relative">
            {/* Comilla decorativa */}
            <span className="absolute -top-6 -left-2 text-9xl text-sky-100 font-serif leading-none select-none pointer-events-none" aria-hidden="true">
              "
            </span>
            <div className="relative z-10 border-l-4 border-sky-400 pl-6 py-2">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {historia}
              </p>
            </div>
          </motion.div>

          {/* Imagen destacada */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-80 xl:w-96 flex-shrink-0 rounded-2xl overflow-hidden border border-sky-100 shadow-md"
          >
            <img
              src={imagenFeatured}
              alt="ASADA de Juan Díaz — imagen histórica"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Franja de datos clave ── */}
      <section className="w-full bg-sky-50 border-y border-sky-100 px-6 py-10 sm:px-10 lg:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={containerVariants}
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="flex flex-col items-center text-center gap-2 bg-white rounded-xl border border-sky-100 shadow-sm px-6 py-5"
            >
              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-base font-semibold text-gray-800">{value}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Galería de imágenes ── */}
      <section className="w-full bg-white px-6 py-14 sm:px-10 lg:px-20 flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            Imágenes representativas
          </h2>
          <div className="h-0.5 w-10 bg-sky-400 rounded-full mx-auto mt-2" />
        </motion.div>

        {/* Skeleton de carga */}
        {isLoading && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid mb-4 bg-sky-50 border border-sky-100 rounded-xl animate-pulse"
                style={{ height: `${120 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-red-500 text-sm">Ocurrió un error al cargar las imágenes.</p>
        )}

        {imagenes && imagenes.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={containerVariants}
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 w-full"
          >
            {imagenes.map((img) => (
              <motion.div
                key={img.Id_Imagen}
                variants={itemVariants}
                className="break-inside-avoid mb-4 bg-white border border-sky-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <img
                  src={img.Imagen}
                  alt={img.Nombre_Imagen}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          !isLoading && !isError && (
            <p className="text-gray-500 text-sm">No hay imágenes disponibles actualmente.</p>
          )
        )}
      </section>

    </div>
  );
};

export default Historia;
