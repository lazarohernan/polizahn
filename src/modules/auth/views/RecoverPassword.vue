<template>
  <div class="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-0 gap-8 lg:gap-4">
    <div
      class="w-full lg:flex-1 lg:max-w-[600px] flex flex-col justify-center text-center lg:text-left"
    >
      <h2
        class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-text leading-tight mb-3 transition-colors duration-300"
      >
        Recupera el acceso<br />a tu cuenta
      </h2>
      <p class="text-sm md:text-sm lg:text-base font-medium tracking-wider text-primary uppercase mb-0 max-w-full">
        <span class="sm:hidden">TE ENVIAREMOS INSTRUCCIONES<br/>PARA RESTABLECER<br/>TU CONTRASEÑA</span>
        <span class="hidden sm:inline">TE ENVIAREMOS INSTRUCCIONES PARA RESTABLECER TU CONTRASEÑA</span>
      </p>
    </div>
    <div class="w-full lg:flex-1 max-w-[400px] lg:max-w-[440px] flex flex-col items-center">
      <div
        class="w-full rounded-2xl p-6 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 border border-primary shadow-xl transform transition-all duration-300 hover:shadow-2xl"
      >
        <div class="mb-5 md:mb-6 flex items-center justify-center lg:justify-start">
          <div class="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center mr-3">
            <Lock class="w-5 h-5 md:w-5 md:h-5 text-white" />
          </div>
          <h2
            class="text-lg sm:text-lg md:text-xl lg:text-2xl font-semibold text-primary dark:text-primary transition-colors duration-300"
          >
            SegurosHN
          </h2>
        </div>

        <!-- Formulario de recuperación con validación y feedback visual -->
        <form class="flex flex-col gap-4 md:gap-4" @submit.prevent="onSubmit">
          <!-- Campo de email con icono y validación -->
          <div class="flex flex-col w-full relative">
            <div
              class="relative rounded-xl bg-input-bg border border-input-border transition-all duration-300 overflow-hidden hover:border-primary hover:shadow-md focus-within:border-primary focus-within:shadow-lg"
            >
              <Mail
                class="absolute left-4 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-5 md:h-5 text-primary opacity-70 transition-all duration-300 group-focus-within:text-primary group-focus-within:opacity-100"
              />
              <input
                id="email"
                ref="inputEmailRef"
                v-model="email"
                type="email"
                class="w-full py-3 md:py-3 lg:py-4 pl-12 md:pl-12 pr-4 md:pr-4 border-none rounded-xl bg-transparent text-input-text text-base md:text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
                aria-label="Correo electrónico"
                placeholder="Correo electrónico"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Mensaje de error con rol de alerta para accesibilidad -->
          <div v-if="error" class="text-red-500 text-center mt-2 md:mt-2 text-sm md:text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded-lg" role="alert">
            <AlertCircle class="w-4 h-4 md:w-4 md:h-4 inline-block mr-1" />
            {{ error }}
          </div>

          <!-- Botón de submit con estados de carga y hover -->
          <button
            :disabled="loading"
            :aria-label="loading ? 'Enviando instrucciones...' : 'Enviar instrucciones'"
            type="submit"
            class="w-full py-3 md:py-3 lg:py-4 bg-primary text-white border-none rounded-xl text-base md:text-base font-medium cursor-pointer transition-all duration-300 mt-1 md:mt-2 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center"
          >
            <span v-if="loading" class="inline-block w-4 h-4 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ loading ? 'Enviando instrucciones...' : 'Enviar instrucciones' }}
          </button>

          <!-- Mensaje de carga -->
          <div v-if="loading" class="text-center text-gray-600 dark:text-gray-400 mt-1 md:mt-1 text-sm md:text-sm">Verificando correo electrónico...</div>

          <!-- Botón para volver al login -->
          <router-link
            :to="{ name: 'login' }"
            class="w-full py-3 md:py-3 lg:py-4 border-2 border-primary/20 bg-transparent text-primary dark:text-primary-hover rounded-xl text-base md:text-base font-medium cursor-pointer transition-all duration-300 mt-2 md:mt-2 hover:bg-primary/5 flex items-center justify-center no-underline"
          >
            <ArrowLeft class="w-4 h-4 md:w-4 md:h-4 mr-2" />
            Volver al inicio de sesión
          </router-link>

          <!-- Enlaces de términos y políticas -->
          <div class="flex items-center justify-center gap-3 mt-5 md:mt-6 text-sm md:text-sm">
            <router-link
              :to="{ name: 'terminos-de-uso' }"
              class="text-text opacity-70 hover:text-primary transition-colors duration-300"
            >
              Términos de uso
            </router-link>
            <span class="text-text opacity-40">|</span>
            <router-link
              :to="{ name: 'politica-de-privacidad' }"
              class="text-text opacity-70 hover:text-primary transition-colors duration-300"
            >
              Política de privacidad
            </router-link>
          </div>
        </form>
      </div>
      <div class="text-text text-sm md:text-sm font-medium opacity-70 mt-4 md:mt-4 bg-white dark:bg-gray-800 px-4 md:px-4 py-2 md:py-2 rounded-full">
        Desarrollado por ByteHN S de R L
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-vue-next';

  const inputEmailRef = ref<HTMLInputElement | null>(null);
  const email = ref('');
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const onSubmit = async () => {
    error.value = null;
    loading.value = true;

    try {
      // Validaciones más estrictas
      if (!email.value.trim()) {
        throw new Error('El correo electrónico es obligatorio');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        throw new Error('Formato de correo electrónico inválido');
      }

      // TODO: Implementar lógica para enviar correo de recuperación
      // Simular un retraso para la demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Si todo es exitoso, mostrar mensaje
      alert('Se ha enviado un correo con instrucciones para recuperar tu contraseña');
      
    } catch (e) {
      console.error('Error durante el proceso de recuperación:', e);
      error.value = e instanceof Error ? e.message : 'Error durante el proceso de recuperación';
    } finally {
      loading.value = false;
    }
  };
</script>
