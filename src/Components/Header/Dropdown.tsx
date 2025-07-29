import { Link } from '@tanstack/react-router'
import { MdExpandMore } from 'react-icons/md'

interface DropdownProps {
  texto: string
  subopciones: Array<{
    texto: string
    ruta: string
  }>
}

const Dropdown = ({ texto, subopciones }: DropdownProps) => {
  return (
    <li className='relative group'>
      <button className='flex items-center gap-1 hover:text-[#6FCAF1] transition-colors duration-200'>
        {texto}
        <MdExpandMore size={18} className='transition-transform duration-200 group-hover:rotate-180' />
      </button>
      <div className='absolute left-0 hidden group-hover:block bg-white shadow-lg rounded-md mt-2 z-50 w-48 border border-gray-100'>
        <ul className='py-2 text-sm text-gray-700'>
          {subopciones.map((opcion, index) => (
            <li key={index}>
              <Link 
                to={opcion.ruta} 
                className='block px-4 py-2 hover:bg-[#6FCAF1]/10 hover:text-[#6FCAF1] transition-all duration-200 hover:scale-105 hover:px-5 hover:font-medium'
              >
                {opcion.texto}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default Dropdown