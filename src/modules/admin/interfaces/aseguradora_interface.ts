import type { Database } from '@/lib/supabase';

export type Aseguradora = Database['public']['Tables']['aseguradoras']['Row'] & {
  logo: string | File;
};

export interface Respuesta {
  message: string;
  totalRegistros: number;
  data: Aseguradora[];
}

export interface DeleteResponse {
  ok: boolean;
  message: string;
  cantidad: string;
}

export interface RespuestaSimple {
  message: string;
  data: Aseguradora;
}

export interface CreateAseguradoraResponse {
  ok: boolean;
  message: string;
  data: Aseguradora;
}
