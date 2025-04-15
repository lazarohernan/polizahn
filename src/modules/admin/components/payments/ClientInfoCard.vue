<template>
  <div class="p-5 bg-input-bg rounded-xl">
    <div class="grid grid-cols-2 gap-5">
      <div
        class="group relative flex items-start gap-3.5 p-4 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
      >
        <User class="w-5 h-5 text-primary opacity-70 flex-shrink-0" />
        <div class="min-w-0">
          <label class="block text-xs font-semibold text-text/70 uppercase tracking-wide mb-1.5"
            >Cliente</label
          >
          <p class="text-sm font-medium text-text truncate">
            {{ client.nombres + ' ' + client.apellidos }}
          </p>
        </div>
      </div>
      <div
        class="group relative flex items-start gap-3.5 p-4 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
      >
        <Hash class="w-5 h-5 text-primary opacity-70 flex-shrink-0" />
        <div class="min-w-0">
          <label class="block text-xs font-semibold text-text/70 uppercase tracking-wide mb-1.5"
            >DNI</label
          >
          <p class="text-sm font-medium text-text truncate">{{ client.identificacion }}</p>
        </div>
      </div>
      <div
        class="group relative flex items-start gap-3.5 p-4 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
      >
        <Mail class="w-5 h-5 text-primary opacity-70 flex-shrink-0" />
        <div class="min-w-0">
          <label class="block text-xs font-semibold text-text/70 uppercase tracking-wide mb-1.5"
            >Correo</label
          >
          <p class="text-sm font-medium text-text truncate">{{ client.correo }}</p>
        </div>
      </div>
      <div
        class="group relative flex items-start gap-3.5 p-4 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
      >
        <FileText class="w-5 h-5 text-primary opacity-70 flex-shrink-0" />
        <div class="min-w-0">
          <label class="block text-xs font-semibold text-text/70 uppercase tracking-wide mb-1.5"
            >Póliza</label
          >
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium text-text truncate">
              {{ planDePago?.nombre_poliza }} (#{{ planDePago?.numero_poliza }})
            </p>
            <span
              class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-600"
            >
              Vigente
            </span>
          </div>
          <div
            class="absolute left-0 top-full mt-2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap"
          >
            {{ planDePago?.nombre_poliza }} (#{{ planDePago?.numero_poliza }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { User, Mail, Hash, FileText } from 'lucide-vue-next';
  import { Cliente } from '../../interfaces/cliente_interface';
  import { PlanDePago } from '../../interfaces/plan_de_pago_interface';

  defineProps<{
    client: Cliente;
    planDePago: PlanDePago | null;
  }>();
</script>
