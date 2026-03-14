import { useState, useEffect } from "react"
import type { IconType } from "react-icons"
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiDroplet,
  FiFileText,
  FiHome,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi"
import data from "../../data/Data.json"
import FormularioAfiliacion from "../../Components/Solicitudes/Fisico/AfiliacionFisica"
import FormularioAfiliacionJuridico from "../../Components/Solicitudes/Juridica/AfiliacionJuridica"
import { useModal } from "../../context/ModalContext"

type RequisitoCampo = {
  label: string
  required?: boolean
  type?: string
}

type Beneficio = {
  icon: IconType
  title: string
  description: string
}

type BeneficioData = {
  icon: string
  title: string
  description: string
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

type FormView = "afiliacion" | "medidor-extra"

const iconMap: Record<string, IconType> = {
  droplet: FiDroplet,
  fileText: FiFileText,
  users: FiUsers,
  shield: FiShield,
  home: FiHome,
}

const beneficiosData = (data.AfiliacionSeccion?.beneficios ?? []) as BeneficioData[]

const beneficios: Beneficio[] = beneficiosData.map((beneficio) => ({
  ...beneficio,
  icon: iconMap[beneficio.icon] ?? FiDroplet,
}))

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

const InformacionAfiliacion = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarFormularioJuridico, setMostrarFormularioJuridico] = useState(false)
  const [vistaFormularioFisico, setVistaFormularioFisico] = useState<FormView>("afiliacion")
  const [vistaFormularioJuridico, setVistaFormularioJuridico] = useState<FormView>("afiliacion")
  const { setModalOpen } = useModal()

  const requisitosFisicos = Object.values(
    data.requisitosSolicitudes.abonado ?? {},
  ) as RequisitoCampo[]
  const requisitosJuridicos = Object.values(
    data.juridica?.afiliacion ?? {},
  ) as RequisitoCampo[]

  // Update modal state globally
  useEffect(() => {
    setModalOpen(mostrarFormulario || mostrarFormularioJuridico)
  }, [mostrarFormulario, mostrarFormularioJuridico, setModalOpen])

  useEffect(() => {
    const openMedidorExtraFromHash = () => {
      if (window.location.hash !== "#medidor-extra") {
        return
      }

      setVistaFormularioFisico("medidor-extra")
      setMostrarFormulario(true)
    }

    openMedidorExtraFromHash()
    window.addEventListener("hashchange", openMedidorExtraFromHash)

    return () => {
      window.removeEventListener("hashchange", openMedidorExtraFromHash)
    }
  }, [])

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fcff_0%,#eef7fb_48%,#f7fbfa_100%)] px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.32)] backdrop-blur-sm">
          <div className="bg-slate-50/80 p-5 sm:p-6 lg:p-8">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Solicitud de afiliación
            </span>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.9rem]">Beneficios como abonado</h2>

              </div>

            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {beneficios.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-[20px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-28px_rgba(14,116,144,0.32)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-sm shadow-sky-100/60">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-5 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <TarjetaCliente
                badge="Cliente jurídico"
                title="Afiliación para empresas y organizaciones"
                description=""
                buttonLabel="Llenar formulario jurídico"
                requisitos={requisitosJuridicos}
                icon={FiBriefcase}
                onOpen={() => {
                  setVistaFormularioJuridico("afiliacion")
                  setMostrarFormularioJuridico(true)
                }}
                buttonClassName="bg-sky-500 hover:bg-sky-600"
                badgeClassName="bg-sky-200 text-sky-800 ring-1 ring-inset ring-sky-300"
                iconClassName="text-sky-700"
              />

              <TarjetaCliente
                badge="Cliente físico"
                title="Afiliación para personas individuales"
                description=""
                buttonLabel="Llenar formulario físico"
                requisitos={requisitosFisicos}
                icon={FiUser}
                onOpen={() => {
                  setVistaFormularioFisico("afiliacion")
                  setMostrarFormulario(true)
                }}
                buttonClassName="bg-sky-500 hover:bg-sky-600"
                badgeClassName="bg-sky-200 text-sky-800 ring-1 ring-inset ring-sky-300"
                iconClassName="text-sky-700"
              />
            </div>
          </div>
        </div>
      </div>

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
              <FormularioAfiliacionJuridico
                initialView={vistaFormularioJuridico}
                onClose={() => setMostrarFormularioJuridico(false)}
              />
            </div>
          </div>
        </div>
      )}

      {mostrarFormulario && (
        <div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setMostrarFormulario(false)}
        >
          <div className="flex h-full items-start justify-center px-6 pt-16 pb-8 sm:pt-20">
            <div
              className="scrollbar-hide relative max-h-[calc(100vh-7rem)] w-[76dvw] max-w-xl sm:w-[68%] md:w-[50%] lg:w-[40%] xl:w-[38%] overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <FormularioAfiliacion
                initialView={vistaFormularioFisico}
                onClose={() => setMostrarFormulario(false)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default InformacionAfiliacion