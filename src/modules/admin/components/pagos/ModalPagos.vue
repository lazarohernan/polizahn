<template>
  <ModalContainer
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :title="modalTitle"
    :icon="modalIcon"
    width="lg"
  >
    <!-- Lista de pagos -->
    <div v-if="modo === 'lista'" class="flex flex-col gap-6">
      <!-- Estado de carga -->
      <div v-if="pagosStore.isLoading" class="p-10 flex flex-col items-center justify-center gap-4">
        <Loader class="w-10 h-10 animate-spin text-primary" />
        <span class="ml-3 text-text">Cargando datos...</span>
      </div>
      
      <!-- Estado de error -->
      <div v-else-if="pagosStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <p class="text-red-600 dark:text-red-400">{{ pagosStore.error }}</p>
      </div>
      
      <!-- Estado con datos -->
      <template v-else>
        <div v-if="planDePago" class="flex flex-col gap-4">
          <TarjetaInfoCliente 
            v-if="cliente" 
            :cliente="cliente" 
            :plan-de-pago="planDePago" 
          />
          
          <div class="flex items-center justify-between">
            <div class="flex items-baseline gap-3">
              <h3 class="text-lg font-medium">Pagos realizados</h3>
              <span class="text-sm text-muted-foreground">({{ pagos.length }})</span>
            </div>
            <Button
              v-if="pagos.length > 0"
              size="sm"
              variant="primary"
              @click="cambiarModo('agregar')"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Agregar pago
            </Button>
          </div>

          <div v-if="pagos.length > 0">
            <TablaPagos
              :pagos="pagos"
              @ver="verPago"
              @editar="editarPago"
            />
          </div>
          
          <!-- Estado sin pagos -->
          <div v-else class="p-10 flex flex-col items-center justify-center gap-4">
            <CircleDollarSignIcon class="w-16 h-16 text-muted-foreground/40" />
            <div class="text-center">
              <h3 class="text-lg font-medium">No hay pagos registrados</h3>
              <p class="text-muted-foreground text-sm mt-1">Registra el primer pago para esta póliza</p>
            </div>
            <Button 
              variant="primary"
              @click="cambiarModo('agregar')"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Agregar pago
            </Button>
          </div>
        </div>
        
        <!-- Estado sin plan de pago -->
        <div v-else class="p-10 flex flex-col items-center justify-center gap-4">
          <CircleDollarSignIcon class="w-16 h-16 text-muted-foreground/40" />
          <div class="text-center">
            <h3 class="text-lg font-medium">Plan de pago no encontrado</h3>
            <p class="text-muted-foreground text-sm mt-1">No se pudo cargar la información del plan de pago</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Formulario para agregar pago -->
    <div v-if="modo === 'agregar'" class="flex flex-col gap-6">
      <Button 
        variant="ghost" 
        class="self-start flex items-center gap-2"
        @click="cambiarModo('lista')"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Volver a pagos
      </Button>
      
      <FormularioAgregarPago
        v-if="planDePago"
        :plan-de-pago-id="planDePago.id_plan ?? ''"
        :prima-total="planDePago.prima_total"
        :pagos-realizados="pagos"
        :detalles-plan="pagosStore.detallesPlan"
        @guardar="guardarNuevoPago"
        @cancelar="cambiarModo('lista')"
      />
    </div>

    <!-- Detalles del pago -->
    <div v-if="modo === 'detalles' || modo === 'editar'" class="flex flex-col gap-6">
      <Button 
        variant="ghost" 
        class="self-start flex items-center gap-2"
        @click="cambiarModo('lista')"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Volver a pagos
      </Button>
      
      <DetallesPago
        v-if="pagoSeleccionado"
        :pago="pagoSeleccionado"
        :modo-edicion="modo === 'editar'"
        :detalles-plan="pagosStore.detallesPlan"
        @editar="activarModoEdicion"
        @guardar="guardarEdicionPago"
        @eliminar="eliminarPago"
        @cerrar="cambiarModo('lista')"
      />
    </div>
  </ModalContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  CircleDollarSignIcon, 
  CreditCardIcon,
  Loader
} from 'lucide-vue-next';
import ModalContainer from '@/components/ui/ModalContainer.vue';
import Button from '../ui/Button.vue';
import TablaPagos from './TablaPagos.vue';
import FormularioAgregarPago from './FormularioAgregarPago.vue';
import DetallesPago from './DetallesPago.vue';
import TarjetaInfoCliente from './TarjetaInfoCliente.vue';
import { usePagosStore } from '@/stores/pagosStore';
import { useClientesStore } from '@/stores/clientesStore';
import type { Pago, CreatePagoDTO, UpdatePagoDTO } from '@/modules/admin/interfaces/pagos_interface';
import type { Cliente } from '@/modules/admin/interfaces/cliente_interface';
import { PropType } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  planDePagoId: {
    type: String as PropType<string | undefined>,
    default: undefined
  },
  clienteId: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

