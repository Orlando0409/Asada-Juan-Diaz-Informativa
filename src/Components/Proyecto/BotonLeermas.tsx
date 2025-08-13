import React from "react";


type Props = {
  descripcion: string;        
  mostrarTodo: boolean;       
  onToggle: () => void;        
};

function BotonLeerMas({ descripcion, mostrarTodo, onToggle }: Props) {

  const palabras = descripcion.trim().split(" ");
  const textoCorto = palabras.slice(0, 5).join(" ");

  return (
    <div>
     
      <p className="text-gray-600 text-sm">
        {mostrarTodo
          ? descripcion
          : textoCorto + (palabras.length > 5 ? "..." : "")}
      </p>


      {palabras.length > 5 && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evita que Swiper interrumpa el clic
            onToggle();
          }}
          className="text-blue-500 text-sm mt-1 hover:underline focus:outline-none"
        >
          {mostrarTodo ? "Leer menos" : "Leer más"}
        </button>
      )}
    </div>
  );
}

export default BotonLeerMas;
