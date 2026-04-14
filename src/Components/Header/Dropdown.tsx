import { Link } from '@tanstack/react-router'
import type { DropdownProps } from '../../types/header/MenuItem'


const Dropdown = ({ texto, Subopcion }: DropdownProps) => {
  return (
    <li className='relative group'>
      <button className='flex items-center gap-1 hover:text-[#6FCAF1] transition-colors duration-200'>
        {texto}
        <svg
          viewBox='0 0 24 24'
          className='h-[18px] w-[18px] transition-transform duration-200 group-hover:rotate-180'
          aria-hidden='true'
        >
          <path fill='currentColor' d='m7 10 5 5 5-5H7Z' />
        </svg>
      </button>
      <div className='absolute left-0 hidden group-hover:block bg-white shadow-lg rounded-md mt-2 z-10 w-48 border border-gray-100'>
        <ul className='py-2 text-sm text-gray-700'>
          {Subopcion.map((opcion) => (
            <li key={opcion.id}>
              <Link
                id={opcion.texto}
                to={opcion.ruta}
                className='block px-4 py-2 hover:bg-[6FCAF1]/10 hover:text-[#6FCAF1] transition-all duration-200 hover:scale-105 hover:px-5 hover:font-medium'
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