<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl">
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
        <h2 class="text-2xl font-semibold text-text">
          Detalles de Cotización
        </h2>
        <button @click="$emit('close')" class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <XIcon class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6">
        <!-- Cabecera con información principal -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 class="text-xl font-medium text-text">#{{ cotizacion.numero_cotizacion }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Creada el {{ formatDate(cotizacion.fecha_creacion) }}
            </p>
          </div>
          
          <div class="flex items-center">
            <span 
              :class="getStatusClass(cotizacion.estado)"
              class="px-3 py-1 text-sm font-medium rounded-full"
            >
              {{ cotizacion.estado }}
            </span>
          </div>
        </div>
        
        <!-- Secciones de información -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Información del cliente -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-text border-b border-gray-200 dark:border-gray-700 pb-2">
              Información del Cliente
            </h4>
            
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                <p class="text-text">{{ cotizacion.nombre_cliente }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Correo Electrónico</p>
                <p class="text-text">{{ cotizacion.correo_cliente }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                <p class="text-text">{{ cotizacion.telefono_cliente }}</p>
              </div>
            </div>
          </div>
          
          <!-- Información de la póliza -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-text border-b border-gray-200 dark:border-gray-700 pb-2">
              Información del Seguro
            </h4>
            
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Tipo de Seguro</p>
                <p class="text-text">{{ cotizacion.tipo_seguro }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Aseguradora</p>
                <p class="text-text">{{ cotizacion.nombre_aseguradora }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
                <p class="text-text">{{ cotizacion.descripcion }}</p>
              </div>
            </div>
          </div>
          
          <!-- Información financiera -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-text border-b border-gray-200 dark:border-gray-700 pb-2">
              Información Financiera
            </h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Prima Total</p>
                <p class="text-text font-medium">{{ formatCurrency(cotizacion.prima_total) }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Prima Mensual</p>
                <p class="text-text font-medium">{{ formatCurrency(cotizacion.prima_mensual) }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Frecuencia de Pago</p>
                <p class="text-text">{{ cotizacion.frecuencia_pago }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Moneda</p>
                <p class="text-text">{{ cotizacion.moneda }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Suma Asegurada</p>
                <p class="text-text">{{ formatCurrency(cotizacion.suma_asegurada) }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Deducible</p>
                <p class="text-text">{{ formatCurrency(cotizacion.deducible) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Fechas y notas -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-text border-b border-gray-200 dark:border-gray-700 pb-2">
              Información Adicional
            </h4>
            
            <div class="grid grid-cols-1 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Fecha de Vencimiento</p>
                <p class="text-text">{{ formatDate(cotizacion.fecha_vencimiento) }}</p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Notas Internas</p>
                <p class="text-text whitespace-pre-line">{{ cotizacion.notas_internas || 'Sin notas' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Acciones -->
        <div class="mt-8 flex justify-end gap-3">
          <button
            v-if="cotizacion.estado !== 'convertida'"
            @click="$emit('convert', cotizacion)"
            class="px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 shadow"
          >
            Convertir a Póliza
          </button>
          
          <button
            @click="$emit('delete')"
            class="px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30"
          >
            Eliminar
          </button>
          
          <button
            @click="$emit('edit')"
            class="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover shadow"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';
import { computed } from 'vue';

interface Cotizacion {
  id_cotizacion: string;
  id_correduria: string;
  numero_cotizacion: string;
  nombre_cliente: string;
  correo_cliente: string;
  telefono_cliente: string;
  tipo_seguro: string;
  descripcion: string;
  prima_total: number;
  prima_mensual: number;
  moneda: string;
  frecuencia_pago: string;
  suma_asegurada: number;
  deducible: number;
  id_aseguradora: string;
  nombre_aseguradora?: string;
  fecha_creacion: string;
  fecha_vencimiento: string;
  estado: 'pendiente' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida' | 'convertida';
  notas_internas: string;
  creado_por: string;
}

interface Props {
  cotizacion: Cotizacion | null;
}

const props = defineProps<Props>();

// Valores por defecto para cuando cotizacion es null
const defaultCotizacion: Cotizacion = {
  id_cotizacion: '',
  id_correduria: '',
  numero_cotizacion: '',
  nombre_cliente: '',
  correo_cliente: '',
  telefono_cliente: '',
  tipo_seguro: '',
  descripcion: '',
  prima_total: 0,
  prima_mensual: 0,
  moneda: '',
  frecuencia_pago: '',
  suma_asegurada: 0,
  deducible: 0,
  id_aseguradora: '',
  fecha_creacion: '',
  fecha_vencimiento: '',
  estado: 'pendiente',
  notas_internas: '',
  creado_por: ''
};

// Computed property para acceder a los datos de la cotización de forma segura
const cotizacion = computed(() => props.cotizacion || defaultCotizacion);

defineEmits<{
  (e: 'close'): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
  (e: 'convert', cotizacion: Cotizacion): void;
}>();

// Funciones de formato
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-HN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2
  }).format(amount);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'enviada':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'aprobada':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'rechazada':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'vencida':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    case 'convertida':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};
</script> 