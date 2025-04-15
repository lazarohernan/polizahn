import { api } from '@/api/axiosInstance';
import { CreateClienteResponse, DeleteResponse, Respuesta } from '../interfaces/cliente_interface';

export const getClientesAction = async (id_correduria: string, pagina: number, limite: number) => {
  try {
    const { data } = await api.get<Respuesta>(
      `/clientes/?id_correduria=${id_correduria}&pagina=${pagina}&limite=${limite}`,
    );

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting pólizas');
  }
};

export const createClienteAction = async (formData: FormData) => {
  try {
    const { data } = await api.post<CreateClienteResponse>(`/clientes/`, formData, {
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

export const updateClienteAction = async (formData: FormData) => {
  const id_cliente = formData.get('id_cliente');
  try {
    const { data } = await api.put<CreateClienteResponse>(`/clientes/${id_cliente}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Necessary for file uploads
      },
    });

    if (data.ok) {
      return data;
    } else {
      return {
        ok: false,
        message: 'Error al actualizar el cliente',
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error actualizando cliente');
  }
};

export const deleteClienteAction = async (id_cliente: string) => {
  try {
    const { data } = await api.patch<DeleteResponse>(`/clientes/${id_cliente}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error eliminando cliente');
  }
};
