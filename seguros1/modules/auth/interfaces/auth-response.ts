export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  nombre: string;
  correo: string;
  foto: string;
  id_correduria: string;
}

export interface CheckStatusResponse {
  ok: boolean;
  id_usuario: string;
}
