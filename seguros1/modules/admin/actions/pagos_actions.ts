import { api } from '@/api/axiosInstance';
import {
  CreatePagoResponse,
  DeletePagoResponse,
  RespuestaPagos,
  RespuestaPagoSimple,
  UpdatePagoResponse,
} from '../interfaces/pagos_interface';

/**
 * Obtiene todos los pagos de un plan de pago específico
 * @param id_plan ID del plan de pago
 * @returns Lista de pagos asociados al plan
 */
export const getPagosAction = async (id_plan: string) => {
  try {
    const { data } = await api.get<RespuestaPagos>(`/pagos/?id_plan=${id_plan}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los pagos');
  }
};

/**
 * Obtiene un pago específico por su ID
 * @param id_pago ID del pago a consultar
 * @returns Datos del pago consultado
 */
export const getPagoAction = async (id_pago: string) => {
  try {
    const { data } = await api.get<RespuestaPagoSimple>(`/pagos/${id_pago}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener el pago específico');
  }
};

/**
 * Crea un nuevo registro de pago
 * @param formData Formulario con datos del pago incluyendo posible archivo de comprobante
 * @returns Respuesta de la creación del pago
 */
export const createPagoAction = async (formData: FormData) => {
  try {
    // Verificar que id_plan esté presente y sea un UUID válido
    const idPlan = formData.get('id_plan');

    if (!idPlan) {
      console.error('Error: No se incluyó id_plan en el FormData');
      return {
        ok: false,
        message: 'Error: Falta el ID del plan',
        data: null,
      };
    }

    // Crear un nuevo FormData con valores explícitos para mayor control
    const cleanFormData = new FormData();

    for (const [key, value] of formData.entries()) {
      if (key === 'id_plan') {
        // Asegurar que el id_plan sea un string limpio
        const cleanId = String(value).trim();
        cleanFormData.append('id_plan', cleanId);
      } else if (key === 'abono') {
        // Asegurar que el abono sea un string numérico
        cleanFormData.append('abono', String(value));
      } else {
        cleanFormData.append(key, value);
      }
    }

    const { data } = await api.post<CreatePagoResponse>('/pagos/', cleanFormData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Necesario para adjuntar archivos
      },
    });

    if (data.ok) {
      return data;
    } else {
      return {
        ok: false,
        message: 'Error al registrar el pago',
        data: data.data,
      };
    }
  } catch (error) {
    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${typeof value === 'object' ? '[objeto File]' : value}`);
    }
    console.log('error', error);
    throw error;
  }
};

/**
 * Actualiza un pago existente
 * @param id_pago ID del pago a actualizar
 * @param formData Formulario con los datos actualizados
 * @returns Respuesta de la actualización
 */
export const updatePagoAction = async (id_pago: string, formData: FormData) => {
  try {
    const { data } = await api.put<UpdatePagoResponse>(`/pagos/${id_pago}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Necesario para adjuntar archivos
      },
    });

    if (data.ok) {
      return data;
    } else {
      return {
        ok: false,
        message: 'Error al actualizar el pago',
        data: data.data,
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error al actualizar el pago');
  }
};

/**
 * Elimina (inactiva) un pago
 * @param id_pago ID del pago a eliminar
 * @returns Respuesta de la eliminación
 */
export const deletePagoAction = async (id_pago: string) => {
  try {
    const { data } = await api.patch<DeletePagoResponse>(`/pagos/${id_pago}`);

    if (data.ok) {
      return data;
    } else {
      return {
        ok: false,
        message: 'Error al eliminar el pago',
        cantidad: '0',
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error al eliminar el pago');
  }
};
