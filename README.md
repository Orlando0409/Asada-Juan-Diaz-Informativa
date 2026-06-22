# SAGA-JD · Frontend Informativo

Sitio público del **Sistema de Agua Potable de la ASADA de Juan Díaz** (SAGA-JD). Es la cara visible para los afiliados y el público general: muestra información institucional, novedades, calidad del agua, tarifas, proyectos, manuales y FAQs; permite enviar quejas, sugerencias y reportes; recibir solicitudes de afiliación / desconexión / cambio de medidor / asociado / agregar medidor (físicas y jurídicas); y ofrece la **consulta pública de pagos**.

Consume la API expuesta por `saga-jd-back-end`. El panel interno (`SAGA-JD-Administrativa`) procesa lo que aquí se origina.

---

## Stack principal

- **React 19** + **TypeScript** + **Vite**
- **TanStack Router** con rutas file-based (`src/routes` → `routeTree.gen.ts`)
- **TanStack Query** para datos
- **TanStack Table** para listados
- **TanStack Form** + **Zod** + **React Hook Form** para formularios validados
- **Tailwind CSS 4** + **@material-tailwind/react**
- **Framer Motion**, **Swiper**, **react-slick** para carruseles y transiciones
- **Leaflet** para mapas
- **Axios** con `withCredentials`
- **react-select**, **libphonenumber-js**, **lucide-react**, **react-icons**, **date-fns**
- Generación de sitemap (`@axelrindle/vite-plugin-sitemap`) activable con `ENABLE_SITEMAP=1`

---

## Estructura

```
src/
├── Components/          UI reutilizable (Header, Footer, Alert, ChatAssistant, FormularioContacto, Solicitudes, Proyecto, LoadingSpinner)
├── Section/             Páginas o bloques grandes
│   ├── Landing/         Página principal
│   ├── DatosGenerales/  Historia, misión, visión, calidad del agua, tarifas, manuales, FAQ
│   ├── Afiliacion/      Trámites de afiliación
│   ├── Solicitudes/     Trámites posteriores (desconexión, cambio de medidor, etc.)
│   ├── Consulta/        Consulta de pagos por medidor o cédula
│   └── DevTeam/         Créditos del equipo
├── Services/            Llamadas HTTP por dominio
├── Hook/                Hooks de TanStack Query
├── Schemas/             Esquemas Zod
├── models/ types/       Tipos compartidos
├── Provider/ context/   Providers globales (alertas, sesión pública si aplica)
├── routes/              Rutas file-based
├── layouts/             Layout público
├── utils/               Helpers (Chatbot, estado de facturas, mapas)
└── data/                Catálogos estáticos
```

---

## Funcionalidades clave

- **Landing institucional** con secciones animadas, carruseles y SEO.
- **Historia / Misión / Visión** y datos generales de la ASADA.
- **Tarifas vigentes** (con y sin sello de calidad).
- **Calidad del agua**: publicaciones técnicas accesibles al público.
- **Proyectos**: detalle e imágenes.
- **Manuales de usuario** descargables.
- **Preguntas frecuentes** (FAQ).
- **Galería de imágenes**.
- **Formulario unificado de contacto** (queja / sugerencia / reporte) con adjuntos. Cada envío dispara una notificación en tiempo real al panel administrativo.
- **Solicitudes en línea** físicas y jurídicas:
  - Afiliación
  - Desconexión
  - Cambio de medidor
  - Asociado (cambio de tipo)
  - Agregar medidor
  Con subida de planos, escrituras y certificación literal cuando aplica.
- **Consulta de pagos** por número de medidor, cédula física o cédula jurídica, con descarga de comprobante PDF generado por el backend.
- **Asistente / Chatbot** integrado para guiar al visitante.
- **Mapa** con la ubicación de la ASADA (Leaflet).

---

## Requisitos

- Node.js 20+
- pnpm 9+ o npm
- Backend (`saga-jd-back-end`) accesible.

---

## Setup

```bash
pnpm install
```

`.env` (mínimo):

```
VITE_API_URL=https://api.tu-dominio.cr/api
VITE_SITE_URL=https://www.tu-dominio.cr
```

---

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo Vite |
| `pnpm build` | Type-check + build a `dist/` |
| `pnpm build:sitemap` | Build incluyendo sitemap (activa `ENABLE_SITEMAP=1`) |
| `pnpm preview` | Previsualiza el build |
| `pnpm lint` | ESLint |
| `pnpm doctor` | Diagnóstico con `react-doctor` |

---

## Convenciones

- **Rutas**: file-based en `src/routes`. No se edita `routeTree.gen.ts` a mano.
- **Estilos**: Tailwind 4 con utilidades responsive. Componentes de `@material-tailwind/react` usados como base para inputs/buttons.
- **Validación**: Zod del lado del cliente y validaciones equivalentes en el backend.
- **Adjuntos**: los formularios envían `multipart/form-data`; el backend los almacena en Dropbox.
- **Privacidad**: la consulta de pagos no expone datos sensibles más allá de los necesarios para identificar al afiliado.
- **Cookies**: el sitio público no requiere sesión salvo flujos puntuales; las llamadas no necesitan `withCredentials` excepto en endpoints autenticados.

---

## Despliegue

Pensado para despliegue estático con `dist/`:

- **Vercel**: configurado vía `vercel.json` (fallback SPA, headers, rewrites).
- **Cloudflare Pages / Workers**: configurado vía `wrangler.json`.
- También sirve cualquier CDN con SPA fallback (`index.html`).

Recuerda apuntar `VITE_API_URL` al backend público y configurar el sitemap antes de publicar.
