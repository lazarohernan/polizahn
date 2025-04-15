import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Función para obtener un nuevo accessToken con el refreshToken
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken'); // Obtener el refreshToken del localStorage

  if (!refreshToken) {
    console.error('No hay refreshToken disponible');
    return null;
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/refresh-token`, {
      refreshToken,
    });
    const { accessToken } = response.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken); // Guardar el nuevo accessToken
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; // Actualizar Axios
      return accessToken;
    }
  } catch (error) {
    console.error('Error al refrescar el accessToken', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('nombre');
    localStorage.removeItem('correo');
    localStorage.removeItem('foto');

    window.location.href = '/auth/login';
  }

  return null;
};

// Interceptor para añadir el token a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores cuando el token expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.data?.message === 'Token expirado' &&
      error.response?.data?.refresh === true
    ) {
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Reintentar la petición original
      }
    }

    return Promise.reject(error);
  },
);

export { api };
