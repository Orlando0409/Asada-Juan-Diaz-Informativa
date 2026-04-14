import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { MdExpandMore } from "react-icons/md";
import { useFAQ } from "../../Hook/HookFAQ";

const MTAccordion = Accordion as any;
const MTAccordionHeader = AccordionHeader as any;
const MTAccordionBody = AccordionBody as any;

const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const { data: faqs, isLoading, isError } = useFAQ();

  const handleOpen = (value: number) => {
    setOpen(open === value ? null : value);
  };

  const Icon = ({ id, open }: { id: number; open: number | null }) => (
    <MdExpandMore
      className={`transform transition-transform duration-300 ${
        id === open ? "rotate-180 text-blue-600" : "text-gray-500"
      }`}
      size={24}
    />
  );

  if (isLoading)
    return (
      <section
        id="FAQ"
        aria-label="Preguntas frecuentes"
        className="flex flex-col items-center justify-center min-h-screen bg-white"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">
          Cargando preguntas frecuentes...
        </p>
      </section>
    );

  if (isError)
    return (
      <section
        id="FAQ"
        aria-label="Preguntas frecuentes"
        className="flex flex-col items-center justify-center min-h-screen bg-white"
      >
        <p className="text-red-600 text-lg font-semibold">
          Error al cargar las preguntas frecuentes. <br />
          Por favor, inténtalo de nuevo más tarde.
        </p>
      </section>
    );

  if (!faqs?.length)
    return (
      <section
        id="FAQ"
        aria-label="Preguntas frecuentes"
        className="flex flex-col items-center justify-center min-h-screen bg-white"
      >
        <p className="text-gray-600 text-lg">
          No hay preguntas frecuentes disponibles por el momento.
        </p>
      </section>
    );

  return (
    <section
      id="FAQ"
      aria-label="Preguntas frecuentes"
      className="bg-white py-12 px-4 sm:px-6 lg:px-8 scroll-mt-[95px]"
    >
      <div className="py-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fade-rise">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-600">
            Aquí encontrarás respuestas a las preguntas más comunes.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id ?? idx}
              className="animate-fade-rise"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <MTAccordion
              key={faq.id ?? idx}
              open={open === idx}
              icon={<Icon id={idx} open={open} />}
              className={`rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300 ${
                open === idx ? "border border-blue-200" : "border border-transparent"
              }`}
            >
              <MTAccordionHeader
                onClick={() => handleOpen(idx)}
                className={`px-6 py-4 text-base sm:text-lg font-semibold border border-transparent transition-all duration-300 break-words ${
                  open === idx
                    ? "text-blue-700 bg-blue-50 rounded-t-2xl"
                    : "text-gray-900 hover:bg-gray-50 border-b-0 rounded-2xl"
                }`}
              >
                <span className="break-words">{faq.Pregunta}</span>
              </MTAccordionHeader>

              <MTAccordionBody className="px-6 pb-5 text-base text-gray-700 bg-white rounded-b-2xl transition-all duration-300 ease-in-out">
                <p className="mt-2 border-t pt-4 border-gray-100 leading-relaxed break-words">
                  {faq.Respuesta}
                </p>
              </MTAccordionBody>
            </MTAccordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
