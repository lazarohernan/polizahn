<!--
  DiagnosticoPolizas.vue
  
  Componente de diagnóstico para depurar problemas con la carga de pólizas de clientes.
  Este archivo es temporal y debe eliminarse después de resolver el problema.
-->

<template>
  <div class="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Diagnóstico de Pólizas de Cliente</h1>
    
    <div class="space-y-6">
      <div class="bg-blue-50 p-4 rounded-xl">
        <h2 class="font-semibold mb-2">Estado del Cliente:</h2>
        <pre class="bg-gray-100 p-3 rounded whitespace-pre-wrap text-sm">{{ clienteJSON }}</pre>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-green-50 p-4 rounded-xl">
          <h2 class="font-semibold mb-2">ID del Cliente:</h2>
          <div class="flex items-center gap-2">
            <input 
              v-model="idClienteTest" 
              class="px-3 py-2 border rounded flex-1"
              placeholder="Ingresar ID para probar"
            />
            <button 
              @click="probarCargarPlanes"
              class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
            >
              Probar
            </button>
          </div>
        </div>
        
        <div class="bg-purple-50 p-4 rounded-xl">
          <h2 class="font-semibold mb-2">Estado de la Ruta:</h2>
          <p><strong>Ruta:</strong> {{ $route.name }}</p>
          <p><strong>Parámetros:</strong> {{ JSON.stringify($route.params) }}</p>
        </div>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-xl">
        <h2 class="font-semibold mb-2">Resultados de Prueba:</h2>
        <div v-if="loading" class="flex items-center gap-2">
          <div class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
          <span>Cargando...</span>
        </div>
        <div v-else>
          <p><strong>Estado:</strong> {{ testResult.ok ? 'Éxito' : 'Error' }}</p>
          <p><strong>Planes encontrados:</strong> {{ planesCount }}</p>
          <p v-if="!testResult.ok" class="text-red-500"><strong>Error:</strong> {{ testResult.message }}</p>
          <div v-if="planesCount > 0">
            <h3 class="font-semibold mt-3 mb-2">Planes obtenidos:</h3>
            <pre class="bg-gray-100 p-3 rounded whitespace-pre-wrap text-sm">{{ planesJSON }}</pre>
          </div>
        </div>
      </div>
      
      <div class="bg-yellow-50 p-4 rounded-xl">
        <h2 class="font-semibold mb-2">Solución de problemas:</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li>Verifica que el ID del cliente sea un UUID válido</li>
          <li>Asegúrate que el cliente existe en la base de datos</li>
          <li>Comprueba que el usuario tiene permiso para ver las pólizas del cliente</li>
          <li>Revisa que la función <code>loadClienteDetalle</code> esté cargando correctamente el cliente</li>
          <li>Confirma que el cliente pertenezca a la correduría actual</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePlanDePago } from '@/composables/usePlanDePago';
import { Cliente } from '@/modules/admin/interfaces/cliente_interface';
import type { Database } from '@/lib/supabase';

type PlanDePago = Database['public']['Tables']['plan_de_pago']['Row'];
type ResultadoPrueba = {
  ok: boolean;
  data: any;
  message: string;
};

const props = defineProps<{
  cliente: Cliente | null;
}>();

const route = useRoute();
const { getPlanesDePago } = usePlanDePago();
const loading = ref(false);
const idClienteTest = ref(route.params.id as string || '');
const testResult = ref<ResultadoPrueba>({
  ok: false,
  data: null,
  message: 'No se ha realizado ninguna prueba'
});

const clienteJSON = computed(() => {
  return JSON.stringify(props.cliente, null, 2);
});

const planesCount = computed(() => {
  if (testResult.value.data && Array.isArray(testResult.value.data)) {
    return testResult.value.data.length;
  }
  return 0;
});

const planesJSON = computed(() => {
  if (testResult.value.data && Array.isArray(testResult.value.data)) {
    return JSON.stringify(testResult.value.data, null, 2);
  }
  return '';
});

const probarCargarPlanes = async () => {
  loading.value = true;
  testResult.value = {
    ok: false,
    data: null,
    message: 'Cargando...'
  };
  
  try {
    if (!idClienteTest.value || idClienteTest.value.trim() === '') {
      throw new Error('ID de cliente vacío');
    }
    
    console.log('Probando carga de planes para cliente:', idClienteTest.value);
    const result = await getPlanesDePago(idClienteTest.value);
    console.log('Resultado de la prueba:', result);
    testResult.value = result as ResultadoPrueba;
  } catch (error) {
    console.error('Error en prueba:', error);
    testResult.value = {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : String(error)
    };
  } finally {
    loading.value = false;
  }
};
</script> 