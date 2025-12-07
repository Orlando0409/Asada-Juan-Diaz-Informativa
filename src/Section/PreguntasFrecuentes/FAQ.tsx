import React, { useState } from "react";
import { motion } from "framer-motion";
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">
          Cargando preguntas frecuentes...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
        <p className="text-red-600 text-lg font-semibold">
          Error al cargar las preguntas frecuentes. <br />
          Por favor, inténtalo de nuevo más tarde.
        </p>
      </div>
    );

  if (!faqs?.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <p className="text-gray-600 text-lg">
          No hay preguntas frecuentes disponibles por el momento.
        </p>
      </div>
    );

  return (
    <section
      aria-label="Preguntas frecuentes"
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-600">
            Aquí encontrarás respuestas a las preguntas más comunes.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
        >
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.id ?? idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.4,
                    ease: "easeOut"
                  }
                }
              }}
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
                className={`px-6 py-4 text-lg font-semibold border border-transparent transition-all duration-300 ${
                  open === idx
                    ? "text-blue-700 bg-blue-50 rounded-t-2xl"
                    : "text-gray-900 hover:bg-gray-50 border-b-0 rounded-2xl"
                }`}
              >
                {faq.Pregunta}
              </MTAccordionHeader>

              <MTAccordionBody className="px-6 pb-5 text-base text-gray-700 bg-white rounded-b-2xl transition-all duration-300 ease-in-out">
                <p className="mt-2 border-t pt-4 border-gray-100 leading-relaxed">
                  {faq.Respuesta}
                </p>
              </MTAccordionBody>
            </MTAccordion>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
