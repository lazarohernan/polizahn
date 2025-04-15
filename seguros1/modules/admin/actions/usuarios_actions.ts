import { api } from '@/api/axiosInstance';
import { Respuesta } from '../interfaces/usuarios_interface';

export const getUsuariosPorCorreduriaAction = async (id_correduria: string) => {
  try {
    const { data } = await api.get<Respuesta>(
      `/auth/usuarios_correduria/?id_correduria=${id_correduria}`,
    );

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting Usuarios por Correduría');
  }
};
