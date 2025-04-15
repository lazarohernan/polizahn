import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import { defineStore } from 'pinia';
import { AuthStatus } from '../interfaces';
import { checkAuthAction, loginAction, registerAction } from '../actions';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const accessToken = ref(useLocalStorage('accessToken', ''));
  const refreshToken = ref(useLocalStorage('refreshToken', ''));
  const nombre = ref(useLocalStorage('nombre', ''));
  const correo = ref(useLocalStorage('correo', ''));
  const foto = ref(useLocalStorage('foto', ''));
  const id_correduria = ref(useLocalStorage('id_correduria', ''));

  //Funciones
  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);
      if (!loginResp.ok) {
        return logout();
      }

      //Esta condición es NECESARIA para poder acceder a los valores dentro
      //de LoginSuccess
      if ('accessToken' in loginResp && 'refreshToken' in loginResp) {
        accessToken.value = loginResp.accessToken;
        refreshToken.value = loginResp.refreshToken;
        nombre.value = loginResp.nombre;
        correo.value = loginResp.correo;
        foto.value = loginResp.foto;
        id_correduria.value = loginResp.id_correduria;
      }
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      console.log(error);
      return logout();
    }
  };

  //REGISTER
  const register = async (fullName: string, email: string, password: string) => {
    try {
      const registerResp = await registerAction(fullName, email, password);
      if (!registerResp.ok) {
        return logout();
      }

      if ('refreshToken' in registerResp && 'accessToken' in registerResp) {
        accessToken.value = registerResp.accessToken;
        refreshToken.value = registerResp.refreshToken;
      }

      authStatus.value = AuthStatus.Authenticated;
      return true;
    } catch (error) {
      console.log(error);
      return logout();
    }
  };

  //CHECK AUTH STATUS (RENEW TOKEN)
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction();

      if (!statusResp.ok) {
        return logout();
      }

      if ('ok' in statusResp && 'id_usuario' in statusResp) {
        authStatus.value = AuthStatus.Authenticated;
      }
      return true;
    } catch (error) {
      console.error(error);
      return logout();
    }
  };

  //LOGOUT
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    accessToken.value = '';
    refreshToken.value = '';
    nombre.value = '';
    correo.value = '';
    foto.value = '';
    id_correduria.value = '';
    authStatus.value = AuthStatus.Unauthenticated;
    return false;
  };

  return {
    //Properties
    accessToken,
    refreshToken,
    authStatus,
    nombre,
    correo,
    foto,
    id_correduria,

    //Getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    //Actions
    login,
    logout,
    register,
    checkAuthStatus,
  };
});
