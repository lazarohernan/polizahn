<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { Home, Building2, FileText, Users, Calculator, AlertTriangle } from 'lucide-vue-next';

  const route = useRoute();

  const menuOptions = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'aseguradoras', label: 'Aseguradoras', icon: Building2 },
    { id: 'polizas', label: 'Pólizas', icon: FileText },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: Calculator },
    { id: 'siniestros', label: 'Siniestros', icon: AlertTriangle },
  ];

  const currentRoute = computed(() => route.path.substring(1));
</script>

<template>
  <nav
    class="fixed top-16 left-0 w-full bg-background/80 backdrop-blur-md shadow-sm z-[100] border-b border-container-border"
  >
    <div class="max-w-[1440px] mx-auto px-8 sm:px-4">
      <div
        class="flex justify-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-3"
      >
        <div class="flex gap-8 sm:gap-4 relative w-full justify-center">
          <RouterLink
            v-for="option in menuOptions"
            :key="option.id"
            :to="{ name: option.id }"
            class="flex flex-col items-center gap-1 p-2 text-text no-underline transition-all duration-200 rounded-lg min-w-[64px] sm:min-w-[56px] opacity-70 hover:opacity-100 hover:text-[#64D3DD] cursor-pointer"
            :class="{ 'opacity-100 text-[#64D3DD]': currentRoute === option.id }"
          >
            <div class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center">
              <component :is="option.icon" class="w-6 h-6 sm:w-5 sm:h-5" />
            </div>
            <span class="text-xs font-medium whitespace-nowrap">{{ option.label }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
