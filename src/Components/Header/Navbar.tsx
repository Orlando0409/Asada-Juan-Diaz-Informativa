import { redirect } from '@tanstack/react-router'
import Data from '../../data/Data.json'

const Navbar = () => {
  return (
    <nav>
      <ul>
        {Object.entries(Data.header.navbar).map(([key, value]) => {
          if (typeof value === 'string') {
            return (
              <li key={key}>
                <a href={value}>{key}</a>
              </li>
            )
          } else if (typeof value === 'object') {
            return (
              <li key={key}>
                {key}
                <ul>
                  {value && Object.entries(value).map(([subKey, subValue]) => (
                    <li key={subKey}>
                      <a href={subValue}>{subKey}</a>
                    </li>
                  ))}
                </ul>
              </li>
            )
          }
          return null
        })}
      </ul>
      <button onClick={() => redirect({ to: Data.header.IncioSesion.Ruta })}>{Data.header.IncioSesion.Texto}</button>
    </nav>
  )
}

export default Navbar