import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const BUCKET_NAME = 'logos'
const LOGOS_PATH = 'aseguradoras'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface FileValidationResult {
  isValid: boolean
  error?: string
}

export const useStorage = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const validateFile = (file: File): FileValidationResult => {
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'El archivo no debe superar los 5MB'
      }
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'El archivo debe ser una imagen (JPG, PNG, GIF o WEBP)'
      }
    }

    return { isValid: true }
  }

  const checkUserPermissions = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      // Verificar si el usuario tiene el rol necesario
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      return userRoles?.role === 'superadmin'
    } catch (err) {
      console.error('Error checking permissions:', err)
      return false
    }
  }

  const uploadLogo = async (file: File, aseguradoraId: string): Promise<string> => {
    try {
      loading.value = true
      error.value = null

      // Verificar permisos
      const hasPermission = await checkUserPermissions()
      if (!hasPermission) {
        throw new Error('No tienes permisos para subir archivos. Se requiere ser superadmin.')
      }

      // Validar archivo
      const validation = validateFile(file)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${LOGOS_PATH}/${aseguradoraId}.${fileExt}`

      // Eliminar logo anterior si existe
      const { data: existingFiles, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(LOGOS_PATH, {
          search: aseguradoraId
        })

      if (listError) {
        throw new Error('Error al verificar archivos existentes: ' + listError.message)
      }

      if (existingFiles && existingFiles.length > 0) {
        const deletePromises = existingFiles.map(file => 
          supabase.storage
            .from(BUCKET_NAME)
            .remove([`${LOGOS_PATH}/${file.name}`])
        )
        
        const deleteResults = await Promise.allSettled(deletePromises)
        const deleteErrors = deleteResults
          .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
          .map(result => result.reason)
        
        if (deleteErrors.length > 0) {
          console.error('Errores al eliminar archivos antiguos:', deleteErrors)
        }
      }

      // Subir nuevo logo
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        if (uploadError.message.includes('Permission denied')) {
          throw new Error('No tienes permisos para subir archivos. Se requiere ser superadmin.')
        }
        throw uploadError
      }

      const { data: publicUrl } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName)

      return publicUrl.publicUrl
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteLogo = async (aseguradoraId: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      // Verificar permisos
      const hasPermission = await checkUserPermissions()
      if (!hasPermission) {
        throw new Error('No tienes permisos para eliminar archivos. Se requiere ser superadmin.')
      }

      const { data: existingFiles, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(LOGOS_PATH, {
          search: aseguradoraId
        })

      if (listError) {
        throw new Error('Error al verificar archivos existentes: ' + listError.message)
      }

      if (existingFiles && existingFiles.length > 0) {
        const deletePromises = existingFiles.map(file => 
          supabase.storage
            .from(BUCKET_NAME)
            .remove([`${LOGOS_PATH}/${file.name}`])
        )
        
        const deleteResults = await Promise.allSettled(deletePromises)
        const deleteErrors = deleteResults
          .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
          .map(result => result.reason)
        
        if (deleteErrors.length > 0) {
          console.error('Errores al eliminar archivos:', deleteErrors)
          throw new Error('Error al eliminar algunos archivos')
        }
      }

      return true
    } catch (err) {
      error.value = (err as Error).message
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    uploadLogo,
    deleteLogo
  }
} 