import { useState } from "react";
import data from '../../data/Data.json';
import FormularioAsociadoJuridico from "../../Components/Solicitudes/Juridica/AsociadoJurica";
import FormularioAsociado from "../../Components/Solicitudes/Fisico/Asociado";

const Asociado = () => {
  const [mostrarFormularioFisico, setMostrarFormularioFisico] = useState(false);
  const [mostrarFormularioJuridico, setMostrarFormularioJuridico] = useState(false);

  const requisitosFisico = data.requisitosSolicitudes.asociado ?? {};
  // CORREGIDO: Acceso correcto a los requisitos jurídicos
  const requisitosJuridico = data.juridica?.asociado ?? {};

  return (
    <section className="min-h-screen w-full bg-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">

      {/* Información general */}
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Solicitud para Ser Asociado
        </h1>
        <p className="text-gray-700 text-lg">
          Ser Asociado en la ASADA es formar parte de la organización comunal.
          <br />
          Al ser Asociado no solo recibe el servicio de agua potable, sino que también tiene derecho a participar en la toma de decisiones.
        </p>
      </div>

      {/* Cards con requisitos */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">

        {/* Card Jurídico */}
        <div className="flex-1 bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Cliente Jurídico
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center italic">
            Para empresas, organizaciones o entidades legales
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 flex-1 overflow-auto max-h-64">
            {Object.entries(requisitosJuridico).map(([key, value]: any) => (
              <li key={key}>{value.label}</li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
            onClick={() => setMostrarFormularioJuridico(true)}
          >
            Llenar Formulario Jurídico
          </button>
        </div>

        {/* Card Físico */}
        <div className="flex-1 bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Cliente Físico
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center italic">
            Para personas individuales
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 flex-1 overflow-auto max-h-64">
            {Object.entries(requisitosFisico).map(([key, value]: any) => (
              <li key={key}>{value.label}</li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
            onClick={() => setMostrarFormularioFisico(true)}
          >
            Llenar Formulario Físico
          </button>
        </div>

      </div>

      {/* Modal Formulario Jurídico */}
      {mostrarFormularioJuridico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fondo borroso */}
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            onClick={() => setMostrarFormularioJuridico(false)}
          ></div>
          {/* Contenedor del formulario */}
          <div className="rounded relative w-[90%] max-w-5xl max-h-[550px] overflow-y-scroll [scroll-whit:none] [-ms-overflow-style:none]"
            style={{ scrollbarWidth: "none" }}>
            <FormularioAsociadoJuridico tipo="juridico" onClose={() => setMostrarFormularioJuridico(false)} />
          </div>
        </div>
      )}

      {/* Modal Formulario Físico */}
      {mostrarFormularioFisico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            onClick={() => setMostrarFormularioFisico(false)}
          ></div>
          <div className="rounded relative w-[90%] max-w-5xl max-h-[550px] overflow-y-scroll [scroll-whit:none] [-ms-overflow-style:none]"
            style={{ scrollbarWidth: "none" }}>
            <FormularioAsociado onClose={() => setMostrarFormularioFisico(false)} />
          </div>
        </div>
      )}

    </section>
  );
};

export default Asociado;