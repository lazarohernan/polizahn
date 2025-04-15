<template>
  <div class="space-y-4">
    <!-- Lista de pólizas -->
    <div v-if="planesDePago.length > 0" class="grid gap-4">
      <div
        v-for="plan in planesDePago"
        :key="plan.id_plan"
        class="bg-container-bg border border-container-border rounded-xl p-4 hover:border-primary transition-all duration-300"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10">
              <FileText class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="text-base font-medium text-text">{{ plan.numero_poliza }}</h3>
              <p class="text-sm text-text/70">Prima Total: L. {{ formatNumber(plan.prima_total) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg bg-input-bg text-text transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5"
              @click="$emit('viewPolicy', plan.id_plan)"
            >
              <Eye class="w-5 h-5" />
            </button>
            <button
              class="p-2 rounded-lg bg-input-bg text-text transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5"
              @click="$emit('viewPayments', plan.id_plan)"
            >
              <Receipt class="w-5 h-5" />
            </button>
            <button
              class="p-2 rounded-lg bg-input-bg text-text transition-all duration-300 hover:bg-red-500 hover:text-white hover:-translate-y-0.5"
              @click="$emit('deletePlanDePago', plan.id_plan)"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-4 py-12 bg-container-bg border border-container-border rounded-xl"
    >
      <div class="p-3 rounded-xl bg-primary/10">
        <FileText class="w-8 h-8 text-primary" />
      </div>
      <div class="text-center">
        <h3 class="text-lg font-medium text-text mb-1">Sin Pólizas Asignadas</h3>
        <p class="text-sm text-text/70">Este cliente aún no tiene pólizas asignadas.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Eye, Receipt, Trash2 } from 'lucide-vue-next';
import type { Database } from '@/lib/supabase';
import { Cliente } from '../interfaces/cliente_interface';

type PlanDePago = Database['public']['Tables']['plan_de_pago']['Row'];

defineProps<{
  client: Cliente;
  planesDePago: PlanDePago[];
}>();

defineEmits<{
  (e: 'viewPolicy', id: string): void;
  (e: 'viewPayments', id: string): void;
  (e: 'deletePlanDePago', id: string): void;
}>();

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('es-HN').format(value);
};
</script> 