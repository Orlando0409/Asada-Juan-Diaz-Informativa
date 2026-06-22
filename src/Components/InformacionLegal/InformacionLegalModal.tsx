import { useInformacionLegal } from '../../context/InformacionLegalContext'
import InformacionLegalData from '../../data/InformacionLegal.json'

interface Seccion {
    titulo: string
    contenido: string
}

interface InformacionLegalContent {
    titulo: string
    politicaPrivacidad: {
        introduccion: string
        secciones: Seccion[]
    }
    terminosCondiciones: {
        introduccion: string
        secciones: Seccion[]
    }
}

const InformacionLegalModal = () => {
    const { isOpen, activeTab, closeModal } = useInformacionLegal()
    const data = InformacionLegalData as InformacionLegalContent

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-h-[90vh] w-full max-w-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        {activeTab === 'privacidad' ? 'Política de Privacidad' : 'Términos y Condiciones'}
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {activeTab === 'privacidad' && (
                        <div className="space-y-6">
                            <p className="text-gray-700 leading-relaxed">
                                {data.politicaPrivacidad.introduccion}
                            </p>
                            <div className="space-y-4">
                                {data.politicaPrivacidad.secciones.map((seccion, index) => (
                                    <div key={index}>
                                        <h3 className="font-semibold text-blue-600 mb-2">{seccion.titulo}</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">{seccion.contenido}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'terminos' && (
                        <div className="space-y-6">
                            <p className="text-gray-700 leading-relaxed">
                                {data.terminosCondiciones.introduccion}
                            </p>
                            <div className="space-y-4">
                                {data.terminosCondiciones.secciones.map((seccion, index) => (
                                    <div key={index}>
                                        <h3 className="font-semibold text-blue-600 mb-2">{seccion.titulo}</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">{seccion.contenido}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                        onClick={closeModal}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InformacionLegalModal
