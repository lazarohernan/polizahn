export interface Filter {
  status: string[];
  date: string;
  aseguradora: string;
  tipo_seguro: string;
  [key: string]: unknown;
} 