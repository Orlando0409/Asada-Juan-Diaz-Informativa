import { IoChevronDown, IoChevronUp, IoBookOutline } from "react-icons/io5";

type Props = {
  descripcion: string;        
  mostrarTodo: boolean;       
  onToggle: () => void;        
};

const CHAR_LIMIT = 100;
const WORD_LIMIT = 5;

function BotonLeerMas({ descripcion, mostrarTodo, onToggle }: Readonly<Props>) {
  // proteger contra undefined/null
  const safeDescripcion = (descripcion ?? '').toString();
  const palabras = safeDescripcion.trim().split(/\s+/).filter(Boolean);

  const necesitaTruncar = palabras.length > WORD_LIMIT || safeDescripcion.length > CHAR_LIMIT;

  const textoCorto = safeDescripcion.length > CHAR_LIMIT
    ? safeDescripcion.slice(0, CHAR_LIMIT).trimEnd()
    : palabras.slice(0, WORD_LIMIT).join(" ");
  const textoTruncado = necesitaTruncar ? textoCorto + "..." : safeDescripcion;

  return (
    <div className="space-y-3">
      {/* Texto de la descripción */}
      <div className="relative">
        <p className="text-gray-700 leading-relaxed transition-all duration-300 text-sm break-words">
          {mostrarTodo ? safeDescripcion : textoTruncado}
        </p>

        {/* Fade para el texto truncado */}
        {!mostrarTodo && necesitaTruncar && (
          <div className="absolute bottom-0 right-0 w-12 h-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Botón mejorado */}
      {necesitaTruncar && (
        <div className="flex items-center justify-between">
          {/* Línea decorativa */}
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent mr-3"></div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`
              group flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${mostrarTodo
                ? 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500 border border-red-200 hover:border-red-300'
                : 'bg-sky-50 text-blue-600 hover:bg-sky-100 focus:ring-blue-500 border border-sky-200 hover:border-sky-300'
              }
              hover:shadow-md active:scale-95
            `}
          >
            {/* Ícono del libro */}
            <IoBookOutline className={`w-4 h-4 transition-transform duration-300 ${
              mostrarTodo ? 'rotate-180' : 'rotate-0'
            }`} />
            
            {/* Texto del botón */}
            <span className="select-none">
              {mostrarTodo ? "Leer menos" : "Leer más"}
            </span>
            
            {/* Ícono de chevron */}
            <div className="transition-transform duration-300 group-hover:translate-y-0.5">
              {mostrarTodo ? (
                <IoChevronUp className="w-4 h-4" />
              ) : (
                <IoChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>
          
          {/* Línea decorativa */}
          <div className="flex-1 h-px bg-gradient-to-l from-gray-200 to-transparent ml-3"></div>
        </div>
      )}


    </div>
  );
}

export default BotonLeerMas;