// Stores
const pagosStore = usePagosStore();
const clientesStore = useClientesStore();

// Estado local
const modo = ref<'lista' | 'agregar' | 'detalles' | 'editar'>('lista');
const pagoSeleccionado = ref<Pago | null>(null);

// Datos derivados
const pagos = computed(() => pagosStore.pagosData);
const planDePago = computed(() => pagosStore.planData);
const cliente = computed(() => pagosStore.clienteActivo);

// Computados para el título e ícono del modal
const modalTitle = computed(() => {
  switch (modo.value) {
    case 'lista': return 'Gestión de Pagos';
    case 'agregar': return 'Registrar Nuevo Pago';
    case 'detalles': return 'Detalles del Pago';
    case 'editar': return 'Editar Pago';
    default: return 'Gestión de Pagos';
  }
});

const modalIcon = computed(() => {
  return CreditCardIcon;
});

// Métodos
const cargarDatos = async () => {
  // Verificar si tenemos un ID en las props o en el store
  const planId = props.planDePagoId || pagosStore.planDePagoActivo;
  
  if (!planId) {
    // Solo mostrar error si realmente no hay un ID disponible
    toast.error('No se proporcionó un ID de plan de pago');
    return;
  }

  if (props.clienteId) {
    const clienteData = await clientesStore.obtenerClientePorId(props.clienteId);
    if (clienteData) {
      await pagosStore.abrirModalPagos(planId, clienteData as unknown as Cliente);
    } else {
      toast.error('No se pudo encontrar el cliente');
      await pagosStore.abrirModalPagos(planId, null);
    }
  } else {
    await pagosStore.abrirModalPagos(planId, null);
  }
};

const cambiarModo = (nuevoModo: 'lista' | 'agregar' | 'detalles' | 'editar') => {
  modo.value = nuevoModo;
  if (nuevoModo === 'lista') {
    pagoSeleccionado.value = null;
  }
};

const verPago = (pago: Pago) => {
  pagoSeleccionado.value = pago;
  cambiarModo('detalles');
};

const editarPago = (pago: Pago) => {
  pagoSeleccionado.value = pago;
  cambiarModo('editar');
};

const activarModoEdicion = () => {
  cambiarModo('editar');
};

const guardarNuevoPago = async (datosPago: CreatePagoDTO) => {
  const resultado = await pagosStore.guardarNuevoPago(datosPago);
  if (resultado) {
    cambiarModo('lista');
  }
};

const guardarEdicionPago = async (datosPago: UpdatePagoDTO) => {
  if (pagoSeleccionado.value) {
    const resultado = await pagosStore.actualizarPago({
      ...datosPago,
      id_pago: pagoSeleccionado.value.id_pago
    });
    
    if (resultado) {
      cambiarModo('lista');
    }
  }
};

const eliminarPago = async (idPago: string) => {
  const resultado = await pagosStore.eliminarPago(idPago);
  if (resultado) {
    cambiarModo('lista');
  }
};

// Watches
watch(() => props.modelValue, (newValue) => {
  console.log('[ModalPagos] modelValue cambió a:', newValue);
  if (newValue) {
    modo.value = 'lista';
    cargarDatos();
  } else {
    pagosStore.cerrarModalPagos();
  }
});

watch(() => props.planDePagoId, (newValue) => {
  console.log('[ModalPagos] planDePagoId cambió a:', newValue);
  if (props.modelValue) {
    cargarDatos();
  }
});

watch(() => pagosStore.modalVisible, (newValue) => {
  console.log('[ModalPagos] pagosStore.modalVisible cambió a:', newValue);
});

// Ciclo de vida
onMounted(() => {
  console.log('[ModalPagos] Componente montado. modelValue:', props.modelValue, 'planDePagoId:', props.planDePagoId);
  if (props.modelValue) {
    cargarDatos();
  }
});
</script> 