<template>
  <div
    class="w-full lg:flex-1 lg:max-w-[600px] flex flex-col justify-center text-center lg:text-left"
  >
    <h2
      class="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-4"
    >
      Obtén una verdadera<br />Plataforma de Seguros
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
      <!-- Formulario de registro con validación y feedback visual -->
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- Campo de nombre con icono y estados de hover/focus -->
        <div class="flex flex-col w-full relative">
          <div
            class="relative rounded-xl bg-input-bg border border-input-border transition-all duration-300 overflow-hidden hover:border-primary hover:shadow-md focus-within:border-primary focus-within:shadow-lg"
          >
            <User
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text opacity-50 transition-all duration-300 group-focus-within:text-primary group-focus-within:opacity-100"
            />
            <input
              id="name"
              type="text"
              class="w-full py-3 lg:py-4 px-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              aria-label="Nombre completo"
              placeholder="Nombre completo"
              autocomplete="name"
              required
            />
          </div>
        </div>

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
              type="email"
              class="w-full py-3 lg:py-4 px-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              aria-label="Correo electrónico"
              placeholder="Correo electrónico"
              autocomplete="email"
              required
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
              :type="showPassword ? 'text' : 'password'"
              class="w-full py-3 lg:py-4 px-12 pr-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              aria-label="Contraseña"
              placeholder="Contraseña"
              autocomplete="current-password"
              required
            />
            <button
              :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none text-text opacity-50 cursor-pointer transition-all duration-200 flex items-center justify-center hover:opacity-100 hover:text-primary focus:outline-none focus:opacity-100 focus:text-primary"
              @click="togglePassword"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Campo de confirmación de contraseña con toggle de visibilidad -->
        <div class="flex flex-col w-full relative">
          <div
            class="relative rounded-xl bg-input-bg border border-input-border transition-all duration-300 overflow-hidden hover:border-primary hover:shadow-md focus-within:border-primary focus-within:shadow-lg"
          >
            <Lock
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text opacity-50 transition-all duration-300 group-focus-within:text-primary group-focus-within:opacity-100"
            />
            <input
              id="confirm-password"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full py-3 lg:py-4 px-12 pr-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              aria-label="Confirmar contraseña"
              placeholder="Confirmar contraseña"
              autocomplete="current-password"
              required
            />
            <button
              :title="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none text-text opacity-50 cursor-pointer transition-all duration-200 flex items-center justify-center hover:opacity-100 hover:text-primary focus:outline-none focus:opacity-100 focus:text-primary"
              @click="toggleConfirmPassword"
            >
              <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Checkbox de términos y condiciones con estilo personalizado -->
        <label class="relative pl-7 cursor-pointer text-sm select-none text-text">
          <input
            v-model="acceptTerms"
            type="checkbox"
            class="peer sr-only"
            @change="showError = false"
          />
          <span
            class="absolute top-0 left-0 h-5 w-5 bg-input-bg border border-input-border rounded transition-all duration-200 hover:border-primary peer-checked:bg-primary peer-checked:border-primary after:content-[''] after:absolute after:hidden after:left-[6px] after:top-[2px] after:w-[6px] after:h-[12px] after:border-r-2 after:border-b-2 after:border-white after:rotate-45 peer-checked:after:block"
          ></span>
          <span class="leading-5 text-sm">
            He leído y acepto los
            <router-link
              to="/terminos-de-uso"
              class="text-primary no-underline font-medium hover:underline"
              >Términos de Uso</router-link
            >
            y la
            <router-link
              to="/politica-de-privacidad"
              class="text-primary no-underline font-medium hover:underline"
              >Política de Privacidad</router-link
            >
          </span>
          <span v-if="showError" class="text-red-500 text-center mt-2 text-sm block">
            Debes aceptar los términos y la política de privacidad para continuar
          </span>
        </label>

        <!-- Botón de submit con estados de carga y hover -->
        <button
          type="submit"
          class="w-full py-3 lg:py-4 bg-primary text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 mt-4 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-hover"
          aria-label="Registrarse"
        >
          Registrarse
        </button>

        <!-- Enlaces de navegación -->
        <p class="text-center text-sm text-text opacity-80 mt-4">
          ¿Ya tienes una cuenta?
          <router-link
            class="text-primary no-underline transition-colors duration-300 hover:text-primary-hover hover:underline"
            :to="{ name: 'login' }"
            >Iniciar sesión</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Importaciones necesarias para iconos y funcionalidades
  import { ref } from 'vue';
  import { User, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next';

  // Estados del formulario
  const acceptTerms = ref(false); // Control de aceptación de términos
  const showError = ref(false); // Estado de error en términos
  const showPassword = ref(false); // Toggle de visibilidad de contraseña
  const showConfirmPassword = ref(false); // Toggle de visibilidad de confirmación

  /**
   * Maneja el envío del formulario de registro
   * Valida la aceptación de términos antes de proceder
   */
  const handleSubmit = () => {
    if (!acceptTerms.value) {
      showError.value = true;
      return;
    }
    showError.value = false;
    // Continue with registration...
  };

  /**
   * Alterna la visibilidad de la contraseña
   */
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  /**
   * Alterna la visibilidad de la confirmación de contraseña
   */
  const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };
</script>
