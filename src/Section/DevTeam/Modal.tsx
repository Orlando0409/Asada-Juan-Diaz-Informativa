import { FiX } from 'react-icons/fi'
import Data from '../../data/Data.json'
import { MemberCard } from './Card'
import type { Miembro } from '../../types/Devteam'


interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const team = Object.values(Data.EquipoSeccion) as Miembro[]


const Modal = ({ isOpen, onClose }: ModalProps) => {


  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
      aria-modal="true"
      aria-label="Equipo de Desarrollo"
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden
                   rounded-2xl bg-sky-50 shadow-2xl animate-rise-in"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4
                        border-b border-sky-200 bg-white/95 backdrop-blur px-6 py-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-600">Equipo de Desarrollo</h3>
            <div className="mt-1 h-1 w-14 rounded-full bg-blue-600" />
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-9 items-center justify-center rounded-full text-gray-500
                       transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((miembro, index) => (
              <MemberCard key={index} miembro={miembro} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
