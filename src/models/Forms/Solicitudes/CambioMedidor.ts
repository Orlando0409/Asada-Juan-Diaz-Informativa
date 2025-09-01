
export interface CambioMedidor {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
  Numero_Medidor_Anterior: number;
}
export const CambioMedidorInicialState: CambioMedidor = {
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Cedula: "",
  Correo: "",
  Direccion_Exacta: "",
  Numero_Telefono: "",
  Motivo_Solicitud: "",
  Numero_Medidor_Anterior: 0
};
export interface CambioMedidorFormData {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
  Numero_Medidor_Anterior: number;
}




/*


// --- Interfaz backend ---
export interface  CambioMedidor{
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
export const mapFormToBackend = (form: CambioMedidorFormData):  CambioMedidor=> ({
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
});*/