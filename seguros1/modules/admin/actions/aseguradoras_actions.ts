import { api } from '@/api/axiosInstance';
import type {
  Aseguradora,
  CreateAseguradoraResponse,
  DeleteResponse,
  Respuesta,
  RespuestaSimple,
} from '../interfaces/aseguradora_interface';

export const getAseguradorasAction = async (id_correduria: string) => {
  try {
    const { data } = await api.get<Respuesta>(`/aseguradoras/?id_correduria=${id_correduria}`);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting aseguradoras');
  }
};

export const getAseguradoraAction = async (id_aseguradora: string) => {
  try {
    const { data } = await api.get<RespuestaSimple>(`/aseguradoras/${id_aseguradora}`);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting specific aseguradora');
  }
};

export const createAseguradoraAction = async (aseguradora: Partial<Aseguradora>) => {
  try {
    const formData = new FormData();
    formData.append('id_correduria', aseguradora.id_correduria ?? '');
    formData.append('nombre', aseguradora.nombre ?? '');
    formData.append('descripcion', aseguradora.descripcion ?? '');
    formData.append('nombre_gestor', aseguradora.nombre_gestor ?? '');
    formData.append('tel_gestor', aseguradora.tel_gestor ?? '');
    formData.append('correo_gestor', aseguradora.correo_gestor ?? '');

    if (aseguradora.logo instanceof File) {
      formData.append('logo', aseguradora.logo); // Solo si es un archivo
    }

    const { data } = await api.post<CreateAseguradoraResponse>(`/aseguradoras/`, formData, {
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
    throw new Error('Error creando aseguradora');
  }
};

export const updateAseguradoraAction = async (formData: FormData) => {
  const idAseguradora = formData.get('id_aseguradora');
  try {
    const { data } = await api.put<CreateAseguradoraResponse>(
      `/aseguradoras/${idAseguradora}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', //Necesaria para adjuntar archivos
        },
      },
    );

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
    throw new Error('Error actualizando aseguradora');
  }
};

export const deleteAseguradoraAction = async (idAseguradora: string) => {
  try {
    const { data } = await api.patch<DeleteResponse>(`/aseguradoras/${idAseguradora}`);

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
    throw new Error('Error borrando aseguradora');
  }
};
