export interface Respuesta {
  message: string;
  totalRegistros: number;
  data: Usuario[];
}

export interface Usuario {
  id_usuario: string;
  correo: string;
  nombre: string;
  foto: string | File;
  rol: string;
  id_correduria: string;
}
