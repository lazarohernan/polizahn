<!--
  ImageUploader.vue
  
  Componente reutilizable para subir y procesar imágenes.
  Características:
  - Drag & drop de imágenes
  - Optimización automática
  - Recorte de imagen
  - Previsualización
  - Emisión de eventos con imagen y color
-->

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ColorThief from 'colorthief'
import { Upload, Image as ImageIcon, X, Check, ImageOff, Trash2 } from 'lucide-vue-next'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import type { CropperRef } from '@/types/cropper'

interface ImageData {
  url: string
  file: File | null
  dominantColor: string | null
}

const props = defineProps<{
  initialImage?: string
  aspectRatio?: number
  maxSize?: number // en bytes
}>()

const emit = defineEmits<{
  update: [data: { url: string; dominantColor: string | null }]
}>()

const imageData = ref<ImageData>({
  url: props.initialImage || '',
  file: null,
  dominantColor: null
})

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<HTMLImageElement | null>(null)
const showCropper = ref(false)
const cropperImage = ref('')
const cropperRef = ref<CropperRef | null>(null)

// Computar el estilo del área de drop basado en el estado
const dropAreaClasses = computed(() => ({
  'border-primary bg-primary/5': isDragging.value,
  'border-input-border bg-input-bg': !isDragging.value
}))

// Manejar el drag & drop
const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  if (e.dataTransfer?.files.length) {
    await handleFile(e.dataTransfer.files[0])
  }
}

// Manejar la selección de archivo
const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    await handleFile(target.files[0])
  }
}

// Procesar el archivo
const handleFile = async (file: File) => {
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    console.error('El archivo debe ser una imagen')
    return
  }

  // Validar tamaño
  if (props.maxSize && file.size > props.maxSize) {
    console.error('La imagen es demasiado grande')
    return
  }

  // Crear URL temporal
  const url = URL.createObjectURL(file)
  cropperImage.value = url
  showCropper.value = true
}

// Manejar el recorte de imagen
const handleCrop = () => {
  if (!cropperRef.value) return
  
  const cropData = cropperRef.value.getResult()
  const canvas = cropData.canvas
  const type = 'image/jpeg'
  const quality = 0.8
  
  // Optimizar imagen
  const optimizedImage = canvas.toDataURL(type, quality)
  
  // Extraer color dominante
  const colorThief = new ColorThief()
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.src = optimizedImage
  
  img.onload = () => {
    const color = colorThief.getColor(img)
    const dominantColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    
    // Actualizar estado
    imageData.value = {
      url: optimizedImage,
      file: null,
      dominantColor
    }
    
    // Emitir evento
    emit('update', {
      url: optimizedImage,
      dominantColor
    })
    
    showCropper.value = false
  }
}

// Eliminar imagen
const handleDelete = () => {
  imageData.value = {
    url: '',
    file: null,
    dominantColor: null
  }
  
  emit('update', {
    url: '',
    dominantColor: null
  })
}

// Trigger click en input file
const triggerFileInput = () => {
  fileInput.value?.click()
}

watch(() => props.initialImage, (newValue) => {
  if (newValue) {
    imageData.value.url = newValue
    
    // Extraer color dominante
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = newValue
    
    img.onload = () => {
      const colorThief = new ColorThief()
      const color = colorThief.getColor(img)
      imageData.value.dominantColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="w-full">
    <!-- Área de drop -->
    <div
      class="relative w-full min-h-[200px] border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      :class="dropAreaClasses"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover.prevent
      @drop="handleDrop"
      @click="triggerFileInput"
    >
      <!-- Previsualización de imagen -->
      <template v-if="imageData.url">
        <img 
          ref="imagePreview"
          :src="imageData.url"
          :alt="'Previsualización'"
          class="absolute inset-0 w-full h-full object-cover"
          :style="{ aspectRatio: aspectRatio }"
          crossorigin="anonymous"
        />
        <!-- Botón eliminar -->
        <button
          class="absolute top-2 right-2 p-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 text-white transition-all duration-300 hover:bg-black/30 hover:scale-110 z-10"
          @click.stop="handleDelete"
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </template>
      <template v-else>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ImageOff class="w-8 h-8 text-primary" />
          </div>
          <div class="text-center">
            <p class="text-text/70 text-sm font-medium">No hay imagen subida</p>
            <p class="text-text/50 text-xs mt-1">
              Sube o arrastra una imagen en formato PNG, JPG o GIF
              <template v-if="maxSize">
                <br>Tamaño máximo: {{ Math.round(maxSize / 1024 / 1024) }}MB
              </template>
            </p>
          </div>
        </div>
      </template>
      
      <!-- Overlay con instrucciones -->
      <div
        class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <Upload v-if="!imageData.url" class="w-6 h-6 text-white" />
          <ImageIcon v-else class="w-6 h-6 text-white" />
        </div>
        <div class="text-center">
          <p class="text-white text-sm font-medium">
            {{ imageData.url ? 'Haz clic para cambiar la imagen' : 'Arrastra una imagen o haz clic para seleccionar' }}
          </p>
          <p class="text-white/70 text-xs mt-1">
            PNG, JPG o GIF
            <template v-if="maxSize">
              (máx. {{ Math.round(maxSize / 1024 / 1024) }}MB)
            </template>
          </p>
        </div>
      </div>
    </div>

    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/*"
      @change="handleFileSelect"
    />
    
    <!-- Modal de recorte -->
    <div
      v-if="showCropper"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center"
      @click.self="showCropper = false"
    >
      <div class="w-full max-w-md bg-background rounded-2xl p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-text">Recortar imagen</h3>
          <button
            class="p-2 rounded-xl bg-input-bg border border-input-border text-text transition-all duration-300 hover:bg-container-bg"
            @click="showCropper = false"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="relative aspect-square w-full mb-4 bg-input-bg rounded-xl overflow-hidden">
          <Cropper
            v-if="cropperImage"
            ref="cropperRef"
            class="w-full h-full"
            :src="cropperImage"
            :stencil-props="{
              aspectRatio: aspectRatio
            }"
          />
          <template v-else>
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageOff class="w-8 h-8 text-primary" />
              </div>
              <div class="text-center">
                <p class="text-text/70 text-sm font-medium">No hay imagen subida</p>
                <p class="text-text/50 text-xs mt-2">
                  Sube o arrastra una imagen en formato PNG, JPG o GIF
                  <template v-if="maxSize">
                    <br>Tamaño máximo: {{ Math.round(maxSize / 1024 / 1024) }}MB
                  </template>
                </p>
              </div>
            </div>
          </template>
        </div>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-container-bg"
            @click="showCropper = false"
          >
            Cancelar
          </button>
          <button
            v-if="cropperImage"
            class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover"
            @click="handleCrop"
          >
            <Check class="w-4 h-4" />
            <span>Aplicar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vue-advanced-cropper {
  background: transparent !important;
}
.vue-advanced-cropper__background {
  background: var(--color-input-bg) !important;
  opacity: 0.5 !important;
}
.vue-advanced-cropper__foreground {
  border-radius: 0.75rem !important;
}
.vue-advanced-cropper__stencil {
  border-radius: 0.75rem !important;
}
</style>
