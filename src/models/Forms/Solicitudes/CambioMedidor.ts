
export interface CambioMedidor {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
   NumeroTelefono: string;
  MotivoSolicitud: string;

  Numero_Medidor_Anterior: number;
   Ubicacion: string; // <-- agregado
}

export const CambioMedidorInicialState= {
  Nombre: "",
  PrimerApellido: "",
  SegundoApellido: "",
  Cedula: "",
  CorreoElectronico: "",
  DireccionExacta: "",
   NumeroTelefono: "",
  MotivoSolicitud: "",

   Numero_Medidor_Anterior:0,
    Ubicacion: "" // <-- agregado
};
export interface CambioMedidorFormData {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  DireccionExacta: string;
  NumeroTelefono: string;
  MotivoSolicitud: string;
  CorreoElectronico: string;
   Numero_Medidor_Anterior: number;
   Ubicacion: string; // <-- agregado
}



// --- Interfaz backend ---
export interface CambioMedidorBackend {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
 
  Ubicacion: string;
  Numero_Medidor_Anterior: number;
  
}

// --- Función de mapeo frontend -> backend ---
export const mapFormToBackend = (form: CambioMedidorFormData): CambioMedidorBackend => ({
  Nombre: form.Nombre,
  Apellido1: form.PrimerApellido,
  Apellido2: form.SegundoApellido,
  Cedula: form.Cedula,
  Correo: form.CorreoElectronico,
  Direccion_Exacta: form.DireccionExacta,
  Numero_Telefono: form.NumeroTelefono,
  Motivo_Solicitud: form.MotivoSolicitud,

  Ubicacion: form.Ubicacion,
  Numero_Medidor_Anterior: form.Numero_Medidor_Anterior,
});