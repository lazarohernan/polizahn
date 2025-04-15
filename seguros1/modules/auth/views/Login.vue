<template>
  <div
    class="w-full lg:flex-1 lg:max-w-[600px] flex flex-col justify-center text-center lg:text-left"
  >
    <h2
      class="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-4"
    >
      Bienvenido a tu<br />Plataforma de Seguros
    </h2>
  </div>
  <div class="w-full lg:flex-1 lg:max-w-[440px] flex justify-center lg:justify-end items-center">
    <div
      class="w-full max-w-[440px] rounded-2xl p-6 lg:p-8 bg-white border border-container-border shadow-lg"
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

        <!-- Enlaces de navegación y recuperación -->
        <p class="text-center text-sm text-text opacity-80 mt-4">
          ¿No tienes una cuenta?
          <router-link
            class="text-primary no-underline transition-colors duration-300 hover:text-primary-hover hover:underline"
            :to="{ name: 'register' }"
            >Regístrate</router-link
          ><br />
          ¿Olvidaste tu contraseña?
          <router-link
            class="text-primary no-underline transition-colors duration-300 hover:text-primary-hover hover:underline"
            :to="{ name: 'recover-password' }"
            >Recupérala aquí</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Importaciones necesarias
  import { ref, reactive } from 'vue';
  import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next';
  import { useAuthStore } from '../stores/auth-store';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();

  // Store y estado local
  //const authStore = useAuthStore()
  const showPassword = ref(false); // Controla la visibilidad de la contraseña

  //! conectar un elemento del DOM con una variable de vue
  //! En este caso un elemento de tipo Input
  const inputEmailRef = ref<HTMLInputElement | null>(null);
  const inputPasswordRef = ref<HTMLInputElement | null>(null);

  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const myForm = reactive({
    email: '',
    password: '',
  });

  const onLogin = async () => {
    error.value = null; // Reiniciar error al intentar iniciar sesión
    loading.value = true; // Activar estado de carga

    // Validaciones para el email
    if (myForm.email === '') {
      error.value = 'El correo electrónico es obligatorio';
      loading.value = false;
      return inputEmailRef.value?.focus();
    }

    // Validaciones para el password
    if (myForm.password === '') {
      error.value = 'La contraseña es obligatoria';
      loading.value = false;
      return inputPasswordRef.value?.focus();
    }

    // Intentar iniciar sesión
    const ok = await authStore.login(myForm.email, myForm.password);

    if (!ok) {
      error.value = 'Credenciales incorrectas';
      loading.value = false; // Desactivar estado de carga
      return;
    }

    loading.value = false; // Desactivar estado de carga

    router.replace({ name: 'dashboard' });
  };

  //* Alterna la visibilidad del campo de contraseña
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };
</script>
