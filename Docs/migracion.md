# Migración a Supabase

## Estructura del Proyecto

```
src/
├── modules/
│   ├── auth/         # Autenticación
│   ├── admin/        # Gestión administrativa
│   └── common/       # Componentes compartidos
```

## Orden de Migración

### 1. Autenticación (Prioridad Alta)
- [x] Migrar Login.vue para usar useSupabaseAuth
- [x] ~~Migrar Register.vue para usar useSupabaseAuth~~ (Eliminado - No se utilizará registro)
- [x] Actualizar guards para usar useAuthStore con Supabase
- [x] Eliminar actions antiguos de autenticación

**Cambios necesarios:**
- [x] Usar useSupabaseAuth para autenticación
- [x] Implementar manejo de sesiones con Supabase
- [x] Actualizar guards para usar Supabase
- [x] Implementar persistencia de sesión

### 2. Gestión de Clientes (Prioridad Alta)
- [x] Implementar useClientes composable
- [x] Migrar vista de lista de clientes
- [x] Migrar formulario de crear/editar cliente
- [x] Migrar vista de detalles de cliente
- [x] Eliminar clientes_actions.ts

**Cambios necesarios:**
- [x] Implementar CRUD con supabase.from('clientes')
- [ ] Implementar RLS (Row Level Security)
- [x] Actualizar tipos/interfaces
- [ ] Manejar relaciones con otras tablas

### 3. Gestión de Pólizas (Prioridad Alta)
- [x] Implementar usePolizas composable
- [x] Migrar vista de lista de pólizas
- [x] Migrar formulario de crear/editar póliza
- [x] Migrar AssignPolicyForm.vue
- [x] Eliminar polizas_actions.ts

**Cambios necesarios:**
- [x] Implementar CRUD con supabase.from('polizas')
- [ ] Implementar RLS (Row Level Security)
- [x] Actualizar tipos/interfaces
- [x] Manejar relaciones con otras tablas (aseguradoras)

### 4. Planes de Pago (Prioridad Media)
- [x] Implementar usePlanDePago composable
- [x] Migrar vista de lista de planes
- [x] Migrar formulario de crear/editar plan
- [ ] Migrar vista de detalles de plan
- [x] Eliminar plan_de_pago_actions.ts

**Cambios necesarios:**
- [x] Implementar CRUD con supabase.from('plan_de_pago')
- [x] Implementar cálculos y validaciones
- [x] Manejar relaciones con pólizas y clientes
- [x] Actualizar lógica de estados

### 5. Pagos (Prioridad Media)
- [x] Implementar usePagos composable
- [x] Migrar registro de pagos
- [x] Migrar historial de pagos
- [x] Eliminar pagos_actions.ts

**Cambios necesarios:**
- [x] Implementar CRUD con supabase.from('pagos')
- [x] Implementar manejo de comprobantes con Storage
- [x] Actualizar cálculos y validaciones
- [x] Manejar relaciones con planes de pago

### 6. Aseguradoras (Prioridad Media)
- [x] Implementar useAseguradoras composable
- [x] Migrar vista de lista de aseguradoras
- [x] Migrar formulario de crear/editar aseguradora
- [x] Eliminar aseguradoras_actions.ts

**Cambios necesarios:**
- [x] Implementar CRUD con supabase.from('aseguradoras')
- [ ] Implementar RLS (Row Level Security)
- [x] Actualizar tipos/interfaces
- [x] Manejar relaciones con pólizas

### 7. Usuarios (Prioridad Media)
- [x] ~~Implementar useUsuarios composable~~ (No necesario - se usa useSupabaseAuth)
- [x] ~~Migrar vista de lista de usuarios~~ (Ya migrado con Supabase Auth)
- [x] ~~Migrar formulario de crear/editar usuario~~ (Ya migrado con Supabase Auth)
- [x] Eliminar usuarios_actions.ts

**Cambios necesarios:**
- [x] ~~Implementar CRUD con supabase.from('usuarios')~~ (Se usa Supabase Auth)
- [x] ~~Implementar RLS~~ (Manejado por Supabase Auth)
- [x] ~~Actualizar tipos/interfaces~~ (Se usan los tipos de Supabase Auth)
- [x] ~~Manejar relaciones con corredurías~~ (Manejado por tabla usuarios_corredurias)

### 8. Componentes Comunes (Prioridad Baja)
- [x] Actualizar componentes compartidos
- [ ] Actualizar páginas de estado/error

**Cambios necesarios:**
- [x] Actualizar manejo de errores
- [x] Implementar loading states
- [ ] Actualizar notificaciones

## Configuración de Supabase

### Variables de Entorno
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Tablas Principales
1. **usuarios**
   - id (uuid)
   - email (string)
   - role (string)
   - metadata (json)

2. **clientes**
   - id_cliente (uuid)
   - nombres (string)
   - apellidos (string)
   - identificacion (string)
   - correo (string)
   - telefono (string)
   - direccion (text)
   - fecha_nacimiento (date)
   - estado (boolean)

3. **polizas**
   - id_poliza (uuid)
   - nombre (string)
   - descripcion (text)
   - estado (boolean)

4. **plan_de_pago**
   - id_plan (uuid)
   - id_cliente (uuid, ref: clientes)
   - id_poliza (uuid, ref: polizas)
   - prima_total (numeric)
   - plazo (integer)
   - fecha_de_pago (date)
   - pago_uno (numeric)
   - numero_poliza (string)
   - archivo_poliza (string)
   - status (string)
   - estado (boolean)

5. **pagos**
   - id_pago (uuid)
   - id_plan (uuid, ref: plan_de_pago)
   - abono (numeric)
   - fecha (date)
   - metodo_pago (string)
   - url_comprobante (string)

### Composables a Implementar
- [x] useSupabaseAuth
- [x] useAuthStore
- [x] useClientes
- [x] usePolizas
- [x] usePlanDePago
- [x] useStorage
- [x] usePagos
- [ ] useAseguradoras
- [ ] useUsuarios

### Políticas de Seguridad (RLS)
- [ ] Implementar RLS para cada tabla
- [ ] Configurar políticas basadas en roles
- [ ] Asegurar acceso a datos por usuario

## Testing
- [x] Pruebas de autenticación
- [ ] Pruebas de CRUD
- [ ] Pruebas de relaciones
- [ ] Pruebas de políticas de seguridad

## Consideraciones
1. [ ] Mantener compatibilidad con datos existentes
2. [ ] Implementar migraciones de datos si es necesario
3. [x] Manejar errores y casos edge
4. [x] Documentar cambios y nuevas funcionalidades
5. [ ] Realizar pruebas exhaustivas antes de desplegar 