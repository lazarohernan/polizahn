<!--
  TarjetaInfoCliente.vue
  
  Componente que muestra información básica del cliente y su póliza.
  Se utiliza en la vista de pagos para mostrar un resumen del cliente seleccionado.
-->

<template>
  <div class="bg-background border border-input rounded-lg p-4">
    <div class="flex items-start justify-between">
      <!-- Información del cliente -->
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Avatar con iniciales o foto -->
        <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
          {{ obtenerIniciales }}
        </div>
        
        <!-- Datos principales -->
        <div class="space-y-1">
          <h3 class="font-semibold text-lg">{{ nombreCompleto }}</h3>
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon class="w-4 h-4" />
            <span>{{ cliente.identificacion }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <MailIcon class="w-4 h-4" />
            <span>{{ cliente.correo }}</span>
          </div>
        </div>
      </div>
      
      <!-- Resumen del plan -->
      <div v-if="planDePago" class="hidden sm:flex flex-col items-end gap-1">
        <div class="text-sm font-medium text-muted-foreground">
          Plan de pago
        </div>
        <div class="text-lg font-semibold">
          L. {{ formatNumero(planDePago.prima_total) }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ planDePago.plazo }} cuotas
        </div>
        <div v-if="planDePago.numero_poliza" class="text-xs text-muted-foreground">
          Póliza #{{ planDePago.numero_poliza }}
        </div>
      </div>
    </div>
    
    <!-- Barra de progreso de pagos (solo visible en pantallas medianas y grandes) -->
    <div v-if="planDePago && totalPagado > 0" class="mt-4 space-y-1 hidden sm:block">
      <div class="flex justify-between text-xs">
        <span>Pagado: L. {{ formatNumero(totalPagado) }}</span>
        <span>{{ porcentaje }}%</span>
      </div>
      <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-500 ease-out"
          :style="{ width: `${porcentaje}%` }"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-muted-foreground">
        <span>Pendiente: L. {{ formatNumero(pendiente) }}</span>
        <span>Total: L. {{ formatNumero(planDePago.prima_total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UserIcon, MailIcon } from 'lucide-vue-next';
import type { Cliente } from '@/modules/admin/interfaces/cliente_interface';
import type { PlanDePago } from '@/modules/admin/interfaces/plan_de_pago_interface';
import type { Pago } from '@/modules/admin/interfaces/pagos_interface';

const props = defineProps({
  cliente: {
    type: Object as () => Cliente,
    required: true
  },
  planDePago: {
    type: Object as () => PlanDePago,
    required: true
  },
  pagos: {
    type: Array as () => Pago[],
    default: () => []
  }
});

// Computados
const nombreCompleto = computed(() => {
  if (!props.cliente) return '';
  return `${props.cliente.nombres} ${props.cliente.apellidos}`.trim();
});

const obtenerIniciales = computed(() => {
  if (!props.cliente) return '';
  const nombre = props.cliente.nombres.charAt(0).toUpperCase();
  const apellido = props.cliente.apellidos.charAt(0).toUpperCase();
  return `${nombre}${apellido}`;
});

const totalPagado = computed(() => {
  if (!props.pagos || props.pagos.length === 0) return 0;
  return props.pagos.reduce((total, pago) => total + pago.abono, 0);
});

const pendiente = computed(() => {
  if (!props.planDePago) return 0;
  return props.planDePago.prima_total - totalPagado.value;
});

const porcentaje = computed(() => {
  if (!props.planDePago || props.planDePago.prima_total === 0) return 0;
  const porcentaje = (totalPagado.value / props.planDePago.prima_total) * 100;
  return Math.min(100, Math.round(porcentaje));
});

// Métodos
function formatNumero(valor: number): string {
  return valor.toLocaleString('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
</script>
