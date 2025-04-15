import { api } from '@/api/axiosInstance';
import type { CheckStatusResponse } from '../interfaces';
import { isAxiosError } from 'axios';

interface CheckError {
  ok: boolean;
}

interface CheckSuccess {
  ok: boolean;
  id_usuario: string;
}

export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {
    const localAccessToken = localStorage.getItem('accessToken');
    if ((localAccessToken && localAccessToken.length === 0) || !localAccessToken) {
      return {
        ok: false,
      };
    }

    const { data } = await api.get<CheckStatusResponse>('/auth/check-auth');

    return {
      ok: data.ok,
      id_usuario: data.id_usuario,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      };
    }

    throw new Error('Error al comprobar la autenticación');
  }
};
