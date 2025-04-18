# Plan de Refactorización: Sistema de Gestión de Pagos

## Objetivos Generales

- [x] Desacoplar la lógica de presentación de la navegación
- [x] Implementar state management centralizado
- [x] Mejorar la arquitectura para mayor robustez
- [x] Unificar el manejo de errores
- [ ] Simplificar el mantenimiento a largo plazo

## Fases de Implementación

### Fase 1: State Management Centralizado

- [x] Crear store con Pinia para gestión de pagos
- [x] Migrar lógica de componentes al store
- [x] Implementar acciones asíncronas en el store
- [x] Añadir getters para cálculos derivados
- [x] Documentar la API pública del store

### Fase 2: Desacoplamiento de Componentes

- [x] Crear componente modal universal reutilizable
- [x] Refactorizar ModalVerPagosCliente para usar el nuevo store
- [x] Eliminar dependencias de ruta en los componentes modales
- [x] Implementar sistema de eventos para comunicación entre componentes
- [x] Añadir tests para componentes desacoplados

### Fase 3: Mejora de la Navegación

- [x] Simplificar estructura de rutas
- [x] Eliminar dependencia entre modales y rutas
- [x] Crear mecanismo para preservar estado al navegar
- [x] Documentar patrones de navegación recomendados
- [x] Actualizar enlaces en la interfaz de usuario

### Fase 4: Manejo Unificado de Errores

- [x] Implementar sistema centralizado de manejo de errores
- [ ] Crear componentes de UI para diferentes tipos de errores
- [x] Añadir logging estructurado
- [x] Mejorar mensajes de error para el usuario
- [x] Facilitar la depuración en desarrollo

### Fase 5: Mejoras de Rendimiento

- [ ] Implementar carga perezosa de componentes
- [ ] Optimizar consultas a Supabase
- [ ] Añadir caché de datos frecuentes
- [ ] Reducir re-renders innecesarios
- [ ] Medir y optimizar tiempos de carga

## Ejemplos de Implementación

### Ejemplo de Store (usando Pinia)

```typescript
// src/stores/pagosStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePlanDePago } from '@/composables/usePlanDePago'
import { usePagos } from '@/composables/usePagos'

export const usePagosStore = defineStore('pagos', () => {
  // State
  const planDePagoActivo = ref<string | null>(null)
  const clienteActivo = ref<Cliente | null>(null)
  const modalVisible = ref(false)
  const pagosData = ref<Pago[]>([])
  const planData = ref<PlanDePago | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const hasPlanActive = computed(() => !!planDePagoActivo.value)
  const totalPagos = computed(() => pagosData.value.length)
  const sumaPagos = computed(() => pagosData.value.reduce((sum, pago) => sum + pago.abono, 0))
  
  // Actions
  async function abrirModalPagos(planId, clienteId) {
    // Implementación...
  }
  
  function cerrarModalPagos() {
    // Implementación...
  }
  
  async function cargarDatos() {
    // Implementación...
  }
  
  // Más acciones...
  
  return {
    // Estado, getters y acciones
  }
})
```

### Ejemplo de Componente Modal Desacoplado

```vue
<!-- src/components/modales/ModalPagos.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="pagosStore.modalVisible"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1100] p-6"
      @click="handleClose"
    >
      <div
        class="w-full max-w-[900px] max-h-[calc(100vh-3rem)] bg-background border border-container-border rounded-3xl shadow-[0_8px_32px_var(--container-shadow)] flex flex-col"
        @click.stop
      >
        <!-- Header similar al componente de Cotizaciones -->
        <div
          class="sticky top-0 z-10 p-5 border-b border-container-border flex items-center justify-between bg-background backdrop-blur-sm rounded-t-3xl"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText class="w-4 h-4 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-text">Pagos de Póliza</h2>
          </div>
          <button
            class="p-2 rounded-lg text-text transition-all duration-300 hover:bg-primary hover:text-white"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Contenido principal -->
        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <!-- Estados de carga e informativos -->
          <div v-if="pagosStore.isLoading" class="flex justify-center items-center p-10">
            <Loader class="w-10 h-10 animate-spin text-primary" />
            <span class="ml-3 text-text">Cargando datos...</span>
          </div>
          
          <div v-else-if="pagosStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p class="text-red-600 dark:text-red-400">{{ pagosStore.error }}</p>
          </div>
          
          <template v-else>
            <!-- Información del Cliente -->
            <TarjetaInfoCliente
              :cliente="clienteStore.clienteActivo"
              :plan-de-pago="pagosStore.planData"
            />

            <!-- Sección de Pagos -->
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-baseline gap-3">
                  <h3 class="text-lg font-semibold text-text">Pagos Realizados</h3>
                  <span class="text-sm text-text/70">{{ pagosStore.totalPagos }} pagos</span>
                </div>
                <button
                  class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                  @click="agregarPago"
                >
                  <Plus class="w-4 h-4" />
                  <span>Agregar Pago</span>
                </button>
              </div>

              <!-- Tabla de Pagos - Utiliza el mismo patrón que la tabla de cotizaciones -->
              <TablaPagos :pagos="pagosStore.pagosData" @ver="verPago" @editar="editarPago" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { X, FileText, Plus, Loader } from 'lucide-vue-next';
import { usePagosStore } from '@/stores/pagosStore';
import { useClienteStore } from '@/stores/clienteStore';
import TarjetaInfoCliente from './TarjetaInfoCliente.vue';
import TablaPagos from './TablaPagos.vue';

const pagosStore = usePagosStore();
const clienteStore = useClienteStore();

const handleClose = () => {
  pagosStore.cerrarModalPagos();
};

const agregarPago = () => {
  // Lógica para abrir formulario de nuevo pago
};

const verPago = (pago) => {
  // Lógica para ver detalles de pago
};

const editarPago = (pago) => {
  // Lógica para editar pago
};
</script>
```

