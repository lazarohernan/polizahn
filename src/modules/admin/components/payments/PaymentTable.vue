<script setup lang="ts">
  import { Eye, Edit } from 'lucide-vue-next';
  import { Pago } from '../../interfaces/pagos_interface';

  defineProps<{
    payments: Pago[];
  }>();

  const emit = defineEmits<{
    view: [payment: Pago];
    edit: [payment: Pago];
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
  <div class="bg-input-bg rounded-xl overflow-hidden">
    <table class="w-full border-separate border-spacing-0">
      <thead class="bg-input-bg">
        <tr>
          <th
            class="p-4 text-xs font-semibold text-text text-left uppercase tracking-wide border-b-2 border-input-border whitespace-nowrap"
          >
            #
          </th>
          <th
            class="p-4 text-xs font-semibold text-text text-left uppercase tracking-wide border-b-2 border-input-border whitespace-nowrap"
          >
            Abono
          </th>
          <th
            class="p-4 text-xs font-semibold text-text text-left uppercase tracking-wide border-b-2 border-input-border whitespace-nowrap"
          >
            Fecha Abono
          </th>
          <th
            class="p-4 text-xs font-semibold text-text text-left uppercase tracking-wide border-b-2 border-input-border whitespace-nowrap"
          >
            Método de Pago
          </th>
          <th
            class="p-4 text-xs font-semibold text-text text-left uppercase tracking-wide border-b-2 border-input-border whitespace-nowrap"
          >
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(payment, index) in payments" :key="payment.id_pago" class="hover:bg-background">
          <td class="p-4 text-sm text-text border-b border-input-border">{{ index + 1 }}</td>
          <td class="p-4 text-sm text-text border-b border-input-border">
            {{ formatCurrency(payment.abono) }}
          </td>
          <td class="p-4 text-sm text-text border-b border-input-border">
            {{ formatDate(payment.fecha as string) }}
          </td>
          <td class="p-4 text-sm text-text border-b border-input-border">
            {{ getPaymentMethodLabel(payment.metodo_pago) }}
          </td>
          <td class="p-4 text-sm text-text border-b border-input-border">
            <div class="flex items-center gap-2">
              <!-- Botón Ver -->
              <div
                class="group flex items-center justify-center w-8 h-8 rounded-lg border border-input-border bg-background cursor-pointer transition-all duration-200 hover:bg-primary hover:border-primary"
                title="Ver detalles"
                @click="emit('view', payment)"
              >
                <Eye class="w-4 h-4 text-text group-hover:text-white" />
              </div>
              <!-- Botón Editar -->
              <div
                class="group flex items-center justify-center w-8 h-8 rounded-lg border border-input-border bg-background cursor-pointer transition-all duration-200 hover:bg-primary hover:border-primary"
                title="Editar pago"
                @click="emit('edit', payment)"
              >
                <Edit class="w-4 h-4 text-text group-hover:text-white" />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
