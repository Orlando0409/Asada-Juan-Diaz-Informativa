import Data from "../../data/Data.json";
import { useImagenesPublic } from "../../Hook/Historia/hookHistoria";

const Historia = () => {
  const historia = Data.historia;
  const { data: imagenes, isLoading, isError } = useImagenesPublic();

  return (
    <section className="w-screen bg-gray-200 text-black px-6 py-10 sm:px-10 lg:px-20 lg:py-10 flex flex-col gap-10">
      {/* Título y texto */}
      <div className="flex flex-col gap-4 text-center lg:text-left">
        <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-sky-800">
          Historia de la ASADA de Juan Díaz
        </h3>
        <blockquote className="border-l-4 border-[#6FCAF1] pl-4 p-4 text-base sm:text-lg lg:text-xl italic bg-white rounded-md shadow-sm">
          {historia}
        </blockquote>
      </div>

      {/* Sección de imágenes */}
      <div className="w-full flex flex-col items-center">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">
          Imágenes representativas
        </h4>

        {isLoading && (
          <p className="text-gray-500 text-sm">Cargando imágenes...</p>
        )}

        {isError && (
          <p className="text-red-500 text-sm">
            Ocurrió un error al cargar las imágenes.
          </p>
        )}

        {imagenes && imagenes.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {imagenes.map((img) => (
              <div
                key={img.Id_Imagen}
                className="break-inside-avoid mb-4 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-transform transform hover:scale-[1.02] overflow-hidden"
              >
                <img
                  src={img.Imagen}
                  className="w-full h-auto object-cover rounded-t-xl"
                />

              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <p className="text-gray-500 text-sm">
              No hay imágenes disponibles actualmente.
            </p>
          )
        )}
      </div>
    </section>
  );
};

export default Historia;
