<template>
  <div class="flex flex-col gap-6">
    <!-- Modo visualización -->
    <div v-if="!modoEdicion" class="bg-background border border-input rounded-lg overflow-hidden">
      <div class="bg-muted p-5 flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-xs text-muted-foreground">ID del pago</span>
          <span class="font-medium">{{ pago.id_pago }}</span>
        </div>
        
        <div class="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            @click="editar"
          >
            <PencilIcon class="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            @click="confirmarEliminar"
          >
            <TrashIcon class="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>
      
      <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Información principal -->
        <div class="space-y-4">
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground">Monto</span>
            <span class="text-lg font-medium">L. {{ formatNumber(pago.abono) }}</span>
          </div>
          
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground">Fecha</span>
            <span>{{ formatDate(pago.fecha) }}</span>
          </div>
          
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground">Método de pago</span>
            <div class="flex items-center gap-2 mt-1">
              <component :is="metodoIcon" class="w-4 h-4" />
              <span>{{ formatMetodoPago(pago.metodo_pago) }}</span>
            </div>
          </div>
          
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground">Cuota asociada</span>
            <span>
              {{ cuotaAsociada ? `Cuota ${cuotaAsociada.numero_pago}` : 'No especificada' }}
            </span>
          </div>
        </div>
        
        <!-- Información adicional y comprobante -->
        <div class="space-y-4">
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground">Estado</span>
            <span class="inline-flex items-center mt-1">
              <span class="w-2 h-2 rounded-full mr-2" :class="pago.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'"></span>
              {{ pago.estado === 'activo' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground">Fecha de registro</span>
            <span>{{ pago.fecha_creado ? formatDateTime(pago.fecha_creado) : 'No disponible' }}</span>
          </div>
          
          <div v-if="pago.url_comprobante" class="flex flex-col">
            <span class="text-xs text-muted-foreground">Comprobante</span>
            <a 
              :href="pago.url_comprobante" 
              target="_blank" 
              class="inline-flex items-center mt-1 text-primary hover:underline"
            >
              <FileIcon class="w-4 h-4 mr-2" />
              Ver comprobante
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Modo edición -->
    <div v-else class="flex flex-col gap-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Monto del pago -->
        <div class="flex flex-col gap-2">
          <label for="monto" class="text-sm font-medium">Monto del Abono</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">L.</span>
            <input
              id="monto"
              v-model="formData.abono"
              type="number"
              class="w-full rounded-lg border border-input bg-background px-9 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
              min="0"
              :class="{ 'border-red-500 focus:ring-red-500': errores.abono }"
            />
          </div>
          <p v-if="errores.abono" class="text-red-500 text-xs mt-1">{{ errores.abono }}</p>
        </div>

        <!-- Fecha del pago -->
        <div class="flex flex-col gap-2">
          <label for="fecha" class="text-sm font-medium">Fecha de Pago</label>
            <input
            id="fecha"
            v-model="formData.fecha"
              type="date"
            class="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{ 'border-red-500 focus:ring-red-500': errores.fecha }"
          />
          <p v-if="errores.fecha" class="text-red-500 text-xs mt-1">{{ errores.fecha }}</p>
        </div>
      </div>
      
      <!-- Cuota a la que corresponde el pago -->
      <div v-if="detallesPlan && detallesPlan.length > 0" class="flex flex-col gap-2">
        <label class="text-sm font-medium">Cuota a aplicar el pago</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div
            v-for="detalle in cuotasDisponibles"
            :key="detalle.id_detalle"
            class="border border-input rounded-lg p-3 cursor-pointer transition-all duration-200"
            :class="formData.id_detalle === detalle.id_detalle ? 'border-primary bg-primary/5' : 'hover:border-primary/50'"
            @click="seleccionarCuota(detalle)"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium">Cuota {{ detalle.numero_pago }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full" :class="estadoClase(detalle.estado)">
                {{ detalle.estado }}
              </span>
            </div>
            <div class="flex flex-col mt-1">
              <span class="text-sm">L. {{ formatNumber(detalle.monto) }}</span>
              <span class="text-xs text-muted-foreground">Vence: {{ formatDate(detalle.fecha_vencimiento) }}</span>
            </div>
          </div>
          <div
            class="border border-input rounded-lg p-3 cursor-pointer transition-all duration-200"
            :class="formData.id_detalle === null ? 'border-primary bg-primary/5' : 'hover:border-primary/50'"
            @click="formData.id_detalle = null"
          >
            <div class="flex items-center justify-center h-full">
              <span class="font-medium text-sm">Sin asociar a cuota</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Método de pago -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">Método de Pago</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            class="border border-input rounded-lg p-3 cursor-pointer transition-all duration-200 flex items-center gap-3"
            :class="formData.metodo_pago === 'efectivo' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'"
            @click="formData.metodo_pago = 'efectivo'"
          >
            <div class="w-5 h-5 rounded-full flex items-center justify-center border border-input">
              <div v-if="formData.metodo_pago === 'efectivo'" class="w-3 h-3 rounded-full bg-primary"></div>
            </div>
            <span>Efectivo</span>
          </div>
          
          <div
            class="border border-input rounded-lg p-3 cursor-pointer transition-all duration-200 flex items-center gap-3"
            :class="formData.metodo_pago === 'tarjeta' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'"
            @click="formData.metodo_pago = 'tarjeta'"
          >
            <div class="w-5 h-5 rounded-full flex items-center justify-center border border-input">
              <div v-if="formData.metodo_pago === 'tarjeta'" class="w-3 h-3 rounded-full bg-primary"></div>
            </div>
            <span>Tarjeta</span>
          </div>
          
          <div
            class="border border-input rounded-lg p-3 cursor-pointer transition-all duration-200 flex items-center gap-3"
            :class="formData.metodo_pago === 'transferencia' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'"
            @click="formData.metodo_pago = 'transferencia'"
          >
            <div class="w-5 h-5 rounded-full flex items-center justify-center border border-input">
              <div v-if="formData.metodo_pago === 'transferencia'" class="w-3 h-3 rounded-full bg-primary"></div>
            </div>
            <span>Transferencia</span>
          </div>
        </div>
        <p v-if="errores.metodo_pago" class="text-red-500 text-xs mt-1">{{ errores.metodo_pago }}</p>
      </div>

      <!-- Comprobante -->
      <div class="flex flex-col gap-2">
        <label for="comprobante" class="text-sm font-medium">Comprobante de Pago (opcional)</label>
        <div class="border border-dashed border-input rounded-lg p-6">
          <div v-if="!archivoSeleccionado && !pago.url_comprobante" class="flex flex-col items-center justify-center gap-2">
            <UploadIcon class="w-10 h-10 text-muted-foreground/70" />
            <p class="text-center text-sm text-muted-foreground">
              <span class="font-medium text-primary">Haz clic para seleccionar</span> o arrastra y suelta un archivo
            </p>
            <p class="text-xs text-muted-foreground">PNG, JPG o PDF (máx. 5MB)</p>
            <input
              id="comprobante"
              type="file"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".png,.jpg,.jpeg,.pdf"
              @change="handleFileSelect"
            />
          </div>
          <div v-else-if="archivoSeleccionado" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <FileIcon class="w-8 h-8 text-primary" />
              <div class="flex flex-col">
                <span class="text-sm font-medium truncate max-w-[200px]">{{ archivoSeleccionado.name }}</span>
                <span class="text-xs text-muted-foreground">{{ formatFileSize(archivoSeleccionado.size) }}</span>
              </div>
            </div>
            <button 
              class="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
              @click.prevent="eliminarArchivo"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
          <div v-else-if="pago.url_comprobante" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <FileIcon class="w-8 h-8 text-primary" />
              <div class="flex flex-col">
                <span class="text-sm font-medium">Comprobante actual</span>
                <a 
                  :href="pago.url_comprobante" 
            target="_blank"
                  class="text-xs text-primary hover:underline"
          >
                  Ver comprobante
          </a>
        </div>
            </div>
            <button 
              class="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
              @click.prevent="eliminarComprobanteActual"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end gap-3 mt-4">
        <Button 
          variant="outline" 
          @click="cancelar"
        >
          Cancelar
        </Button>
        <Button 
          variant="primary"
          :loading="isLoading"
          :disabled="!esFormularioValido || isLoading"
          @click="guardar"
        >
          Guardar Cambios
        </Button>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1200] p-6">
      <div class="bg-background border border-input rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Confirmar eliminación</h3>
        <p class="mb-6">¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer.</p>
        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="mostrarConfirmacion = false">
            Cancelar
          </Button>
          <Button variant="destructive" :loading="isLoading" @click="eliminar">
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
  import {
  PencilIcon, 
  TrashIcon, 
  UploadIcon, 
  FileIcon,
    BanknoteIcon,
  CreditCardIcon,
  ArrowLeftRightIcon
  } from 'lucide-vue-next';
import Button from '../ui/Button.vue';
import type { DetallePlan, UpdatePagoDTO } from '@/modules/admin/interfaces/pagos_interface';
import type { Pago } from '@/modules/admin/interfaces/pagos_interface';

interface FormState {
  abono: number;
  fecha: string;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  id_detalle: string | null;
  url_comprobante?: string | null;
}

interface FormErrors {
  abono?: string;
  fecha?: string;
  metodo_pago?: string;
}

const props = defineProps({
  pago: {
    type: Object as () => Pago,
    required: true
  },
  modoEdicion: {
    type: Boolean,
    default: false
  },
  detallesPlan: {
    type: Array as () => DetallePlan[],
    default: () => []
  }
});

const emit = defineEmits(['editar', 'guardar', 'eliminar', 'cerrar']);

// Estado
const formData = reactive<FormState>({
  abono: props.pago.abono,
  fecha: props.pago.fecha ? new Date(props.pago.fecha).toISOString().split('T')[0] : '',
  metodo_pago: props.pago.metodo_pago as 'efectivo' | 'tarjeta' | 'transferencia',
  id_detalle: props.pago.id_detalle || null,
  url_comprobante: props.pago.url_comprobante
});

const errores = reactive<FormErrors>({});
const archivoSeleccionado = ref<File | null>(null);
const isLoading = ref(false);
const mostrarConfirmacion = ref(false);
const eliminarUrlComprobante = ref(false);

// Computados
const cuotaAsociada = computed(() => {
  if (!props.pago.id_detalle) return null;
  return props.detallesPlan.find(detalle => detalle.id_detalle === props.pago.id_detalle);
});

const cuotasDisponibles = computed(() => {
  // Filtrar las cuotas disponibles
  // Incluir cuotas pendientes, vencidas, y la actual si está pagada
  return props.detallesPlan.filter(detalle => {
    if (detalle.id_detalle === props.pago.id_detalle) return true;
    return detalle.estado === 'pendiente' || detalle.estado === 'vencido';
  }).sort((a, b) => a.numero_pago - b.numero_pago);
});

const metodoIcon = computed(() => {
  switch (props.pago.metodo_pago) {
    case 'efectivo': return BanknoteIcon;
    case 'tarjeta': return CreditCardIcon;
    case 'transferencia': return ArrowLeftRightIcon;
    default: return BanknoteIcon;
  }
});

const esFormularioValido = computed(() => {
  return !!formData.abono && formData.abono > 0 && !!formData.fecha && !!formData.metodo_pago;
});

// Métodos
function formatNumber(value: number): string {
  return value.toLocaleString('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('es-HN', options);
}

function formatDateTime(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('es-HN', options);
}

function formatMetodoPago(metodo: string): string {
  switch (metodo) {
    case 'efectivo': return 'Efectivo';
    case 'tarjeta': return 'Tarjeta';
    case 'transferencia': return 'Transferencia';
    default: return metodo;
  }
}

function estadoClase(estado: string): string {
  switch (estado) {
    case 'pagado':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'vencido':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

function seleccionarCuota(detalle: DetallePlan) {
  formData.id_detalle = detalle.id_detalle;
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
      return;
    }
    
    // Validar tipo
    const tiposPermitidos = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!tiposPermitidos.includes(file.type)) {
      alert('Tipo de archivo no permitido. Por favor, selecciona una imagen (PNG, JPG) o un PDF.');
      return;
    }
    
    archivoSeleccionado.value = file;
    eliminarUrlComprobante.value = false;
  }
}

function eliminarArchivo() {
  archivoSeleccionado.value = null;
}

function eliminarComprobanteActual() {
  formData.url_comprobante = null;
  eliminarUrlComprobante.value = true;
}

function editar() {
  emit('editar');
}

function cancelar() {
  emit('cerrar');
}

function confirmarEliminar() {
  mostrarConfirmacion.value = true;
}

async function eliminar() {
  isLoading.value = true;
  try {
    await emit('eliminar', props.pago.id_pago);
    mostrarConfirmacion.value = false;
  } finally {
    isLoading.value = false;
  }
}

function validarFormulario(): boolean {
  let esValido = true;
  errores.abono = '';
  errores.fecha = '';
  errores.metodo_pago = '';
  
  if (!formData.abono) {
    errores.abono = 'El monto es requerido';
    esValido = false;
  } else if (formData.abono <= 0) {
    errores.abono = 'El monto debe ser mayor a cero';
    esValido = false;
  }
  
  if (!formData.fecha) {
    errores.fecha = 'La fecha es requerida';
    esValido = false;
  }
  
  if (!formData.metodo_pago) {
    errores.metodo_pago = 'Selecciona un método de pago';
    esValido = false;
  }
  
  return esValido;
}

async function guardar() {
  if (!validarFormulario()) return;
  
  isLoading.value = true;
  
  try {
    // Preparar datos del pago
    const pagoData: UpdatePagoDTO = {
      abono: formData.abono,
      fecha: formData.fecha,
      metodo_pago: formData.metodo_pago,
      id_detalle: formData.id_detalle || undefined
    };
    
    // Si hay un archivo nuevo para el comprobante
    if (archivoSeleccionado.value) {
      pagoData.url_comprobante = archivoSeleccionado.value;
    } 
    // Si se eliminó el comprobante actual
    else if (eliminarUrlComprobante.value) {
      pagoData.url_comprobante = undefined;
    }
    
    // Emitir evento con los datos
    emit('guardar', pagoData);
  } catch (error) {
    console.error('Error al guardar cambios del pago:', error);
  } finally {
    isLoading.value = false;
  }
}

// Watchers
watch(() => props.pago, (nuevoPago) => {
  // Actualizar formData cuando cambia el pago
  formData.abono = nuevoPago.abono;
  formData.fecha = nuevoPago.fecha ? new Date(nuevoPago.fecha).toISOString().split('T')[0] : '';
  formData.metodo_pago = nuevoPago.metodo_pago as 'efectivo' | 'tarjeta' | 'transferencia';
  formData.id_detalle = nuevoPago.id_detalle || null;
  formData.url_comprobante = nuevoPago.url_comprobante;
  
  // Reiniciar estado
  archivoSeleccionado.value = null;
  eliminarUrlComprobante.value = false;
}, { deep: true });
</script>
