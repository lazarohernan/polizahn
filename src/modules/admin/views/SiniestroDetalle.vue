<template>
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
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
          <p class="text-text/70">Cargando información del siniestro...</p>
        </div>
      </div>

      <template v-else-if="siniestro">
        <!-- Encabezado -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="flex items-center gap-4 mb-2">
              <button
                @click="router.back()"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft class="w-6 h-6 text-text" />
              </button>
              <h1 class="text-[1.875rem] font-semibold text-text">
                Siniestro #{{ siniestro.id_siniestro.slice(0, 8) }}
              </h1>
              <span :class="getStatusClass(siniestro.estatus)" class="px-3 py-1 rounded-full text-sm">
                {{ formatStatus(siniestro.estatus) }}
              </span>
            </div>
            <p class="text-text/70">
              Creado el {{ formatDate(siniestro.fecha_creado) }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <select
              v-model="currentStatus"
              @change="updateStatus"
              class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm"
              :disabled="loading"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
        </div>

        <!-- Contenido -->
        <div class="grid grid-cols-3 gap-6">
          <!-- Información principal -->
          <div class="col-span-2 space-y-6">
            <div class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-text mb-4">Detalles del Siniestro</h2>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-text/70 mb-1">Cliente</p>
                  <p class="text-text">{{ siniestro.cliente?.nombre || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-text/70 mb-1">Email del Cliente</p>
                  <p class="text-text">{{ siniestro.cliente?.email || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-text/70 mb-1">Póliza</p>
                  <p class="text-text">{{ siniestro.poliza?.numero || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-text/70 mb-1">Nombre de Póliza</p>
                  <p class="text-text">{{ siniestro.poliza?.nombre || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <div class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-text mb-4">Descripción</h2>
              <p class="text-text whitespace-pre-wrap">{{ siniestro.descripcion }}</p>
            </div>
          </div>

          <!-- Documentos -->
          <div class="col-span-1">
            <div class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <SiniestroDocumentos :id-siniestro="siniestro.id_siniestro" />
            </div>
          </div>
        </div>
      </template>

      <!-- Estado de error -->
      <div
        v-else
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-red-100">
            <AlertTriangle class="w-12 h-12 text-red-500" />
          </div>
          <h3 class="text-xl font-medium text-text">Siniestro no encontrado</h3>
          <p class="text-text/70 text-center max-w-md">
            No se pudo encontrar la información del siniestro solicitado.
          </p>
          <button
            @click="router.back()"
            class="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, AlertTriangle } from 'lucide-vue-next'
import { useSiniestros } from '@/composables/useSiniestros'
import type { Siniestro } from '@/composables/useSiniestros'
import SiniestroDocumentos from '@/modules/admin/components/SiniestroDocumentos.vue'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { loading, getSiniestroById, updateSiniestroStatus } = useSiniestros()
const siniestro = ref<Siniestro | null>(null)
const currentStatus = ref<Siniestro['estatus']>('pendiente')

const loadSiniestro = async () => {
  const id = route.params.id as string
  const { ok, data, message } = await getSiniestroById(id)

  if (!ok) {
    toast.error(message)
    return
  }

  siniestro.value = data
  if (data) {
    currentStatus.value = data.estatus
  }
}

const updateStatus = async () => {
  if (!siniestro.value || currentStatus.value === siniestro.value.estatus) return

  const { ok, message } = await updateSiniestroStatus(
    siniestro.value.id_siniestro,
    currentStatus.value
  )

  if (!ok) {
    currentStatus.value = siniestro.value.estatus
    toast.error(message)
    return
  }

  siniestro.value.estatus = currentStatus.value
  toast.success('Estado actualizado correctamente')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStatus = (status: Siniestro['estatus']) => {
  const statusMap: Record<Siniestro['estatus'], string> = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    cerrado: 'Cerrado'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: Siniestro['estatus']) => {
  const statusClasses: Record<Siniestro['estatus'], string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_proceso: 'bg-blue-100 text-blue-800',
    cerrado: 'bg-green-100 text-green-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

// Recargar cuando cambia el ID en la ruta
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadSiniestro()
    }
  }
)

onMounted(() => {
  loadSiniestro()
})
</script> 