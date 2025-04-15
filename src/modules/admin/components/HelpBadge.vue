<template>
  <div class="fixed right-4 z-[999] bottom-custom" @click.stop>
    <div class="relative" data-help-badge>
      <!-- Badge principal -->
      <button
        class="flex items-center gap-2 px-4 py-2 bg-primary text-white dark:text-gray-100 rounded-full shadow-lg hover:bg-primary-hover transition-colors duration-300"
        @click="isOpen = !isOpen"
      >
        <HelpCircle class="w-5 h-5 text-white dark:text-gray-100" />
        <span class="text-sm font-medium">¿Necesitas ayuda?</span>
      </button>

      <!-- Menú desplegable -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
      >
        <div
          v-if="isOpen"
          class="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-2 space-y-1">
            <button
              class="w-full flex items-center gap-3 p-3 text-sm text-text hover:bg-gray-100 hover:text-text dark:hover:bg-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
              @click="openDocumentation"
            >
              <FileText class="w-5 h-5 text-primary dark:text-primary" />
              <span>Ver documentación</span>
            </button>
            <button
              class="w-full flex items-center gap-3 p-3 text-sm text-text hover:bg-gray-100 hover:text-text dark:hover:bg-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
              @click="requestSupport"
            >
              <MessageCircle class="w-5 h-5 text-primary dark:text-primary" />
              <span>Solicitar asistencia</span>
            </button>
            <button
              class="w-full flex items-center gap-3 p-3 text-sm text-text hover:bg-gray-100 hover:text-text dark:hover:bg-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
              @click="reportProblem"
            >
              <AlertCircle class="w-5 h-5 text-red-500 dark:text-red-400" />
              <span>Reportar problema</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>

  <!-- Modal para reportar problema -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showReportModal"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1200]"
        @click="closeReportModal"
      >
        <div
          class="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          @click.stop
        >
          <!-- Encabezado del modal -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ ticketCreated ? 'Ticket enviado' : 'Reportar problema' }}
              </h3>
              <button 
                class="p-1 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                @click="closeReportModal"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Cuerpo del modal -->
          <div class="p-4">
            <!-- Formulario para reportar problema -->
            <form v-if="!ticketCreated" @submit.prevent="submitProblem">
              <!-- Título -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input 
                  v-model="problemData.title"
                  type="text" 
                  placeholder="Breve descripción del problema"
                  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                  maxlength="100"
                />
              </div>

              <!-- Descripción -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                <textarea 
                  v-model="problemData.description"
                  placeholder="Describe el problema con detalle"
                  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y"
                  rows="4"
                  required
                  maxlength="500"
                ></textarea>
              </div>

              <!-- Botones de acción -->
              <div class="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  @click="closeReportModal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  :disabled="loading"
                >
                  <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {{ loading ? 'Enviando...' : 'Enviar reporte' }}
                </button>
              </div>
            </form>

            <!-- Mensaje de éxito después de crear el ticket -->
            <div v-else class="text-center py-4">
              <div class="mb-4 flex justify-center">
                <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle class="w-12 h-12 text-green-500 dark:text-green-400" />
                </div>
              </div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">¡Ticket enviado correctamente!</h4>
              <p class="text-gray-700 dark:text-gray-300 mb-2">
                Tu ticket de soporte #{{ ticketId.substring(0, 8).toUpperCase() }} ha sido registrado.
              </p>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Puedes consultar el estado de tu solicitud en la sección de "Soporte" en tu perfil.
              </p>
              <button
                class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors duration-300"
                @click="closeReportModal"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { HelpCircle, FileText, MessageCircle, X, AlertCircle, CheckCircle } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

const toast = useToast();
const isOpen = ref(false);
const showReportModal = ref(false);
const loading = ref(false);
const ticketCreated = ref(false);
const ticketId = ref('');

const authStore = useAuthStore();
const { user, id_correduria } = storeToRefs(authStore);

// Datos del formulario
const problemData = ref({
  title: '',
  description: '',
});

const openDocumentation = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  // Aquí puedes redirigir a la documentación
  window.open('/documentacion', '_blank');
  isOpen.value = false;
};

const requestSupport = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  // Aquí puedes implementar la lógica para solicitar soporte
  toast.info('Función de soporte en desarrollo');
  isOpen.value = false;
};

const reportProblem = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  showReportModal.value = true;
  isOpen.value = false;
  // Asegurar que el estado está limpio al abrir el modal
  ticketCreated.value = false;
  ticketId.value = '';
};

const closeReportModal = () => {
  // Si se había creado un ticket, reiniciar todo el estado
  if (ticketCreated.value) {
    ticketCreated.value = false;
    ticketId.value = '';
  }
  showReportModal.value = false;
  resetForm();
};

const resetForm = () => {
  problemData.value = {
    title: '',
    description: '',
  };
};

const submitProblem = async () => {
  try {
    loading.value = true;
    
    if (!user.value?.id) {
      toast.error('Debes iniciar sesión para reportar un problema');
      return;
    }
    
    // Asegúrate de tener el ID de correduría
    if (!id_correduria.value) {
      await authStore.getUserProfile();
    }
    
    // Información del navegador y sistema para agregar a la descripción
    const userAgent = window.navigator.userAgent;
    const pageUrl = window.location.href;
    
    // Preparar la descripción completa con detalles técnicos
    const descripcionCompleta = `${problemData.value.description}\n\n--- Información técnica ---\nNavegador: ${userAgent}\nURL: ${pageUrl}\nFecha: ${new Date().toLocaleString()}`;
    
    // Crear nuevo ticket en la tabla tickets_soporte
    const { data, error } = await supabase
      .from('tickets_soporte')
      .insert({
        id_correduria: id_correduria.value,
        auth_user_id: user.value.id,
        asunto: problemData.value.title,
        descripcion: descripcionCompleta,
        estado: 'pendiente',
        fecha_creado: new Date().toISOString()
      })
      .select('id_ticket');
    
    if (error) {
      console.error('Error al crear ticket de soporte:', error);
      toast.error('Error al enviar el reporte. Inténtalo de nuevo más tarde.');
      return;
    }
    
    // Guardar el ID del ticket para mostrarlo
    if (data && data[0]) {
      ticketId.value = data[0].id_ticket;
      ticketCreated.value = true;
    }
    
    toast.success('Problema reportado correctamente. Te contactaremos pronto.');
    
  } catch (err) {
    console.error('Error al enviar el reporte:', err);
    toast.error('Error al enviar el reporte. Inténtalo de nuevo más tarde.');
  } finally {
    loading.value = false;
  }
};

// Cerrar el menú cuando se hace clic fuera
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('[data-help-badge]')) {
    isOpen.value = false;
  }
};

// Agregar y remover event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
.bottom-custom {
  bottom: 49px;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
