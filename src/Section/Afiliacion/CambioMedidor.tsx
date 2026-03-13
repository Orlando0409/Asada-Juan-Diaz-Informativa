import { useState, useEffect } from "react"
import type { IconType } from "react-icons"
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi"
import data from "../../data/Data.json"
import CambioMedidorJuridica from "../../Components/Solicitudes/Juridica/CambioMedidorJuridica"
import CambioMedidorFisico from "../../Components/Solicitudes/Fisico/CambioMedidorFisico"
import { useModal } from "../../context/ModalContext"

type RequisitoCampo = {
  label: string
  required?: boolean
  type?: string
}

type TarjetaClienteProps = {
  badge: string
  title: string
  description: string
  buttonLabel: string
  requisitos: RequisitoCampo[]
  icon: IconType
  onOpen: () => void
  buttonClassName: string
  badgeClassName: string
  iconClassName: string
}

const TarjetaCliente = ({
  badge,
  title,
  description,
  buttonLabel,
  requisitos,
  icon: Icon,
  onOpen,
  buttonClassName,
  badgeClassName,
  iconClassName,
}: TarjetaClienteProps) => {
  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/90 p-3.5 shadow-[0_24px_55px_-34px_rgba(15,23,42,0.24)] backdrop-blur-sm sm:p-4 lg:p-5">
      <div className="absolute -right-12 top-6 h-24 w-24 rounded-full bg-sky-200/40 blur-2xl" />

      <div className="rounded-[20px] border border-sky-200/80 bg-sky-100 p-4 text-slate-800 shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pr-2">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${badgeClassName}`}>
              {badge}
            </span>
            <h2 className="mt-3 whitespace-nowrap text-[clamp(0.95rem,1.6vw,1.15rem)] font-semibold tracking-tight">{title}</h2>
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-200/80 ${iconClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 max-w-xl text-xs leading-6 text-slate-600 sm:text-sm">{description}</p>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 sm:text-xs">Lista de requisitos</h3>
        </div>

        <ul className="mt-3 flex max-h-[18rem] flex-col gap-2.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-sky-300 scrollbar-track-sky-100">
          {requisitos.map((requisito) => (
            <li
              key={requisito.label}
              className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2.5 shadow-sm shadow-slate-200/30"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <FiCheckCircle className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-5 text-slate-800">{requisito.label}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl ${buttonClassName}`}
        onClick={onOpen}
      >
        {buttonLabel}
        <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </article>
  )
}

const CambioMedidor = () => {
  const [mostrarFormularioFisico, setMostrarFormularioFisico] = useState(false)
  const [mostrarFormularioJuridico, setMostrarFormularioJuridico] = useState(false)
  const { setModalOpen } = useModal()

  useEffect(() => {
    setModalOpen(mostrarFormularioFisico || mostrarFormularioJuridico)
  }, [mostrarFormularioFisico, mostrarFormularioJuridico, setModalOpen])

  const requisitosFisicos = Object.values(
    data.requisitosSolicitudes.cambioMedidor ?? {},
  ) as RequisitoCampo[]
  const requisitosJuridicos = Object.values(
    data.juridica?.cambioMedidor ?? {},
  ) as RequisitoCampo[]


  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fcff_0%,#eef7fb_48%,#f7fbfa_100%)] px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.32)] backdrop-blur-sm">
          <div className="bg-slate-50/80 p-5 sm:p-6 lg:p-8">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Solicitud de cambio de medidor
            </span>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.9rem]">Cambio de medidor</h2>
                <p className="mt-2 text-sm text-slate-600">Si necesitas cambiar tu medidor por daño o mal funcionamiento, selecciona tu tipo de cliente y completa el formulario.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <TarjetaCliente
                badge="Cliente jurídico"
                title="Cambio de medidor para empresas"
                description=""
                buttonLabel="Llenar formulario jurídico"
                requisitos={requisitosJuridicos}
                icon={FiBriefcase}
                onOpen={() => setMostrarFormularioJuridico(true)}
                buttonClassName="bg-sky-500 hover:bg-sky-600"
                badgeClassName="bg-sky-200 text-sky-800 ring-1 ring-inset ring-sky-300"
                iconClassName="text-sky-700"
              />

              <TarjetaCliente
                badge="Cliente físico"
                title="Cambio de medidor para personas"
                description=""
                buttonLabel="Llenar formulario físico"
                requisitos={requisitosFisicos}
                icon={FiUser}
                onOpen={() => setMostrarFormularioFisico(true)}
                buttonClassName="bg-sky-500 hover:bg-sky-600"
                badgeClassName="bg-sky-200 text-sky-800 ring-1 ring-inset ring-sky-300"
                iconClassName="text-sky-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Formulario Jurídico */}
      {mostrarFormularioJuridico && (
        <div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setMostrarFormularioJuridico(false)}
        >
          <div className="flex h-full items-start justify-center px-6 pt-16 pb-8 sm:pt-20">
            <div
              className="scrollbar-hide relative max-h-[calc(100vh-7rem)] w-[76dvw] max-w-xl sm:w-[68%] md:w-[50%] lg:w-[40%] xl:w-[38%] overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <CambioMedidorJuridica onClose={() => setMostrarFormularioJuridico(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulario Físico */}
      {mostrarFormularioFisico && (
        <div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setMostrarFormularioFisico(false)}
        >
          <div className="flex h-full items-start justify-center px-6 pt-16 pb-8 sm:pt-20">
            <div
              className="scrollbar-hide relative max-h-[calc(100vh-7rem)] w-[76dvw] max-w-xl sm:w-[68%] md:w-[50%] lg:w-[40%] xl:w-[38%] overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <CambioMedidorFisico onClose={() => setMostrarFormularioFisico(false)} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
export default CambioMedidor