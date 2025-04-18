<!--
  FormularioAgregarPago.vue
  
  Formulario para registrar un nuevo pago asociado a una póliza.
  Permite ingresar el monto, fecha, método de pago y adjuntar un comprobante.
-->

<template>
  <div class="flex flex-col gap-6">
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
    <div class="flex flex-col gap-2 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
      <label class="text-sm font-medium flex items-center">
        <span class="text-yellow-700 dark:text-yellow-400 mr-2">⚠️</span>
        <span>Cuota a aplicar el pago <span class="text-red-500">*</span></span>
      </label>
      <p class="text-xs text-yellow-700 dark:text-yellow-300 mb-2">Para un correcto seguimiento, es importante asociar el pago a una cuota específica.</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <div
          v-for="detalle in cuotasPendientes"
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
          :class="formData.id_detalle === undefined ? 'border-primary bg-primary/5' : 'hover:border-primary/50'"
          @click="quitarSeleccionCuota"
        >
          <div class="flex items-center justify-center h-full">
            <span class="font-medium text-sm text-red-500">Sin asociar a cuota</span>
          </div>
        </div>
      </div>
      <p v-if="!formData.id_detalle && intentoGuardar" class="text-red-500 text-xs mt-1">
        Recomendamos asociar el pago a una cuota específica
      </p>
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
        <div v-if="!archivoSeleccionado" class="flex flex-col items-center justify-center gap-2 relative">
          <UploadIcon class="w-10 h-10 text-muted-foreground/70" />
          <p class="text-center text-sm text-muted-foreground">
            <span class="font-medium text-primary">Haz clic para seleccionar</span> o arrastra y suelta un archivo
          </p>
          <p class="text-xs text-muted-foreground">PNG, JPG o PDF (máx. 5MB)</p>
          <input
            id="comprobante"
            type="file"
            class="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer z-10"
            accept=".png,.jpg,.jpeg,.pdf"
            @change="handleFileSelect"
          />
        </div>
        <div v-else class="flex items-center justify-between">
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
        Guardar Pago
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { UploadIcon, FileIcon, TrashIcon } from 'lucide-vue-next';
import Button from '../ui/Button.vue';
import type { DetallePlan, CreatePagoDTO } from '@/modules/admin/interfaces/pagos_interface';
import type { Pago } from '@/modules/admin/interfaces/pagos_interface';

interface FormState {
  abono: number | null;
  fecha: string;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  id_detalle?: string;
}

interface FormErrors {
  abono?: string;
  fecha?: string;
  metodo_pago?: string;
}

const props = defineProps({
  planDePagoId: {
    type: String,
    required: true
  },
  primaTotal: {
    type: Number,
    required: true
  },
  pagosRealizados: {
    type: Array as () => Pago[],
    default: () => []
  },
  detallesPlan: {
    type: Array as () => DetallePlan[],
    default: () => []
  }
});

const emit = defineEmits(['guardar', 'cancelar']);

const formData = reactive<FormState>({
  abono: null,
  fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  metodo_pago: 'efectivo',
  id_detalle: undefined
});

const errores = reactive<FormErrors>({});
const archivoSeleccionado = ref<File | null>(null);
const isLoading = ref(false);
const intentoGuardar = ref(false);

// Computados
const cuotasPendientes = computed(() => {
  return props.detallesPlan.filter(detalle => 
    detalle.estado === 'pendiente' || detalle.estado === 'vencido'
  ).sort((a, b) => a.numero_pago - b.numero_pago);
});

const totalPagado = computed(() => {
  return props.pagosRealizados.reduce((sum, pago) => sum + pago.abono, 0);
});

const saldoPendiente = computed(() => {
  return props.primaTotal - totalPagado.value;
});

const esFormularioValido = computed(() => {
  return !!formData.abono && formData.abono > 0 && !!formData.fecha && !!formData.metodo_pago;
});

// Métodos
function seleccionarCuota(detalle: DetallePlan) {
  formData.id_detalle = detalle.id_detalle;
  formData.abono = detalle.monto;
  intentoGuardar.value = false;
}

function quitarSeleccionCuota() {
  formData.id_detalle = undefined;
  formData.abono = null;
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
  }
}

function eliminarArchivo() {
  archivoSeleccionado.value = null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

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
  } else if (formData.abono > saldoPendiente.value) {
    errores.abono = `El monto no puede ser mayor al saldo pendiente (L. ${formatNumber(saldoPendiente.value)})`;
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
  intentoGuardar.value = true;
  if (!validarFormulario()) return;
  
  if (!formData.id_detalle && cuotasPendientes.value.length > 0) {
    const confirmar = confirm('Está a punto de guardar un pago sin asociarlo a una cuota específica. Esto puede dificultar el seguimiento de pagos. ¿Desea continuar?');
    if (!confirmar) return;
  }
  
  isLoading.value = true;
  
  try {
    // Preparar datos del pago
    const pagoData: CreatePagoDTO = {
      id_plan: props.planDePagoId,
      abono: formData.abono!,
      fecha: formData.fecha,
      metodo_pago: formData.metodo_pago
    };
    
    // Añadir id_detalle si se seleccionó una cuota
    if (formData.id_detalle) {
      pagoData.id_detalle = formData.id_detalle;
    }
    
    // Añadir el comprobante si se seleccionó
    if (archivoSeleccionado.value) {
      pagoData.url_comprobante = archivoSeleccionado.value;
    }
    
    // Emitir evento con los datos
    emit('guardar', pagoData);
  } catch (error) {
    console.error('Error al guardar pago:', error);
  } finally {
    isLoading.value = false;
  }
}

function cancelar() {
  emit('cancelar');
}

// Watchers
watch(() => props.detallesPlan, (nuevosDetalles) => {
  // Si hay cuotas pendientes y no se ha seleccionado una, seleccionar la primera
  if (nuevosDetalles.length > 0 && cuotasPendientes.value.length > 0 && !formData.id_detalle) {
    seleccionarCuota(cuotasPendientes.value[0]);
  }
}, { immediate: true });
</script>
