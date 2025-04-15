import { api } from '@/api/axiosInstance';
import type { AuthResponse } from '../interfaces';
import { isAxiosError } from 'axios';

export interface LoginError {
  ok: boolean;
  message: string;
}

export interface LoginSuccess {
  ok: boolean;
  accessToken: string;
  refreshToken: string;
  nombre: string;
  correo: string;
  foto: string;
  id_correduria: string;
}

export const loginAction = async (
  email: string,
  password: string,
): Promise<LoginError | LoginSuccess> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login/', {
      correo: email,
      password,
    });

    return {
      ok: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      nombre: data.nombre,
      correo: data.correo,
      foto: data.foto,
      id_correduria: data.id_correduria,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        ok: false,
        message: 'Credenciales incorrectas',
      };
    }
    console.error(error);
    throw new Error('Error al intentar hacer login');
  }
};
