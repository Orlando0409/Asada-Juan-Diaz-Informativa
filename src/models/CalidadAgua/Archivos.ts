export interface EstadoCalidadAgua {
    Id_Estado_Calidad_Agua: number;
    Nombre_Estado_Calidad_Agua: string;
}

export interface CalidadAguaArchivos {
    Id_Calidad_Agua: number;
    Titulo: string;
    Url_Archivo: string;
    Fecha_Creacion: string;
    Fecha_Actualizacion: string;
    Estado: EstadoCalidadAgua;
}

export const CalidadAguaArchivosinitializedState = {
    Id_Calidad_Agua: 0,
    Titulo: '',
    Url_Archivo: '',
    Fecha_Creacion: '',
    Fecha_Actualizacion: '',
    Estado: {
        Id_Estado_Calidad_Agua: 0,
        Nombre_Estado_Calidad_Agua: ''
    }
}