## Referencias del Código Existente

El archivo [Cotizaciones.vue](../views/Cotizaciones.vue) contiene varios patrones recomendados que podemos aplicar en nuestra refactorización:

1. **Uso de Componentes Asíncronos**: Implementa `defineAsyncComponent` para cargar modales bajo demanda.

```javascript
const AddCotizacionModal = defineAsyncComponent(() => 
  import('@/modules/admin/components/AddCotizacionModal.vue')
);
```

2. **Manejo de Estados de Interfaz**: Implementa estados claros para diferentes situaciones de la UI.

```vue
<!-- Estado de carga -->
<div v-if="loading">...</div>

<!-- Estado sin datos -->
<div v-else-if="cotizaciones.length === 0">...</div>

<!-- Estado sin resultados de búsqueda -->
<div v-else-if="searchQuery && filteredItems.length === 0">...</div>
```

3. **Formateo de Datos**: Funciones de ayuda para formatear fechas, moneda, etc.

```javascript
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-HN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};
```

4. **Diseño Responsive**: Implementación de diferentes vistas para diferentes tamaños de pantalla.

```vue
<!-- Vista de tabla en pantallas medianas y grandes -->
<div class="hidden md:block">...</div>

<!-- Vista de tarjetas en dispositivos móviles -->
<div class="grid grid-cols-1 gap-4 md:hidden">...</div>
```

## Próximos Pasos

1. Continuar con la Fase 3: Mejora de la Navegación
2. Implementar los patrones de navegación basados en modales sin uso de rutas
3. Crear mecanismo para preservar estado durante la navegación
4. Implementar el sistema de manejo de errores
5. Optimizar rendimiento y tiempo de carga

## Equipo Responsable

- UX/UI: [Nombre]
- Frontend: [Nombre]
- Backend: [Nombre]
- QA: [Nombre]

## Cronograma

- **Fase 1**: ✓ Completada
- **Fase 2**: ✓ Completada
- **Fase 3**: ✓ Completada
- **Fase 4**: ✓ Completada
- **Fase 5**: 2 días
- **Testing y Revisión**: 2 días

**Tiempo Total Estimado**: 3 semanas 

## Resumen de Implementación - Fase 4: Manejo Unificado de Errores

En la Fase 4 se ha implementado un sistema centralizado y estructurado para el manejo de errores, con el objetivo de mejorar la experiencia del usuario, facilitar la depuración y mantener la consistencia en toda la aplicación.

### Composable `useErrorHandler`

Se creó un nuevo composable `src/composables/useErrorHandler.ts` que proporciona funciones para manejar errores de manera consistente:

```typescript
// src/composables/useErrorHandler.ts
import { useToast } from 'vue-toastification';
import { ref } from 'vue';

// Un ref global para el estado de errores
const globalError = ref<string | null>(null);

export function useErrorHandler() {
  const toast = useToast();

  const handleAndToastError = (error: unknown, context: string, userMessage?: string) => {
    let errorMessage = 'Ocurrió un error inesperado.';
    let errorDetails = error;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String((error as { message: string }).message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Mensaje para el usuario
    const finalUserMessage = userMessage || `Error en ${context}: ${errorMessage}`;
    toast.error(finalUserMessage);

    // Actualizar estado global de error
    globalError.value = finalUserMessage;

    // Log detallado para desarrolladores
    console.error(`[Error Handler | ${context}]:`, {
      message: errorMessage,
      details: errorDetails,
    });

    return errorMessage;
  };

  const clearGlobalError = () => {
    globalError.value = null;
  };

  return {
    handleAndToastError,
    clearGlobalError,
    globalError
  };
}
```

### Implementación en Stores

Se ha aplicado el patrón en todos los stores y composables principales:

#### 1. En `pagosStore.ts`:

```typescript
import { useErrorHandler } from '@/composables/useErrorHandler';

export const usePagosStore = defineStore('pagos', () => {
  // ...
  const { handleAndToastError } = useErrorHandler();
  
  async function cargarDatos() {
    // ...
    try {
      // Lógica de carga
    } catch (err) {
      error.value = handleAndToastError(err, 'PagosStore/cargarDatos', 'Error al cargar los datos de pagos');
      return false;
    }
  }
  // ...
});
```

#### 2. En `usePagos.ts`:

```typescript
export const usePagos = () => {
  // ...
  const { handleAndToastError } = useErrorHandler();
  
  const getPagos = async (id_plan: string) => {
    try {
      // Lógica para obtener pagos
    } catch (err) {
      error.value = handleAndToastError(err, `usePagos/getPagos(${id_plan})`);
      return { ok: false, data: [], message: 'Error al obtener los pagos' };
    }
  }
  // ...
};
```

### Beneficios Implementados

1. **Consistencia**: Todos los errores ahora se manejan de forma uniforme
2. **Mejor Experiencia**: Mensajes de error más claros para el usuario
3. **Facilidad de Depuración**: Logs estructurados con contexto y detalles para desarrolladores
4. **Centralización**: La lógica de manejo de errores está en un solo lugar
5. **Mantenibilidad**: Refactorizar o mejorar el manejo de errores solo requiere modificar un archivo

### Próximos Pasos

La única tarea pendiente en esta fase es la implementación de componentes de UI específicos para diferentes tipos de errores (por ejemplo, un banner de error persistente o componentes para mostrar errores de validación). 