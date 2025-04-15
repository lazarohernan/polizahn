/** * CheckRegistrationStatus.vue * * Vista para verificar el estado de activación de una cuenta. *
/** * CheckRegistrationStatus.vue * * Vista para verificar el estado de activación de una cuenta. *
Características: * - Formulario de verificación por email * - Múltiples estados de cuenta
(pendiente, aprobada, no encontrada) * - Feedback visual con iconos y mensajes * - Diseño responsivo
y accesible */

<script setup lang="ts">
  // Importaciones necesarias para iconos y funcionalidad
  import { ref } from 'vue';
  import { Mail, CheckCircle, Clock, AlertCircle } from 'lucide-vue-next';

  // Estado de la cuenta con tipos definidos
  const accountStatus = ref<'pending' | 'approved' | 'not-found' | null>(null);

  /**
   * Verifica el estado de la cuenta
   * - Maneja el envío del formulario
   * - Actualiza el estado según la respuesta
   * - Maneja errores si la cuenta no existe
   */
  const checkStatus = async () => {
    /*try {
    await handleSubmit()
    // Aquí simularemos un estado, pero en realidad vendría de la API
    accountStatus.value = 'pending'
  } catch (e) {
    accountStatus.value = 'not-found'
  } */
  };
</script>

<template>
  <div
    class="min-h-screen w-full bg-navy overflow-x-hidden bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%2220%22%20fill%3D%22%238CBFCF%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] bg-[length:60px_60px]"
  >
    <div
      class="min-h-screen w-full flex items-center justify-center overflow-y-auto py-8 lg:h-screen"
    >
      <div
        class="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 p-4 lg:p-8"
      >
        <div
          class="w-full lg:flex-1 lg:max-w-[600px] flex flex-col justify-center text-center lg:text-left"
        >
          <h2
            class="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-4"
          >
            Verificar Estado<br />de tu Cuenta
          </h2>
        </div>
        <div
          class="w-full lg:flex-1 lg:max-w-[440px] flex justify-center lg:justify-end items-center"
        >
          <div
            class="w-full max-w-[440px] rounded-2xl p-6 lg:p-8 bg-white border border-container-border shadow-lg"
          >
            <div class="mb-4">
              <h2
                class="text-lg sm:text-xl lg:text-2xl font-semibold text-text transition-colors duration-300"
              >
                ACCO
              </h2>
            </div>
            <h1
              class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 text-text leading-tight transition-colors duration-300"
            >
              🔍 Verificar Estado
            </h1>
            <p class="text-base lg:text-lg text-text opacity-90 mb-6">
              Ingresa tu correo electrónico para verificar el estado de tu cuenta.
            </p>

            <form class="flex flex-col gap-4" @submit.prevent="checkStatus">
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
                    placeholder="Correo electrónico"
                    required
                    aria-label="Correo electrónico"
                    autocomplete="email"
                  />
                </div>
              </div>

              <!-- <div v-if="error" class="text-red-500 text-center mt-2 text-sm" role="alert">{{ error }}</div> -->

              <!-- Panel de estado con diferentes mensajes según el estado -->
              <div
                v-if="accountStatus"
                class="bg-input-bg rounded-xl p-6 my-6 text-center relative"
              >
                <!-- Estado: Cuenta pendiente de activación -->
                <template v-if="accountStatus === 'pending'">
                  <Clock class="w-8 h-8 text-primary mb-4 mx-auto" />
                  <p class="text-lg text-text mb-4 leading-relaxed">
                    Tu cuenta está pendiente de activación. Te notificaremos cuando sea aprobada.
                  </p>
                </template>

                <!-- Estado: Cuenta aprobada y activa -->
                <template v-if="accountStatus === 'approved'">
                  <CheckCircle class="w-8 h-8 text-green-500 mb-4 mx-auto" />
                  <p class="text-lg text-text mb-4 leading-relaxed">
                    ¡Tu cuenta ha sido aprobada! Ya puedes iniciar sesión con tus credenciales.
                  </p>
                </template>

                <!-- Estado: Cuenta no encontrada -->
                <template v-if="accountStatus === 'not-found'">
                  <AlertCircle class="w-8 h-8 text-red-500 mb-4 mx-auto" />
                  <p class="text-lg text-text mb-4 leading-relaxed">
                    No encontramos una cuenta registrada con este correo electrónico.
                  </p>
                </template>
              </div>

              <!-- <button 
                type="submit" 
                class="w-full py-3 lg:py-4 bg-primary text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 mt-4 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                :disabled="loading"
                aria-label="Verificar estado de cuenta"
              >
                {{ loading ? 'Verificando...' : 'Verificar Estado' }}
              </button> -->

              <div class="flex flex-col gap-4 mt-4">
                <router-link
                  to="/login"
                  class="text-center text-primary no-underline py-3 rounded-xl transition-all duration-300 hover:bg-input-bg hover:text-primary-hover"
                >
                  Volver al Inicio de Sesión
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
