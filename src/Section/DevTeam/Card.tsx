import { useState } from "react";
import { FiMail, FiLinkedin, FiGithub, FiUser } from "react-icons/fi";
import type { Miembro } from "../../types/Devteam";

export const  MemberCard = ({ miembro, index }: { miembro: Miembro; index: number }) => {
  const [imgError, setImgError] = useState(false)
  const nombreCompleto = `${miembro.nombre} ${miembro.apellido1} ${miembro.apellido2}`.trim()

  const redes = [
    miembro.contacto.correo && {
      href: `mailto:${miembro.contacto.correo.trim()}`,
      icon: FiMail,
      label: `Correo de ${nombreCompleto}`,
    },
    miembro.contacto.linkedin && {
      href: miembro.contacto.linkedin.trim(),
      icon: FiLinkedin,
      label: `LinkedIn de ${nombreCompleto}`,
    },
    miembro.contacto.github && {
      href: miembro.contacto.github.trim(),
      icon: FiGithub,
      label: `GitHub de ${nombreCompleto}`,
    },
  ].filter(Boolean) as { href: string; icon: typeof FiMail; label: string }[]

  return (
    <article
      className="group relative bg-white rounded-2xl border border-sky-200 shadow-md p-6
                 flex flex-col items-center text-center overflow-hidden
                 animate-rise-in transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-400"
      style={{ animationDelay: `${80 + index * 60}ms` }}
    >
      <div className="mt-2 size-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-4 ring-blue-50 overflow-hidden transition-transform duration-300 group-hover:scale-105">
        {imgError ? (
          <FiUser className="text-white size-10" />
        ) : (
          <img
            src={miembro.imagen}
            alt={nombreCompleto}
            loading="lazy"
            onError={() => setImgError(true)}
            className="size-full rounded-full object-cover"
          />
        )}
      </div>

      <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1
                       text-[11px] font-semibold uppercase tracking-wider text-blue-700">
        {miembro.rol}
      </span>

      <p className="mt-2 font-bold text-gray-800 text-sm sm:text-base leading-snug">
        {nombreCompleto}
      </p>

      {redes.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {redes.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-600
                         transition-colors duration-200 hover:bg-blue-600 hover:text-white"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      )}
    </article>
  )
}