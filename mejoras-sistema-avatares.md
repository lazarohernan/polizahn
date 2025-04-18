# Mejoras para el Sistema de Avatares

## Estado Actual

### Componentes
- **Avatar.vue**: Componente genérico con soporte para imágenes e iniciales
- **ViewClientModal.vue**: Muestra iniciales de clientes sin soporte para imágenes reales
- **Profile.vue**: Sistema completo para usuarios con subida y gestión de avatares

### Almacenamiento
- La tabla `perfiles` tiene una columna `avatar_url` para usuarios
- La tabla `clientes` tiene un campo `foto` que no se utiliza activamente
- Los avatares se almacenan en Supabase Storage

### Inconsistencias
- Los clientes solo muestran iniciales, no imágenes reales
- Diferentes implementaciones en distintas partes de la aplicación
- No hay un sistema unificado para clientes como el que existe para usuarios

## Mejoras Propuestas

### 1. Unificación del Sistema de Avatares
- **Objetivo**: Utilizar el mismo componente `Avatar.vue` en toda la aplicación
- **Implementación**:
  - Estandarizar los props y comportamientos del componente
  - Aplicar el mismo estilo visual en todos los lugares donde se utiliza

### 2. Subida de Avatares para Clientes
- **Objetivo**: Permitir asignar imágenes a los clientes
- **Implementación**:
  - Adaptar el componente `ImageUploader` para clientes
  - Modificar `ViewClientModal.vue` para incluir la funcionalidad de subida
  - Utilizar el campo `foto` de la tabla `clientes` para almacenar la URL

### 3. Sistema de Fallback Consistente
- **Objetivo**: Garantizar una experiencia visual coherente
- **Implementación**:
  - Utilizar el mismo sistema de fallback en toda la aplicación
  - Prioridad: 1) Imagen subida → 2) Iniciales generadas

### 4. Adaptación del Composable useAvatarStorage
- **Objetivo**: Reutilizar la lógica existente para clientes
- **Implementación**:
  - Crear una versión específica para clientes (`useClientAvatarStorage`)
  - Mantener las funcionalidades de optimización y manejo de imágenes
  - Adaptar las rutas de almacenamiento para clientes

### 5. Mejoras en la Interfaz de Usuario
- **Objetivo**: Mejorar la experiencia al gestionar avatares
- **Implementación**:
  - Añadir indicadores visuales durante la carga
  - Implementar previsualización de imágenes
  - Añadir opciones para eliminar o cambiar la imagen

## Plan de Implementación

1. **Fase 1**: Unificación del componente Avatar
2. **Fase 2**: Implementación de subida de imágenes para clientes
3. **Fase 3**: Adaptación del sistema de almacenamiento
4. **Fase 4**: Pruebas y ajustes
5. **Fase 5**: Documentación y capacitación

## Beneficios

- **Coherencia visual** en toda la aplicación
- **Mejor experiencia de usuario** con avatares personalizados
- **Código más mantenible** al evitar duplicaciones
- **Base para futuras mejoras** como recorte de imágenes o filtros 