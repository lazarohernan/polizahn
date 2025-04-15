<template>
  <div class="space-y-4">
    <!-- Encabezado -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-text">Documentos</h3>
      <button
        @click="handleUpload"
        class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        :disabled="loading"
      >
        <div v-if="loading" class="flex items-center gap-2">
          <span class="animate-spin">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <span>Subiendo...</span>
        </div>
        <div v-else class="flex items-center gap-2">
          <UploadIcon class="w-4 h-4" />
          <span>Subir Documento</span>
        </div>
      </button>
    </div>

    <!-- Lista de documentos -->
    <div v-if="documentos.length === 0" class="text-center py-8 text-text/70">
      No hay documentos adjuntos a este siniestro
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="documento in documentos"
        :key="documento.id_documento"
        class="flex items-center justify-between p-4 bg-container-bg border border-gray-200 dark:border-gray-700 rounded-xl"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <FileIcon class="w-5 h-5 text-primary" />
          </div>
          <div>
            <p class="text-sm font-medium text-text">{{ getFileName(documento.url_archivo) }}</p>
            <p class="text-xs text-text/70">Subido el {{ formatDate(documento.fecha_subida) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="handleDownload(documento)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :disabled="loading"
          >
            <DownloadIcon class="w-4 h-4 text-text/70" />
          </button>
          <button
            @click="handleDelete(documento)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :disabled="loading"
          >
            <TrashIcon class="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>

    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      @change="onFileSelected"
      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FileIcon, DownloadIcon, TrashIcon, UploadIcon } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { supabase } from '@/lib/supabase'
import type { Documento } from '@/composables/useSiniestros'

const props = defineProps<{
  idSiniestro: string
}>()

const documentos = ref<Documento[]>([])
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const toast = useToast()

const loadDocumentos = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('documentos_siniestros')
      .select('*')
      .eq('id_siniestro', props.idSiniestro)
      .order('fecha_subida', { ascending: false })

    if (error) throw error
    documentos.value = data || []
  } catch (error) {
    console.error('Error al cargar documentos:', error)
    toast.error('Error al cargar los documentos')
  } finally {
    loading.value = false
  }
}

const handleUpload = () => {
  fileInput.value?.click()
}

const onFileSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    loading.value = true
    
    // Validar tamaño del archivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('El archivo no debe superar los 10MB')
    }

    // Subir archivo a Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${props.idSiniestro}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('siniestros')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Crear registro en la tabla
    const { error: dbError } = await supabase
      .from('documentos_siniestros')
      .insert({
        id_siniestro: props.idSiniestro,
        url_archivo: filePath
      })

    if (dbError) throw dbError

    toast.success('Documento subido correctamente')
    await loadDocumentos()
  } catch (error) {
    console.error('Error al subir documento:', error)
    toast.error(error instanceof Error ? error.message : 'Error al subir el documento')
  } finally {
    loading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const handleDownload = async (documento: Documento) => {
  try {
    loading.value = true
    const { data, error } = await supabase.storage
      .from('siniestros')
      .download(documento.url_archivo)

    if (error) throw error

    // Crear URL y descargar
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = getFileName(documento.url_archivo)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error al descargar documento:', error)
    toast.error('Error al descargar el documento')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (documento: Documento) => {
  if (!confirm('¿Estás seguro de eliminar este documento?')) return

  try {
    loading.value = true

    // Eliminar archivo de Storage
    const { error: storageError } = await supabase.storage
      .from('siniestros')
      .remove([documento.url_archivo])

    if (storageError) throw storageError

    // Eliminar registro de la tabla
    const { error: dbError } = await supabase
      .from('documentos_siniestros')
      .delete()
      .eq('id_documento', documento.id_documento)

    if (dbError) throw dbError

    toast.success('Documento eliminado correctamente')
    await loadDocumentos()
  } catch (error) {
    console.error('Error al eliminar documento:', error)
    toast.error('Error al eliminar el documento')
  } finally {
    loading.value = false
  }
}

const getFileName = (path: string) => {
  return path.split('/').pop() || 'Documento'
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

onMounted(() => {
  loadDocumentos()
})
</script> 