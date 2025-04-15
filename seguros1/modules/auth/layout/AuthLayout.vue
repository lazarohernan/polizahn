<template>
  <!-- Contenedor principal con fondo decorativo -->
  <div
    class="min-h-screen w-full bg-navy overflow-x-hidden bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%2220%22%20fill%3D%22%238CBFCF%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] bg-[length:60px_60px]"
  >
    <div
      class="min-h-screen w-full flex items-center justify-center overflow-y-auto py-8 lg:h-screen"
    >
      <div
        class="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 p-4 lg:p-8"
      >
        <RouterView />
      </div>
    </div>
  </div>
</template>
