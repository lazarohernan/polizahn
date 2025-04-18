<!--
  TablaPagos.vue
  
  Componente que muestra una tabla con los pagos de una póliza.
  Permite ver los detalles y editar cada pago.
-->

<script setup lang="ts">
  import { Eye, Edit } from 'lucide-vue-next';
  import { Pago } from '../../interfaces/pagos_interface';

  defineProps<{
    pagos: Pago[];
  }>();

  const emit = defineEmits<{
    ver: [pago: Pago];
    editar: [pago: Pago];
  }>();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('es-HN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `L ${formatted}`;
  };

  const getPaymentMethodLabel = (method: Pago['metodo_pago']) => {
    const labels = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
    };
    return labels[method as keyof typeof labels] ?? '';
  };
</script>

<template>
  <div class="overflow-hidden border border-input rounded-lg">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-input bg-muted">
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Monto</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Método</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Cuota</th>
          <th class="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="pago in pagos" 
          :key="pago.id_pago" 
          class="border-b border-input hover:bg-muted/50 transition-colors"
        >
          <td class="px-4 py-3">{{ formatDate(pago.fecha) }}</td>
          <td class="px-4 py-3">L. {{ formatCurrency(pago.abono) }}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <span>{{ getPaymentMethodLabel(pago.metodo_pago) }}</span>
            </div>
          </td>
          <td class="px-4 py-3">{{ pago.numero_cuota ? `Cuota ${pago.numero_cuota}` : '-' }}</td>
          <td class="px-4 py-3 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-2">
              <button 
                class="p-1.5 rounded-lg hover:bg-primary/10 text-primary"
                @click="emit('ver', pago)"
              >
                <Eye class="w-4 h-4" />
              </button>
              <button 
                class="p-1.5 rounded-lg hover:bg-primary/10 text-primary"
                @click="emit('editar', pago)"
              >
                <Edit class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
