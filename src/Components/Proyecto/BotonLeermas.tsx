import { IoChevronDown, IoChevronUp, IoBookOutline } from "react-icons/io5";

type Props = {
  descripcion: string;        
  mostrarTodo: boolean;       
  onToggle: () => void;        
};

function BotonLeerMas({ descripcion, mostrarTodo, onToggle }: Readonly<Props>) {
  const palabras = descripcion.trim().split(" ");
  const textoCorto = palabras.slice(0, 5).join(" ");
  const textoTruncado = textoCorto + (palabras.length > 5 ? "..." : "");

  return (
    <div className="space-y-3">
      {/* Texto de la descripción */}
      <div className="relative">
        <p className="text-gray-700 leading-relaxed transition-all duration-300 text-sm">
          {mostrarTodo ? descripcion : textoTruncado}
        </p>
        
        {/* Gradiente de fade para el texto truncado */}
        {!mostrarTodo && palabras.length > 5 && (
          <div className="absolute bottom-0 right-0 w-12 h-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Botón mejorado */}
      {palabras.length > 5 && (
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
                ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 focus:ring-red-500 border border-red-200 hover:border-red-300' 
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 focus:ring-blue-500 border border-blue-200 hover:border-blue-300'
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