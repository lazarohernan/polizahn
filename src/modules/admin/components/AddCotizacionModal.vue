<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl">
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
        <h2 class="text-2xl font-semibold text-text">
          {{ isEditMode ? 'Editar Cotización' : 'Nueva Cotización' }}
        </h2>
        <button @click="$emit('close')" class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <XIcon class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="saveCotizacion">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Información del cliente -->
            <div class="space-y-4 md:col-span-2">
              <h3 class="text-lg font-medium text-text">Información del Cliente</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="nombre_cliente" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre del Cliente *
                  </label>
                  <input
                    id="nombre_cliente"
                    v-model="form.nombre_cliente"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                
                <div>
                  <label for="correo_cliente" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    id="correo_cliente"
                    v-model="form.correo_cliente"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej. cliente@example.com"
                  />
                </div>
                
                <div>
                  <label for="telefono_cliente" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teléfono *
                  </label>
                  <input
                    id="telefono_cliente"
                    v-model="form.telefono_cliente"
                    type="tel"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej. +504 9876-5432"
                  />
                </div>
              </div>
            </div>
            
            <!-- Información de la cotización -->
            <div class="space-y-4 md:col-span-2">
              <h3 class="text-lg font-medium text-text">Información de la Cotización</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="tipo_seguro" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Seguro *
                  </label>
                  <select
                    id="tipo_seguro"
                    v-model="form.tipo_seguro"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Automóvil">Automóvil</option>
                    <option value="Vida">Vida</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Médico">Médico</option>
                    <option value="Viaje">Viaje</option>
                    <option value="Empresarial">Empresarial</option>
                  </select>
                </div>
                
                <div>
                  <label for="id_aseguradora" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aseguradora *
                  </label>
                  <select
                    id="id_aseguradora"
                    v-model="form.id_aseguradora"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="1">Seguros Atlántida</option>
                    <option value="2">Ficohsa Seguros</option>
                    <option value="3">Mapfre</option>
                  </select>
                </div>
                
                <div class="md:col-span-2">
                  <label for="descripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    id="descripcion"
                    v-model="form.descripcion"
                    rows="3"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describa brevemente el seguro cotizado..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- Información financiera -->
            <div class="space-y-4 md:col-span-2">
              <h3 class="text-lg font-medium text-text">Información Financiera</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="prima_total" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prima Total *
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">HNL</span>
                    <input
                      id="prima_total"
                      v-model.number="form.prima_total"
                      type="number"
                      min="0"
                      required
                      class="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label for="prima_mensual" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prima Mensual *
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">HNL</span>
                    <input
                      id="prima_mensual"
                      v-model.number="form.prima_mensual"
                      type="number"
                      min="0"
                      required
                      class="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label for="frecuencia_pago" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frecuencia de Pago *
                  </label>
                  <select
                    id="frecuencia_pago"
                    v-model="form.frecuencia_pago"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
                
                <div>
                  <label for="suma_asegurada" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Suma Asegurada *
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">HNL</span>
                    <input
                      id="suma_asegurada"
                      v-model.number="form.suma_asegurada"
                      type="number"
                      min="0"
                      required
                      class="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label for="deducible" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deducible *
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">HNL</span>
                    <input
                      id="deducible"
                      v-model.number="form.deducible"
                      type="number"
                      min="0"
                      required
                      class="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label for="fecha_vencimiento" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha Vencimiento *
                  </label>
                  <input
                    id="fecha_vencimiento"
                    v-model="form.fecha_vencimiento"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            
            <!-- Notas internas -->
            <div class="space-y-2 md:col-span-2">
              <label for="notas_internas" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notas Internas
              </label>
              <textarea
                id="notas_internas"
                v-model="form.notas_internas"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Notas privadas sobre la cotización..."
              ></textarea>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              class="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover shadow-md"
            >
              {{ isEditMode ? 'Guardar Cambios' : 'Crear Cotización' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { XIcon } from 'lucide-vue-next';

interface Props {
  cotizacion?: {
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
    estado: string;
    notas_internas: string;
    creado_por: string;
  } | null;
  isEditMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cotizacion: null,
  isEditMode: false
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', cotizacion: Record<string, unknown>): void;
}>();

// Formulario
const form = ref({
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
  moneda: 'HNL',
  frecuencia_pago: '',
  suma_asegurada: 0,
  deducible: 0,
  id_aseguradora: '',
  fecha_creacion: '',
  fecha_vencimiento: formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
  estado: 'pendiente',
  notas_internas: '',
  creado_por: ''
});

// Formatear fecha para input type="date"
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Llenar formulario si es modo edición
onMounted(() => {
  if (props.isEditMode && props.cotizacion) {
    // Crear una copia profunda para no modificar el original
    const cotizacion = props.cotizacion; // Guardar en variable local para evitar null check repetido
    
    Object.keys(form.value).forEach(key => {
      if (key in cotizacion) {
        // Usar tipado seguro con as unknown as any para evitar errores
        form.value[key] = (cotizacion as unknown as any)[key];
      }
    });
    
    // Formatear la fecha de vencimiento para el input
    if (cotizacion.fecha_vencimiento) {
      form.value.fecha_vencimiento = formatDateForInput(new Date(cotizacion.fecha_vencimiento));
    }
  }
});

const saveCotizacion = () => {
  // Convertir la fecha al formato ISO
  const formToSave = { ...form.value };
  formToSave.fecha_vencimiento = new Date(form.value.fecha_vencimiento + 'T23:59:59').toISOString();
  
  emit('save', formToSave);
};
</script> 