import { api } from '@/api/axiosInstance';
import {
  CreatePolizaResponse,
  DeleteResponse,
  Respuesta,
  RespuestaSimple,
} from '../interfaces/polizas_interface';

export const getPolizasAction = async (id_correduria: string) => {
  try {
    const { data } = await api.get<Respuesta>(`/polizas/?id_correduria=${id_correduria}`);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting pólizas');
  }
};

export const getPolizaAction = async (id_poliza: string) => {
  try {
    const { data } = await api.get<RespuestaSimple>(`/polizas/${id_poliza}`);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting specific póliza');
  }
};

export const createPolizaAction = async (formData: FormData) => {
  try {
    const { data } = await api.post<CreatePolizaResponse>(`/polizas/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', //Necesaria para adjuntar archivos
      },
    });

    if (data.ok) {
      return data;
    } else {
      return {
        ok: false,
        message: 'Error al agregar el registro',
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error creando póliza');
  }
};

export const updatePolizaAction = async (formData: FormData) => {
  //Obtener el id de la póliza
  const idPoliza = formData.get('id_poliza');
  try {
    const { data } = await api.put<CreatePolizaResponse>(`/polizas/${idPoliza}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', //Necesaria para adjuntar archivos
      },
    });

    if (data.ok) {
      return data;
    } else {
      return {
        ok: false,
        message: 'Error al actualizar el registro',
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error actualizando póliza');
  }
};

export const deletePolizaAction = async (idPoliza: string) => {
  try {
    const { data } = await api.patch<DeleteResponse>(`/polizas/${idPoliza}`);

    if (data.ok) {
      return data;
    } else {
      return {
        ok: false,
        message: 'Error al borrar el registro',
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error borrando póliza');
  }
};
