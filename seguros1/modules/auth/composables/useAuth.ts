import axios from 'axios'

/**
 * Obtiene el accessToken del localStorage
 */
export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

/**
 * Obtiene el refreshToken del localStorage
 */
export function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}

/**
 * Refresca el accessToken usando el refreshToken
 */
export async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible')
    }

    const response = await axios.post('http://localhost:3000/refresh-token/', {
      refreshToken
    })

    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken)
      return response.data.accessToken
    } else {
      throw new Error('No se pudo renovar el token')
    }
  } catch (error) {
    console.error('Error al renovar token:', error)
    logout()
  }
}

/**
 * Cierra sesión y elimina los tokens
 */
export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '/login'
}