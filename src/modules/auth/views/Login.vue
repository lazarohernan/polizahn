<template>
  <div
    class="w-full lg:flex-1 lg:max-w-[600px] flex flex-col justify-center text-center lg:text-left -mr-6"
  >
    <h2
      class="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-semibold text-text leading-tight mb-0 transition-colors duration-300"
    >
      Bienvenido a tu<br />Plataforma de Seguros
    </h2>
  </div>
  <div class="w-full lg:flex-1 lg:max-w-[440px] flex flex-col items-center -ml-6">
    <div
      class="w-full max-w-[440px] rounded-2xl p-6 lg:p-8 bg-container-bg border border-container-border"
    >
      <div class="mb-4">
        <h2
          class="text-lg sm:text-xl lg:text-2xl font-semibold text-text transition-colors duration-300"
        >
          Plataforma de Seguros
        </h2>
      </div>
      <h1
        class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 text-text leading-tight transition-colors duration-300"
      >
        👋 Bienvenido a<br />Plataforma de Seguros
      </h1>
      <!-- Formulario de login con validación y feedback visual -->
      <form class="flex flex-col gap-4" @submit.prevent="onLogin">
        <!-- Campo de email con icono y validación -->
        <div class="flex flex-col w-full relative">
          <div
            class="relative rounded-xl bg-input-bg border border-input-border transition-all duration-300 overflow-hidden hover:border-primary hover:shadow-md focus-within:border-primary focus-within:shadow-lg"
          >
            <Mail
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text opacity-50 transition-all duration-300 group-focus-within:text-primary group-focus-within:opacity-100"
            />
            <input
              id="email"
              ref="inputEmailRef"
              v-model="myForm.email"
              type="email"
              class="w-full py-3 lg:py-4 px-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              aria-label="Correo electrónico"
              placeholder="Correo electrónico"
              required
              autocomplete="email"
            />
          </div>
        </div>

        <!-- Campo de contraseña con toggle de visibilidad -->
        <div class="flex flex-col w-full relative">
          <div
            class="relative rounded-xl bg-input-bg border border-input-border transition-all duration-300 overflow-hidden hover:border-primary hover:shadow-md focus-within:border-primary focus-within:shadow-lg"
          >
            <Lock
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text opacity-50 transition-all duration-300 group-focus-within:text-primary group-focus-within:opacity-100"
            />
            <input
              id="password"
              ref="inputPasswordRef"
              v-model="myForm.password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full py-3 lg:py-4 px-12 pr-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              aria-label="Contraseña"
              placeholder="Contraseña"
              required
              autocomplete="current-password"
            />
            <button
              :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none text-text opacity-50 cursor-pointer transition-all duration-200 flex items-center justify-center hover:opacity-100 hover:text-primary focus:outline-none focus:opacity-100 focus:text-primary"
              aria-controls="password"
              @click="togglePassword"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Mensaje de error con rol de alerta para accesibilidad -->
        <div v-if="error" class="text-red-500 text-center mt-2 text-sm" role="alert">
          {{ error }}
        </div>

        <!-- Botón de submit con estados de carga y hover -->
        <button
          :disabled="loading"
          :aria-label="loading ? 'Iniciando sesión...' : 'Iniciar sesión'"
          type="submit"
          class="w-full py-3 lg:py-4 bg-primary text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 mt-4 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>

        <!-- Mensaje de carga -->
        <div v-if="loading" class="text-center text-gray-600 mt-2 text-sm">Cargando...</div>

        <!-- Botón de recuperación de contraseña con borde -->
        <router-link
          :to="{ name: 'recover-password' }"
          class="w-full py-3 lg:py-4 border-2 border-[#64D3DD] text-text rounded-xl text-base font-medium cursor-pointer transition-all duration-300 mt-4 hover:bg-[#64D3DD]/10 flex items-center justify-center no-underline"
        >
          ¿Olvidaste tu contraseña?
        </router-link>

        <!-- Enlaces de términos y políticas -->
        <div class="flex items-center justify-center gap-3 mt-6 text-sm">
          <router-link
            :to="{ name: 'terminos-de-uso' }"
            class="text-text opacity-70 hover:text-[#64D3DD] transition-colors duration-300"
          >
            Términos de uso
          </router-link>
          <span class="text-text opacity-40">|</span>
          <router-link
            :to="{ name: 'politica-de-privacidad' }"
            class="text-text opacity-70 hover:text-[#64D3DD] transition-colors duration-300"
          >
            Política de privacidad
          </router-link>
        </div>
      </form>
    </div>
    <div class="text-text text-sm font-medium opacity-70 mt-[5px]">
      Desarrollado por ByteHN S de R L
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';
  import { useSupabaseAuth } from '@/composables/useSupabaseAuth';
  import { useAuthStore } from '../stores/auth-store';

  const router = useRouter();
  const { signIn } = useSupabaseAuth();
  const authStore = useAuthStore();

  const showPassword = ref(false);
  const inputEmailRef = ref<HTMLInputElement | null>(null);
  const inputPasswordRef = ref<HTMLInputElement | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const myForm = reactive({
    email: '',
    password: '',
  });

  const onLogin = async () => {
    error.value = null;
    loading.value = true;

    try {
      // Validaciones más estrictas
      if (!myForm.email.trim()) {
        throw new Error('El correo electrónico es obligatorio')
      }

      if (!myForm.password.trim()) {
        throw new Error('La contraseña es obligatoria')
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(myForm.email)) {
        throw new Error('Formato de correo electrónico inválido')
      }

      const { ok, error: signInError, user, role } = await signIn(
        myForm.email.trim(), 
        myForm.password.trim()
      );
      
      if (!ok || signInError) {
        throw new Error(signInError || 'Error al iniciar sesión')
      }

      if (!user) {
        throw new Error('No se pudo obtener la información del usuario')
      }

      // Inicializar el store con los datos del usuario
      await authStore.initialize();

      // Redireccionar según el rol
      const redirectMap: Record<string, string> = {
        admin: 'dashboard',
        tecnico: 'tecnico-dashboard',
        superadmin: 'admin-dashboard'
      };

      const defaultRedirect = 'dashboard';
      const redirectRoute = role && role in redirectMap ? redirectMap[role] : defaultRedirect;

      await router.replace({ name: redirectRoute });

    } catch (e) {
      console.error('Error durante el inicio de sesión:', e);
      error.value = e instanceof Error ? e.message : 'Error durante el inicio de sesión';
    } finally {
      loading.value = false;
    }
  };

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };
</script>
