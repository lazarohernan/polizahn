/**
 * RegistrationPending.vue
 * 
 * Vista de confirmación mostrada después de un registro exitoso.
 * Informa al usuario que su cuenta está pendiente de activación
 * y proporciona opciones para:
 * - Verificar el estado de la cuenta
 * - Volver al inicio de sesión
 * - Recibir notificaciones por correo
 */

<script setup lang="ts">
// Importación del icono de correo para feedback visual
import { Mail } from 'lucide-vue-next'
</script>

<template>
  <!-- Contenedor principal con fondo decorativo -->
  <div class="min-h-screen w-full bg-navy overflow-x-hidden bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%2220%22%20fill%3D%22%238CBFCF%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] bg-[length:60px_60px]">
    <div class="min-h-screen w-full flex items-center justify-center overflow-y-auto py-8 lg:h-screen">
      <div class="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 p-4 lg:p-8">
        <div class="w-full lg:flex-1 lg:max-w-[600px] flex flex-col justify-center text-center lg:text-left">
          <h2 class="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-4">Registro Exitoso<br>Plataforma de Seguros</h2>
        </div>
        <div class="w-full lg:flex-1 lg:max-w-[440px] flex justify-center lg:justify-end items-center">
          <div class="w-full max-w-[440px] rounded-2xl p-6 lg:p-8 bg-white border border-container-border shadow-lg">
            <div class="mb-4">
              <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-text transition-colors duration-300">ACCO</h2>
            </div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 text-text leading-tight transition-colors duration-300">✅ Registro Completado</h1>
            <!-- Mensaje de estado con icono y texto informativo -->
            <div class="bg-input-bg rounded-xl p-6 my-6 text-center relative">
              <Mail class="w-8 h-8 text-primary mb-4 mx-auto" />
              <p class="text-lg text-text mb-4 leading-relaxed">
                Tu cuenta ha sido registrada exitosamente y está pendiente de activación por un administrador.
              </p>
              <p class="text-sm text-text opacity-80">
                Te notificaremos por correo electrónico cuando tu cuenta sea activada.
              </p>
            </div>
            
            <!-- Botones de acción y navegación -->
            <div class="flex flex-col gap-4 mt-8">
              <!-- Botón principal para verificar estado -->
              <router-link 
                to="/check-status" 
                class="w-full py-3 lg:py-4 bg-primary text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 text-center hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-hover"
              >
                Verificar Estado de Cuenta
              </router-link>
              <!-- Enlace secundario para volver al login -->
              <router-link 
                to="/login" 
                class="text-center text-primary no-underline py-3 rounded-xl transition-all duration-300 hover:bg-input-bg hover:text-primary-hover"
              >
                Volver al Inicio de Sesión
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
