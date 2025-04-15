import { api } from '@/api/axiosInstance';
import type { AuthResponse } from '../interfaces';
import { isAxiosError } from 'axios';

interface RegisterError {
  ok: boolean;
  message: string;
}

interface RegisterSuccess {
  ok: boolean;
  accessToken: string;
  refreshToken: string;
}

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
): Promise<RegisterError | RegisterSuccess> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      fullName,
      email,
      password,
    });

    return {
      ok: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        message: 'Datos incorrectos o usuario ya registrado',
      };
    }
    console.error(error);
    throw new Error('Error while registration');
  }
};
