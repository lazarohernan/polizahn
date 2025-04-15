import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/composables/useToast'

const BUCKET_NAME = 'avatars'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Obtener la URL base y la key de Supabase para uso en la subida alternativa
// Usar la URL y clave directamente de la instancia de Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Imprimir para depuración, sin mostrar la clave completa
console.log('SUPABASE URL disponible:', SUPABASE_URL ? 'Sí' : 'No')
console.log('SUPABASE KEY disponible:', SUPABASE_ANON_KEY ? 'Sí (ocultada por seguridad)' : 'No')

interface FileValidationResult {
  isValid: boolean
  error?: string
}

interface UploadAvatarResult {
  url: string
  error: string | null
}

export const useAvatarStorage = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const toast = useToast()

  const validateFile = (file: File): FileValidationResult => {
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'El archivo no debe superar los 5MB'
      }
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'El archivo debe ser una imagen (JPG, PNG, GIF o WEBP)'
      }
    }

    return { isValid: true }
  }

  /**
   * Extrae el nombre del archivo de una URL
   */
  const getFilenameFromUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url)
      const pathSegments = parsedUrl.pathname.split('/')
      // El último segmento debería ser el nombre del archivo
      const filename = pathSegments[pathSegments.length - 1]
      return filename
    } catch (e) {
      console.error('Error al parsear URL:', e)
      return null
    }
  }

  /**
   * Elimina un avatar antiguo del bucket
   */
  const deleteOldAvatar = async (avatarUrl: string | null): Promise<boolean> => {
    if (!avatarUrl) return true
    
    try {
      // Extraer el nombre del archivo de la URL
      const filename = getFilenameFromUrl(avatarUrl)
      if (!filename) return false
      
      console.log('Eliminando avatar antiguo:', filename)
      
      // Eliminar el archivo del bucket
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filename])
      
      if (deleteError) {
        console.error('Error al eliminar avatar antiguo:', deleteError)
        return false
      }
      
      console.log('Avatar antiguo eliminado con éxito')
      return true
    } catch (error) {
      console.error('Error en proceso de eliminación:', error)
      return false
    }
  }

  /**
   * Sube un avatar desde un dataUrl (generado por ImageUploader)
   */
  const uploadAvatar = async (dataUrl: string, userId: string): Promise<UploadAvatarResult> => {
    if (!dataUrl) {
      return { url: '', error: 'No se proporcionó ninguna imagen' }
    }

    try {
      loading.value = true
      error.value = null

      console.log('Iniciando proceso de subida de avatar')

      // Obtener usuario actual
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          throw new Error('No se encontró usuario autenticado')
        }
        userId = user.id
      }

      // Extraer información del tipo de imagen de forma más robusta
      let mimeType = 'image/jpeg' // Predeterminado
      let fileExtension = '.jpg' // Valor predeterminado

      // Analizar mejor el dataUrl para obtener el tipo MIME exacto
      if (dataUrl.startsWith('data:')) {
        const matches = dataUrl.match(/^data:([^;]+);base64,/)
        if (matches && matches.length > 1) {
          mimeType = matches[1]
          console.log('Tipo MIME detectado:', mimeType)
          
          // Asignar extensión basada en el tipo MIME detectado
          if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
            fileExtension = '.jpg'
          } else if (mimeType.includes('png')) {
            fileExtension = '.png'
          } else if (mimeType.includes('gif')) {
            fileExtension = '.gif'
          } else if (mimeType.includes('webp')) {
            fileExtension = '.webp'
          }
        }
      }

      // Generar un nombre de archivo único
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const filename = `avatar-${userId.substring(0, 8)}-${timestamp}-${randomStr}${fileExtension}`
      
      console.log('Nombre de archivo generado:', filename)

      // Obtener la parte base64 pura (eliminar el prefijo data:image/XXX;base64,)
      const base64Data = dataUrl.split(',')[1]
      if (!base64Data) {
        throw new Error('Formato de imagen inválido')
      }

      // Convertir directamente el base64 a blob
      const byteCharacters = atob(base64Data)
      const byteArrays = []
      const sliceSize = 512
      
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)
        const byteNumbers = new Array(slice.length)
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      
      const blob = new Blob(byteArrays, { type: mimeType })
      const file = new File([blob], filename, { type: mimeType })
      
      console.log(`Archivo preparado: ${file.name} (${file.size} bytes)`)

      // Validar el tamaño del archivo
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`La imagen excede el tamaño máximo permitido (${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`)
      }

      // Obtener URL de avatar actual para eliminarla después
      let currentAvatarUrl: string | null = null
      
      // Primero intentar obtener desde la tabla perfiles
      const { data: perfilData } = await supabase
        .from('perfiles')
        .select('avatar_url')
        .eq('auth_user_id', userId)
        .single()
        
      if (perfilData?.avatar_url) {
        currentAvatarUrl = perfilData.avatar_url
        console.log('Avatar actual encontrado en tabla perfiles')
      } else {
        // Fallback a los metadatos de Auth
        const userData = await supabase.auth.getUser()
        currentAvatarUrl = userData.data.user?.user_metadata?.avatar_url || null
        if (currentAvatarUrl) {
          console.log('Avatar actual encontrado en Auth metadata')
        }
      }
      
      // Limpiar parámetros de query de la URL si existen
      if (currentAvatarUrl && currentAvatarUrl.includes('?')) {
        currentAvatarUrl = currentAvatarUrl.split('?')[0]
      }

      console.log('Verificando bucket de almacenamiento...')
      
      // Verificar bucket
      try {
        const { data: buckets } = await supabase.storage.listBuckets()
        console.log('Buckets disponibles:', buckets?.map(b => b.name).join(', '))
        
        const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
        
        if (!bucketExists) {
          console.log(`Bucket "${BUCKET_NAME}" no encontrado, intentando crear...`)
          await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 5242880 // 5MB en bytes
          })
          console.log('Bucket creado exitosamente')
        } else {
          console.log(`Bucket "${BUCKET_NAME}" encontrado`)
        }
      } catch (bucketError) {
        console.warn('Error verificando/creando bucket:', bucketError)
      }

      // Estructura para almacenar el error
      let uploadError = null
      let uploadAttempts = 0
      const maxAttempts = 3
      
      // Intentar la subida varias veces si falla
      while (uploadAttempts < maxAttempts) {
        uploadAttempts++
        
        try {
          console.log(`Intento de subida ${uploadAttempts}/${maxAttempts}...`)
          
          // El método directo usando ArrayBuffer puede funcionar mejor con Supabase
          const arrayBuffer = await file.arrayBuffer()
          
          // Subir con opciones simplificadas
          const result = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filename, arrayBuffer, {
              contentType: mimeType,
              upsert: true
            })
          
          uploadError = result.error
          
          if (!uploadError) {
            console.log('Subida exitosa!')
            break
          }
          
          console.error(`Error en subida (intento ${uploadAttempts}):`, uploadError)
          
          // Si no es error 400 o ya hemos intentado varias veces, no seguir intentando
          if (!uploadError.message?.includes('400') || uploadAttempts >= maxAttempts) {
            break
          }
          
          // Esperar un poco antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (err) {
          console.error(`Error inesperado en intento ${uploadAttempts}:`, err)
          uploadError = err
          break
        }
      }

      if (uploadError) {
        // Intento alternativo en caso de error con método anterior
        console.log('Intentando método alternativo de subida...')
        
        try {
          // Verificar que tenemos las credenciales necesarias
          if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error('Faltan las credenciales de Supabase para el método alternativo')
            console.log('Intentando con un último método usando la instancia de supabase directamente')
            
            // Último intento usando directamente la instancia de supabase y los métodos nativos
            const { error: finalError } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(filename, file, {
                contentType: mimeType,
                upsert: true
              })
              
            if (finalError) {
              console.error('Error en última alternativa:', finalError)
              throw finalError
            }
            
            console.log('Subida exitosa con el último método alternativo!')
            uploadError = null
          }

          // Crear un nuevo objeto FormData
          const formData = new FormData()
          formData.append('file', file)
          
          // Asegurar que la URL está correcta
          const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filename}`
          console.log('URL para método alternativo:', uploadUrl)
          
          // Usar fetch con cabeceras de autorización explícitas
          const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'x-upsert': 'true' // Para asegurar que se reemplace si el archivo ya existe
            },
            body: formData
          })
          
          if (!response.ok) {
            const errorBody = await response.text()
            console.error('Respuesta de error completa:', errorBody)
            console.error('Estado de respuesta:', response.status, response.statusText)
            console.error('Cabeceras enviadas:', {
              'Authorization': 'Bearer ********', // No logueamos la clave completa por seguridad
              'x-upsert': 'true'
            })
            throw new Error(`Error en subida alternativa: ${response.status} ${response.statusText}`)
          }
          
          // Procesar respuesta exitosa
          const responseData = await response.json()
          console.log('Respuesta exitosa del método alternativo:', responseData)
          console.log('Subida alternativa exitosa!')
          
          // Resetear error si el método alternativo tuvo éxito
          uploadError = null
        } catch (altError) {
          // Intentar una tercera alternativa si los anteriores métodos fallan
          try {
            console.log('Intentando un tercer método de subida usando blob...')
            
            // Convertir el File a un Blob puro
            const fileBlob = new Blob([await file.arrayBuffer()], { type: mimeType })
            
            // Intentar la subida con blob puro
            const { error: blobError } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(filename, fileBlob, { 
                contentType: mimeType,
                upsert: true
              })
            
            if (blobError) {
              console.error('Error en tercera alternativa:', blobError)
              // No lanzamos error, solo registramos
            } else {
              console.log('Subida exitosa con el tercer método!')
              uploadError = null
            }
          } catch (thirdMethodError) {
            console.error('Error en tercer método de subida:', thirdMethodError)
          }
          
          // Si llegamos aquí y aún hay error, lo mantenemos
          console.error('Error detallado en método alternativo:', altError)
        }
      }

      // Si todavía hay error después de intentar todos los métodos
      if (uploadError) {
        throw new Error(`Error al subir la imagen: ${typeof uploadError === 'object' && 'message' in uploadError ? uploadError.message : String(uploadError)}`)
      }

      console.log('Obteniendo URL pública...')
      
      // Obtener la URL pública
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filename)
        
      if (!data || !data.publicUrl) {
        throw new Error('No se pudo obtener la URL de la imagen')
      }
      
      // Añadir timestamp para evitar problemas de caché
      const avatarUrl = `${data.publicUrl}?t=${timestamp}`
      console.log('URL pública obtenida:', avatarUrl)

      // Verificar que la imagen sea accesible antes de continuar
      try {
        console.log('Verificando accesibilidad de la imagen...')
        // Hacemos una pausa para dar tiempo a que la imagen esté disponible
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verificamos que la imagen sea accesible con una solicitud HEAD
        const checkResponse = await fetch(data.publicUrl, { 
          method: 'HEAD',
          cache: 'no-cache'
        })
        
        if (!checkResponse.ok) {
          console.warn(`La imagen subida puede no ser accesible de inmediato: ${checkResponse.status}`)
        } else {
          console.log('Imagen verificada y accesible')
        }
      } catch (checkError) {
        console.warn('Error verificando accesibilidad de imagen (continuando de todos modos):', checkError)
      }

      console.log('Actualizando metadatos de usuario...')
      
      // Actualizar el avatar en los metadatos del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      })
      
      if (updateError) {
        console.error('Error al actualizar metadatos:', updateError)
      }

      console.log('Actualizando tabla perfiles...')
      
      // Guardar la URL del avatar en la tabla perfiles
      const { data: perfilExistente, error: perfilQueryError } = await supabase
        .from('perfiles')
        .select('id_perfil')
        .eq('auth_user_id', userId)
        .single()
        
      if (perfilQueryError) {
        // Si no existe un perfil, lo creamos
        if (perfilQueryError.code === 'PGRST116') {
          console.log('Perfil no encontrado, creando nuevo perfil...')
          const userData = await supabase.auth.getUser()
          const userMetadata = userData.data.user?.user_metadata || {}
          
          const { error: createError } = await supabase
            .from('perfiles')
            .insert({
              auth_user_id: userId,
              nombre: userMetadata.first_name || '',
              apellido: userMetadata.last_name || '',
              correo: userData.data.user?.email || '',
              avatar_url: avatarUrl
            })
            
          if (createError) {
            console.error('Error al crear perfil:', createError)
          } else {
            console.log('Perfil creado exitosamente')
          }
        } else {
          console.error('Error al buscar perfil:', perfilQueryError)
        }
      } else if (perfilExistente) {
        console.log('Actualizando avatar en perfil existente...')
        // Actualizar el avatar en el perfil existente
        const { error: avatarDbError } = await supabase
          .from('perfiles')
          .update({ avatar_url: avatarUrl })
          .eq('id_perfil', perfilExistente.id_perfil)
          
        if (avatarDbError) {
          console.error('Error al guardar avatar en perfil:', avatarDbError)
        } else {
          console.log('Avatar actualizado en perfil exitosamente')
        }
      }
      
      // AHORA que ya tenemos la nueva imagen guardada, eliminamos la anterior
      if (currentAvatarUrl) {
        console.log('Eliminando avatar antiguo...')
        const deleted = await deleteOldAvatar(currentAvatarUrl)
        if (deleted) {
          console.log('Avatar antiguo eliminado exitosamente')
        } else {
          console.warn('No se pudo eliminar el avatar antiguo')
        }
      }
      
      toast.success('Avatar actualizado correctamente')
      console.log('Proceso de actualización de avatar completado')
      
      // Emitir evento para notificar que el avatar se actualizó
      try {
        window.dispatchEvent(new CustomEvent('avatar-updated', { 
          detail: { avatarUrl }
        }))
        console.log('Evento avatar-updated enviado')
      } catch (eventError) {
        console.warn('Error al enviar evento de actualización:', eventError)
      }
      
      return { url: avatarUrl, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al subir la imagen'
      console.error('Error final en uploadAvatar:', errorMsg)
      error.value = errorMsg
      toast.error(errorMsg)
      return { url: '', error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    uploadAvatar,
    deleteOldAvatar,
    validateFile
  }
} 