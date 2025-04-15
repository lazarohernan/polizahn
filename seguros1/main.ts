import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import './style.css';

// Configurar event listeners pasivos para mejorar el rendimiento de desplazamiento
const supportsPassive = (() => {
  let passive = false;
  try {
    const options = Object.defineProperty({}, 'passive', {
      get: function () {
        passive = true;
        return true;
      },
    });
    window.addEventListener('test', () => {}, options as EventListenerOptions);
    window.removeEventListener('test', () => {}, options as EventListenerOptions);
  } catch (e) {
    // Capturar error silenciosamente
  }
  return passive;
})();

if (supportsPassive) {
  const options = { passive: true };
  document.addEventListener('touchstart', () => {}, options);
  document.addEventListener('touchmove', () => {}, options);
  document.addEventListener('wheel', () => {}, options);
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueQueryPlugin);
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false,
});

app.mount('#app');
