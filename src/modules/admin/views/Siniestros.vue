<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <!-- Encabezado y acciones -->
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Siniestros</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar
                v-model="searchTerm"
                placeholder="Buscar siniestros..."
              />
            </div>
            <select
              v-model="statusFilter"
              class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Estado de carga -->
      <div
        v-if="loading"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="animate-spin">
            <svg class="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-text/70">Cargando siniestros...</p>
        </div>
      </div>

      <!-- Estado sin siniestros -->
      <div
        v-else-if="siniestros.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <AlertTriangle class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No hay siniestros registrados</h3>
          <p class="text-text/70 text-center max-w-md">
            Aún no hay siniestros registrados en el sistema.
          </p>
        </div>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div
        v-else-if="searchTerm && filteredSiniestros.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Search class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
          <p class="text-text/70 text-center max-w-md">
            No se encontraron siniestros que coincidan con tu búsqueda. Intenta con otros términos.
          </p>
        </div>
      </div>

      <!-- Lista de siniestros -->
      <div v-else class="grid grid-cols-1 gap-6">
        <div
          v-for="siniestro in filteredSiniestros"
          :key="siniestro.id_siniestro"
          class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
        >
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div
                class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <AlertTriangle class="w-8 h-8 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-text">
                    Siniestro #{{ siniestro.id_siniestro.slice(0, 8) }}
                  </h3>
                  <span :class="getStatusClass(siniestro.estatus)" class="px-3 py-1 rounded-full text-sm">
                    {{ formatStatus(siniestro.estatus) }}
                  </span>
                </div>
                <p class="text-sm text-text/70 line-clamp-2">{{ siniestro.descripcion }}</p>
                <div class="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span class="text-xs text-text/50">Cliente:</span>
                    <p class="text-sm text-text">{{ siniestro.cliente?.nombre || 'N/A' }}</p>
                  </div>
                  <div>
                    <span class="text-xs text-text/50">Póliza:</span>
                    <p class="text-sm text-text">{{ siniestro.poliza?.numero || 'N/A' }}</p>
                  </div>
                  <div>
                    <span class="text-xs text-text/50">Fecha:</span>
                    <p class="text-sm text-text">{{ formatDate(siniestro.fecha_creado) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="verDetalle(siniestro.id_siniestro)"
              class="w-full px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { AlertTriangle, Search } from 'lucide-vue-next'
import SearchBar from '@/modules/common/components/SearchBar.vue'
import { useToast } from 'vue-toastification'

interface Siniestro {
  id_siniestro: string
  id_cliente: string
  id_poliza: string
  fecha_creado: string
  descripcion: string
  estatus: string
  cliente?: {
    nombre: string
  }
  poliza?: {
    numero: string
  }
}

const router = useRouter()
const toast = useToast()
const siniestros = ref<Siniestro[]>([])
const loading = ref(true)
const searchTerm = ref('')
const statusFilter = ref('')

const filteredSiniestros = computed(() => {
  return siniestros.value.filter(siniestro => {
    const matchesSearch = searchTerm.value === '' || 
      siniestro.descripcion.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      siniestro.cliente?.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesStatus = statusFilter.value === '' || siniestro.estatus === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const loadSiniestros = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('siniestros')
      .select(`
        *,
        cliente:clientes(nombre),
        poliza:polizas(numero)
      `)
      .order('fecha_creado', { ascending: false })

    if (error) throw error
    siniestros.value = data || []
  } catch (error) {
    console.error('Error al cargar siniestros:', error)
    toast.error('Error al cargar los siniestros')
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    cerrado: 'Cerrado'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_proceso: 'bg-blue-100 text-blue-800',
    cerrado: 'bg-green-100 text-green-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const verDetalle = (id: string) => {
  router.push(`/admin/siniestros/${id}`)
}

onMounted(() => {
  loadSiniestros()
})
</script>
