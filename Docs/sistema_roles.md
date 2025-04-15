# Sistema de Roles en la Aplicación

Este documento explica la arquitectura y funcionamiento del sistema de roles en la aplicación, con enfoque en los roles principales: "Superadmin", "Admin" y "Técnico".

## Arquitectura de Roles en Múltiples Niveles

El sistema de roles opera en dos niveles principales:

### 1. Nivel de Autenticación (Supabase Auth)

Los roles a nivel de sistema se almacenan en Supabase Auth y definen el acceso general a módulos de la aplicación.

```typescript
// Ejemplo: Creación de un usuario técnico en Auth
async function createTechnicalUser(email: string, password: string) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'tecnico'  // Rol a nivel de sistema
    },
    app_metadata: {
      role: 'tecnico'   // Rol para permisos de Supabase
    }
  });
  
  if (error) throw error;
  return data.user;
}
```

Estos roles (`raw_app_meta_data->role` y `raw_user_meta_data->role`) determinan:
- Qué módulos puede ver el usuario
- Qué operaciones generales puede realizar
- Restricciones de acceso básicas

### 2. Nivel de Base de Datos (Tablas 'roles' y 'usuarios_corredurias')

#### Tabla 'roles'
Define los tipos de roles disponibles y sus permisos específicos:

```sql
-- Insertar roles principales en la tabla de roles
INSERT INTO roles (id_rol, nombre, descripcion)
VALUES 
(1, 'Superadmin', 'Administrador del sistema con acceso total a todas las características'),
(2, 'Admin', 'Administrador de correduría con acceso a todas las funciones dentro de su correduría'),
(5, 'Técnico', 'Personal técnico con acceso a diagnósticos y reparaciones');
```

#### Tabla 'usuarios_corredurias'
Asocia un usuario específico con una correduría y le asigna un rol dentro de esa correduría:

```typescript
// Asignar un usuario a una correduría con rol técnico
async function assignUserToCorreduria(authUserId: string, correduríaId: string) {
  // Verificar que el rol existe
  const { data: roleData } = await supabase
    .from('roles')
    .select('id_rol')
    .eq('nombre', 'Técnico')
    .single();
    
  if (!roleData) throw new Error('El rol Técnico no existe');
  
  // Asignar usuario a correduría con rol técnico
  const { data, error } = await supabase
    .from('usuarios_corredurias')
    .insert({
      auth_user_id: authUserId,
      id_correduria: correduríaId,
      id_rol: roleData.id_rol,
      estado: true,
      fecha_creado: new Date()
    });
    
  if (error) throw error;
  return data;
}
```

### 3. Permisos Granulares (Tabla 'permisos_de_acceso')

La tabla `permisos_de_acceso` implementa un sistema de permisos a nivel de usuario y correduría para controlar el acceso a funciones específicas:

```sql
CREATE TABLE public.permisos_de_acceso (
    id_permiso integer NOT NULL,
    id_usuario uuid NOT NULL,
    id_correduria uuid,
    polizas_create boolean DEFAULT false NOT NULL,
    polizas_edit boolean DEFAULT false NOT NULL,
    polizas_delete boolean DEFAULT false NOT NULL,
    clientes_create boolean DEFAULT false NOT NULL,
    clientes_edit boolean DEFAULT false NOT NULL,
    clientes_delete boolean DEFAULT false NOT NULL,
    CONSTRAINT permisos_de_acceso_pkey PRIMARY KEY (id_permiso)
);
```

**Nota importante**: Los permisos relacionados con aseguradoras han sido eliminados de esta tabla, ya que solo el rol Superadmin puede gestionar aseguradoras. Esto simplifica el sistema y centraliza la gestión de aseguradoras en los administradores del sistema.

Esta estructura permite:
- Configuración granular de permisos por usuario
- Asignación específica de permisos por correduría
- Separación clara entre roles de sistema y permisos detallados
- Mayor flexibilidad en la administración de accesos

## Descripción de los Roles Principales

### Rol Superadmin

El rol Superadmin es el más elevado en la jerarquía de roles del sistema:

- **Nivel de Autenticación**:
  ```typescript
  // Creación de un usuario Superadmin
  async function createSuperadminUser(email: string, password: string) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'superadmin'
      },
      app_metadata: {
        role: 'superadmin'
      }
    });
    
    if (error) throw error;
    return data.user;
  }
  ```

- **Permisos Exclusivos**:
  - Acceso a todas las corredurías registradas en el sistema
  - Creación y gestión de corredurías
  - Gestión exclusiva de aseguradoras
  - Asignación de roles administrativos
  - Acceso completo a la configuración del sistema
  - Gestión de políticas globales de seguridad
  - Informes y estadísticas a nivel de sistema

- **RLS Policies**:
  ```sql
  -- Ejemplo: Política de acceso para Superadmin a todas las corredurías
  CREATE POLICY "Superadmins pueden ver todas las corredurías" 
  ON corredurias FOR SELECT
  USING (auth.jwt() ->> 'role' = 'superadmin');
  
  CREATE POLICY "Superadmins pueden modificar todas las corredurías" 
  ON corredurias FOR ALL
  USING (auth.jwt() ->> 'role' = 'superadmin');
  
  -- Política para aseguradoras (solo superadmin)
  CREATE POLICY "Solo Superadmins pueden gestionar aseguradoras" 
  ON aseguradoras FOR ALL
  USING (auth.jwt() ->> 'role' = 'superadmin');
  ```

### Rol Admin

El rol Admin tiene privilegios elevados pero limitados a su correduría asignada:

- **Nivel de Autenticación**:
  ```typescript
  // Creación de un usuario Admin
  async function createAdminUser(email: string, password: string) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      },
      app_metadata: {
        role: 'admin'
      }
    });
    
    if (error) throw error;
    return data.user;
  }
  ```

- **Permisos**:
  - Gestión completa de usuarios dentro de su correduría
  - Administración de pólizas y clientes
  - Configuración de parámetros de la correduría
  - Acceso a informes y estadísticas de su correduría
  - Visualización de aseguradoras (sin poder modificarlas)

- **RLS Policies**:
  ```sql
  -- Ejemplo: Política de acceso para Admin a su correduría
  CREATE POLICY "Admins pueden ver su correduría" 
  ON corredurias FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin' AND
    id_correduria IN (
      SELECT id_correduria 
      FROM usuarios_corredurias 
      WHERE auth_user_id = auth.uid()
    )
  );
  
  CREATE POLICY "Admins pueden gestionar usuarios de su correduría" 
  ON usuarios_corredurias FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin' AND
    id_correduria IN (
      SELECT id_correduria 
      FROM usuarios_corredurias 
      WHERE auth_user_id = auth.uid()
    )
  );
  
  -- Política para visualizar aseguradoras (solo lectura)
  CREATE POLICY "Admins pueden ver aseguradoras" 
  ON aseguradoras FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
  ```

### Rol Técnico

El rol Técnico es un rol flexible que puede tener diferentes permisos según lo configure el Admin o Superadmin:

- **Nivel de Autenticación**:
  ```typescript
  // Creación de un usuario Técnico en Auth
  async function createTechnicalUser(email: string, password: string = null) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Se enviará una invitación
      user_metadata: {
        role: 'tecnico'
      },
      app_metadata: {
        role: 'tecnico'
      }
    });
    
    if (error) throw error;
    return data.user;
  }
  ```

- **Asignación de Permisos**:
  - El usuario Admin que lo crea configura los permisos específicos en la interfaz
  - Los permisos seleccionados se almacenan en la tabla `permisos_de_acceso`
  - Cada permiso (crear/editar/eliminar) se establece individualmente
  - El Técnico puede tener cualquier combinación de permisos según las necesidades

- **Permisos Configurables**:
  - Gestión de clientes (crear, editar, eliminar)
  - Gestión de pólizas (crear, editar, eliminar)
  - Acceso a diagnósticos técnicos
  - Funciones específicas de soporte

- **Proceso de Invitación**:
  1. El Admin crea la cuenta de Técnico proporcionando el correo electrónico
  2. Configura los permisos específicos para ese usuario
  3. Supabase envía automáticamente un correo de invitación
  4. El Técnico recibe el correo y establece su contraseña
  5. Al ingresar al sistema, ya cuenta con todos los permisos configurados

## Flujo Completo para Diferentes Roles

### Flujo para Superadmin

1. **Creación del Superadmin**:
   - Solo puede ser creado por otro Superadmin o mediante configuración directa en Supabase
   - Se asigna el rol 'superadmin' tanto en `user_metadata` como en `app_metadata`

2. **Inicio de Sesión**:
   - Al iniciar sesión, el sistema verifica el rol en `app_metadata`
   - Se cargan todos los módulos disponibles en la plataforma

3. **Navegación**:
   - Puede acceder a todos los módulos sin restricciones
   - Tiene visibilidad de todas las corredurías registradas
   - Puede cambiar entre corredurías mediante un selector global

4. **Gestión de Corredurías**:
   - Puede crear nuevas corredurías
   - Puede editar información de corredurías existentes
   - Puede eliminar corredurías (con confirmación de seguridad)
   - Puede ver estadísticas y actividad de todas las corredurías

5. **Gestión de Usuarios**:
   - Puede crear usuarios de cualquier tipo (Superadmin, Admin, Técnico)
   - Puede asignar usuarios a cualquier correduría
   - Puede configurar roles y permisos para cualquier usuario
   - Puede desactivar/reactivar cuentas de usuario

6. **Gestión de Aseguradoras**:
   - Tiene control total sobre el catálogo de aseguradoras
   - Puede crear, editar y eliminar aseguradoras del sistema
   - Configura las relaciones entre aseguradoras y corredurías

7. **Configuración del Sistema**:
   - Puede modificar parámetros globales
   - Gestiona las políticas de seguridad
   - Configura integraciones con servicios externos

8. **Auditoría**:
   - Accede a registros completos de actividad del sistema
   - Puede generar informes detallados de operaciones

### Flujo para Admin

1. **Creación del Admin**:
   - Es creado por un Superadmin
   - Se le asigna el rol 'admin' en `user_metadata` y `app_metadata`
   - Se asocia a una o varias corredurías específicas
   - Se configuran sus permisos granulares en la tabla `permisos_de_acceso`

2. **Inicio de Sesión**:
   - Al iniciar sesión, se verifica el rol y corredurías asignadas
   - Se cargan los módulos autorizados para su rol
   - Si tiene acceso a múltiples corredurías, se muestra un selector

3. **Selección de Correduría** (si aplica):
   - Si está asignado a varias corredurías, debe seleccionar con cuál trabajar
   - Los datos y operaciones se filtran según la correduría seleccionada

4. **Gestión de Usuarios**:
   - Puede crear usuarios Técnicos dentro de su correduría
   - Puede gestionar permisos de los usuarios que ha creado
   - No puede crear otros Admins o Superadmins

5. **Gestión de Clientes**:
   - Puede ver la lista completa de clientes de su correduría
   - Según sus permisos, puede crear, editar y opcionalmente eliminar clientes
   - Registra y gestiona información detallada de los clientes

6. **Gestión de Pólizas**:
   - Puede gestionar todas las pólizas asociadas a su correduría
   - Según sus permisos, puede crear, actualizar y opcionalmente eliminar pólizas
   - Asocia pólizas a clientes y aseguradoras disponibles
   - Configura planes de pago y realiza seguimiento

7. **Reportes y Estadísticas**:
   - Accede a informes de desempeño de su correduría
   - Visualiza estadísticas de clientes, pólizas y pagos
   - Monitorea indicadores clave de gestión

8. **Visualización de Aseguradoras**:
   - Puede ver el catálogo de aseguradoras
   - No puede modificar la información de las aseguradoras
   - Utiliza las aseguradoras disponibles para asociarlas a pólizas

### Flujo para Técnico

1. **Creación del Técnico por un Admin**:
   - El Admin inicia sesión en el sistema
   - Accede al módulo de gestión de usuarios
   - Selecciona "Crear nuevo usuario técnico"
   - Introduce el correo electrónico del técnico
   - Configura los permisos específicos marcando las casillas correspondientes:
     - [ ] Clientes: Crear
     - [ ] Clientes: Editar 
     - [ ] Clientes: Eliminar
     - [ ] Pólizas: Crear
     - [ ] Pólizas: Editar
     - [ ] Pólizas: Eliminar
   - Confirma la creación del usuario

2. **Procesamiento en el Backend**:
   - Se crea el usuario en Supabase Auth con rol 'tecnico'
   - Se asigna a la correduría del Admin que lo creó
   - Se guardan los permisos específicos en la tabla `permisos_de_acceso`
   - Supabase envía un correo de invitación al técnico

3. **Activación de la Cuenta**:
   - El Técnico recibe el correo de invitación
   - Hace clic en el enlace para establecer su contraseña
   - Completa el proceso de activación de cuenta

4. **Inicio de Sesión del Técnico**:
   - Al iniciar sesión, el sistema identifica su rol 'tecnico'
   - Carga la interfaz con los módulos y opciones según sus permisos
   - Los permisos específicos limitan o habilitan funciones en la interfaz

5. **Operación según Permisos**:
   - Si tiene permisos para gestionar clientes, verá las opciones correspondientes
   - Si tiene permisos para gestionar pólizas, accederá a esas funciones
   - Las acciones no permitidas (según `permisos_de_acceso`) estarán deshabilitadas

6. **Ejemplo de Implementación**:
   ```typescript
   // Verificar si el técnico puede crear un cliente
   const canCreateClient = async () => {
     // Obtener permisos del usuario para la correduría actual
     const { data } = await supabase
       .from('permisos_de_acceso')
       .select('clientes_create')
       .eq('id_usuario', authStore.user.id)
       .eq('id_correduria', currentCorreduriaId)
       .single();
       
     return data?.clientes_create || false;
   };
   
   // En la interfaz, deshabilitar botón si no tiene permiso
   const createClientButton = ref(null);
   onMounted(async () => {
     const hasPermission = await canCreateClient();
     if (!hasPermission) {
       createClientButton.value.disabled = true;
     }
   });
   ```

## Ejemplo de Flujo Completo: Creación de Usuario Técnico y Asignación de Permisos

```typescript
// 1. Admin inicia sesión
const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'password123'
});

if (loginError) {
  console.error('Error de inicio de sesión:', loginError);
  return;
}

// 2. Admin crea un nuevo usuario Técnico (sin contraseña, se enviará invitación)
const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
  email: 'nuevo.tecnico@example.com',
  password: null,
  email_confirm: false,
  user_metadata: {
    role: 'tecnico',
    nombre: 'Carlos',
    apellido: 'Gómez'
  },
  app_metadata: {
    role: 'tecnico'
  }
});

if (createError) {
  console.error('Error al crear usuario:', createError);
  return;
}

// 3. Obtener el ID de la correduría del Admin actual
const { data: adminCorreduria, error: correError } = await supabase
  .from('usuarios_corredurias')
  .select('id_correduria')
  .eq('auth_user_id', session.user.id)
  .single();

if (correError) {
  console.error('Error al obtener la correduría:', correError);
  return;
}

// 4. Obtener el ID del rol Técnico
const { data: rolTecnico, error: rolError } = await supabase
  .from('roles')
  .select('id_rol')
  .eq('nombre', 'Técnico')
  .single();

if (rolError) {
  console.error('Error al obtener el rol:', rolError);
  return;
}

// 5. Asignar el usuario a la correduría del Admin con rol Técnico
const { data: userInCorreduria, error: assignError } = await supabase
  .from('usuarios_corredurias')
  .insert({
    auth_user_id: newUser.user.id,
    id_correduria: adminCorreduria.id_correduria,
    id_rol: rolTecnico.id_rol,
    estado: true,
    fecha_creado: new Date()
  });

if (assignError) {
  console.error('Error al asignar a correduría:', assignError);
  return;
}

// 6. Configurar permisos específicos según lo seleccionado por el Admin en la interfaz
const { data: permisos, error: permisosError } = await supabase
  .from('permisos_de_acceso')
  .insert({
    id_permiso: Date.now(), // Usar timestamp como ID simple
    id_usuario: newUser.user.id,
    id_correduria: adminCorreduria.id_correduria,
    polizas_create: true,  // Estos valores se obtienen de checkboxes en la interfaz
    polizas_edit: true,    // que el Admin marca según los permisos
    polizas_delete: false, // que desea otorgar al técnico
    clientes_create: true,
    clientes_edit: true,
    clientes_delete: false
  });

if (permisosError) {
  console.error('Error al configurar permisos:', permisosError);
  return;
}

// 7. Enviar invitación para establecer contraseña (si no se ha enviado automáticamente)
const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
  newUser.user.email
);

if (inviteError) {
  console.error('Error al enviar invitación:', inviteError);
  return;
}

console.log('Usuario Técnico creado exitosamente. Se ha enviado una invitación por correo electrónico.');
```

Una vez que el usuario Técnico recibe la invitación, establece su contraseña y accede al sistema, sus permisos ya están configurados según lo establecido por el Admin. La interfaz de usuario se adaptará automáticamente para mostrar solo las opciones permitidas según sus permisos.

## Almacenamiento de la Información de Roles

1. **Información del rol a nivel sistema**: 
   - Se almacena en el registro del usuario en `auth.users` en el campo `raw_app_meta_data->role`
   - Este rol determina el acceso general a la aplicación

2. **Definición del rol**:
   - Se almacena en la tabla `public.roles` como un registro con `id_rol`, `nombre` y `descripcion`
   - Aquí se definen los permisos y capacidades específicas del rol

3. **Asignación del rol a una correduría**:
   - Se almacena en la tabla `public.usuarios_corredurias` con una relación:
     - `auth_user_id` -> referencia al usuario en auth.users
     - `id_correduria` -> la correduría a la que se asigna
     - `id_rol` -> el rol específico que tendrá en esa correduría

4. **Permisos granulares**:
   - Se almacenan en la tabla `public.permisos_de_acceso` con:
     - `id_usuario` -> el UUID del usuario
     - `id_correduria` -> la correduría a la que aplican los permisos
     - Campos booleanos para cada acción específica (create, edit, delete)
     - Los permisos cubren entidades como pólizas y clientes
     - Las aseguradoras son gestionadas exclusivamente por superadmins

## Implementación mediante Edge Functions de Supabase

Para centralizar la lógica de creación de usuarios y asignación de permisos, se implementa una Edge Function en Supabase. Esto proporciona varias ventajas:

1. Mayor seguridad al centralizar la lógica en el servidor
2. Transacciones atómicas para garantizar la integridad de los datos
3. Punto único de mantenimiento para la lógica de gestión de usuarios
4. Simplificación del código en el frontend

### Edge Function para Creación de Usuarios Técnicos

```typescript
// supabase/functions/crear-usuario-tecnico/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestData {
  email: string;
  nombre: string;
  apellido: string;
  permisos: {
    polizas_create: boolean;
    polizas_edit: boolean;
    polizas_delete: boolean;
    clientes_create: boolean;
    clientes_edit: boolean;
    clientes_delete: boolean;
  };
}

serve(async (req) => {
  try {
    // Verificar autenticación y autorización
    const authHeader = req.headers.get('Authorization')!
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No se proporcionó token de autenticación' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Extraer token JWT
    const token = authHeader.replace('Bearer ', '')
    
    // Verificar el token y obtener el usuario
    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Usuario no autorizado o token inválido' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verificar que el usuario tenga rol 'admin' o 'superadmin'
    const adminRole = adminUser.app_metadata?.role
    if (adminRole !== 'admin' && adminRole !== 'superadmin') {
      return new Response(
        JSON.stringify({ error: 'No tiene permisos para crear usuarios técnicos' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obtener datos de la solicitud
    const { email, nombre, apellido, permisos }: RequestData = await req.json()

    // Verificar datos requeridos
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'El email es obligatorio' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 1. Crear el usuario en Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: null,
      email_confirm: false,
      user_metadata: {
        role: 'tecnico',
        nombre,
        apellido
      },
      app_metadata: {
        role: 'tecnico'
      }
    })

    if (createError) {
      return new Response(
        JSON.stringify({ error: `Error al crear usuario: ${createError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. Obtener la correduría del admin actual
    const { data: adminCorreduria, error: correError } = await supabaseAdmin
      .from('usuarios_corredurias')
      .select('id_correduria')
      .eq('auth_user_id', adminUser.id)
      .single()

    if (correError || !adminCorreduria) {
      // Eliminar el usuario creado para mantener la integridad
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      
      return new Response(
        JSON.stringify({ error: 'No se pudo obtener la correduría del administrador' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. Obtener el ID del rol técnico
    const { data: rolTecnico, error: rolError } = await supabaseAdmin
      .from('roles')
      .select('id_rol')
      .eq('nombre', 'Técnico')
      .single()

    if (rolError || !rolTecnico) {
      // Eliminar el usuario creado para mantener la integridad
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      
      return new Response(
        JSON.stringify({ error: 'No se pudo obtener el rol de técnico' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 4. Asignar usuario a la correduría
    const { error: assignError } = await supabaseAdmin
      .from('usuarios_corredurias')
      .insert({
        auth_user_id: newUser.user.id,
        id_correduria: adminCorreduria.id_correduria,
        id_rol: rolTecnico.id_rol,
        estado: true,
        fecha_creado: new Date().toISOString()
      })

    if (assignError) {
      // Eliminar el usuario creado para mantener la integridad
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      
      return new Response(
        JSON.stringify({ error: `Error al asignar correduría: ${assignError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 5. Configurar permisos específicos
    const { error: permisosError } = await supabaseAdmin
      .from('permisos_de_acceso')
      .insert({
        id_permiso: Date.now(),
        id_usuario: newUser.user.id,
        id_correduria: adminCorreduria.id_correduria,
        polizas_create: permisos?.polizas_create ?? false,
        polizas_edit: permisos?.polizas_edit ?? false,
        polizas_delete: permisos?.polizas_delete ?? false,
        clientes_create: permisos?.clientes_create ?? false,
        clientes_edit: permisos?.clientes_edit ?? false,
        clientes_delete: permisos?.clientes_delete ?? false
      })

    if (permisosError) {
      // Eliminar el usuario y la asignación de correduría para mantener la integridad
      await supabaseAdmin.from('usuarios_corredurias')
        .delete()
        .eq('auth_user_id', newUser.user.id)
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      
      return new Response(
        JSON.stringify({ error: `Error al configurar permisos: ${permisosError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 6. Enviar invitación para establecer contraseña
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)

    if (inviteError) {
      console.error('Error al enviar invitación:', inviteError)
      // Continuamos a pesar del error, ya que el usuario ya está creado correctamente
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Usuario técnico creado exitosamente',
        user: {
          id: newUser.user.id,
          email: newUser.user.email,
          role: 'tecnico'
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Error interno: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Llamada a la Edge Function desde el Frontend

```typescript
// En el componente de creación de usuario técnico
const crearUsuarioTecnico = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const { data, error: apiError } = await supabase.functions.invoke('crear-usuario-tecnico', {
      method: 'POST',
      body: {
        email: formData.value.email,
        nombre: formData.value.nombre,
        apellido: formData.value.apellido,
        permisos: {
          polizas_create: checkboxes.value.polizas_create,
          polizas_edit: checkboxes.value.polizas_edit,
          polizas_delete: checkboxes.value.polizas_delete,
          clientes_create: checkboxes.value.clientes_create,
          clientes_edit: checkboxes.value.clientes_edit,
          clientes_delete: checkboxes.value.clientes_delete
        }
      }
    });
    
    if (apiError) throw apiError;
    
    toast.success('Usuario técnico creado correctamente. Se ha enviado una invitación por correo.');
    router.push('/admin/usuarios');
  } catch (err) {
    console.error('Error al crear usuario técnico:', err);
    error.value = err.message || 'Error al crear usuario técnico';
  } finally {
    loading.value = false;
  }
};
```

### Ventajas de esta Implementación

1. **Seguridad Mejorada**: La Edge Function utiliza la clave de servicio (Service Role Key) que nunca se expone al cliente, lo que permite operaciones más seguras.

2. **Transacciones Atómicas**: Si ocurre un error en cualquier paso, se revierten los cambios para mantener la integridad de los datos.

3. **Validación Centralizada**: Todas las validaciones de permisos y datos se realizan en el servidor.

4. **Simplicidad en el Frontend**: El código del frontend se simplifica significativamente, delegando toda la lógica compleja al servidor.

5. **Mantenibilidad**: Cualquier cambio en la lógica de creación de usuarios se hace en un solo lugar, sin necesidad de actualizar múltiples componentes.

### Despliegue de la Edge Function

Para desplegar la Edge Function:

```bash
# Desde la raíz del proyecto
cd supabase/functions
supabase functions deploy crear-usuario-tecnico --project-ref <PROJECT_REF>
```

Esta implementación garantiza que la creación de usuarios técnicos y la asignación de permisos se realice de manera segura y consistente, aprovechando las capacidades de Edge Functions de Supabase para centralizar la lógica de negocio en el servidor.

## Implementación en el Frontend

En el frontend, el sistema verifica ambos niveles de roles:

```typescript
// Verificar acceso a módulos (basado en rol global)
const canAccessModule = (moduleName: string) => {
  const userRole = authStore.user?.app_metadata?.role;
  
  // Definir qué roles pueden acceder a qué módulos
  const moduleAccess = {
    'superadmin': ['dashboard', 'clients', 'policies', 'insurers', 'users', 'technical', 'corredurias', 'system'],
    'admin': ['dashboard', 'clients', 'policies', 'insurers', 'users', 'technical'],
    'tecnico': ['dashboard', 'technical', 'diagnostics'],
    'user': ['dashboard', 'clients', 'policies']
    // etc.
  };
  
  return moduleAccess[userRole]?.includes(moduleName) || false;
};

// Verificar permisos específicos (basado en permisos de acceso)
const checkPermission = async (permissionKey: string, entityType: string) => {
  // El superadmin siempre tiene todos los permisos
  if (authStore.user?.app_metadata?.role === 'superadmin') {
    return true;
  }
  
  // Para aseguradoras, solo el superadmin tiene permisos de edición y eliminación
  if (entityType === 'aseguradoras' && (permissionKey === 'edit' || permissionKey === 'delete')) {
    return authStore.user?.app_metadata?.role === 'superadmin';
  }
  
  // Obtener permisos del usuario para la correduría actual
  const { data } = await supabase
    .from('permisos_de_acceso')
    .select('*')
    .eq('id_usuario', authStore.user.id)
    .eq('id_correduria', currentCorreduriaId)
    .single();
    
  if (!data) return false;
  
  // Verificar el permiso específico basado en entityType y permissionKey
  // Ejemplo: entityType = 'polizas', permissionKey = 'create'
  const fullPermissionKey = `${entityType}_${permissionKey}`;
  return !!data[fullPermissionKey];
};
```

## Ejemplo de Asignación de Permisos

Para un nuevo usuario administrador, se configuraría así:

```typescript
// 1. Crear usuario en Auth con rol admin
const { user } = await createAdminUser(email, password);

// 2. Asignar usuario a correduría con rol admin
await assignUserToCorreduria(user.id, correduriaId);

// 3. Configurar permisos específicos
await supabase.from('permisos_de_acceso').insert({
  id_permiso: crypto.randomUUID(), // Generar un ID
  id_usuario: user.id,
  id_correduria: correduriaId,
  polizas_create: true,
  polizas_edit: true,
  polizas_delete: true,
  clientes_create: true,
  clientes_edit: true,
  clientes_delete: false  // No puede eliminar clientes
});
```

## Consultas de Permisos Simplificadas

Se ha implementado una función `get_user_permissions` que facilita la obtención de permisos:

```typescript
// Obtener todos los permisos de un usuario
const getUserPermissions = async (userId) => {
  const { data, error } = await supabase.rpc('get_user_permissions', {
    user_id: userId
  });
  
  if (error) {
    console.error('Error al obtener permisos:', error);
    return null;
  }
  
  return data;
};
```

## Ventajas de este Diseño

Este diseño permite:
- Que un usuario pueda tener diferentes roles en diferentes corredurías
- Que se puedan definir permisos granulares para cada tipo de rol
- Jerarquía clara entre roles (Superadmin > Admin > otros roles)
- Segregación precisa de responsabilidades y accesos
- Centralización de la gestión de aseguradoras en el rol Superadmin
- Control detallado a nivel de operación (crear, editar, eliminar) por entidad
- Simplicidad en la estructura de permisos al eliminar redundancias 

## Configuración Inicial de Roles en la Base de Datos

Para que el sistema funcione correctamente, es necesario configurar los roles base en la tabla `roles`. Esto se puede realizar mediante una migración SQL utilizando el MCP (Management Console Panel) de Supabase.

### Creación de la Tabla de Roles

Si la tabla aún no existe, primero debemos crearla con la siguiente estructura:

```sql
CREATE TABLE IF NOT EXISTS public.roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creado TIMESTAMP WITH TIME ZONE DEFAULT now(),
    fecha_actualizado TIMESTAMP WITH TIME ZONE
);
```

### Inserción de Roles Base

A continuación, insertamos los roles principales que necesita el sistema:

```sql
-- Insertar los roles principales en la tabla de roles
DO $$
BEGIN
    -- Insertar rol Superadmin si no existe
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'Superadmin') THEN
        INSERT INTO public.roles (nombre, descripcion)
        VALUES ('Superadmin', 'Administrador del sistema con acceso total a todas las características');
    END IF;

    -- Insertar rol Admin si no existe
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'Admin') THEN
        INSERT INTO public.roles (nombre, descripcion)
        VALUES ('Admin', 'Administrador de correduría con acceso a todas las funciones dentro de su correduría');
    END IF;

    -- Insertar rol Técnico si no existe
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'Técnico') THEN
        INSERT INTO public.roles (nombre, descripcion)
        VALUES ('Técnico', 'Personal técnico con acceso según los permisos configurados');
    END IF;

    -- Insertar rol Agente si no existe (rol opcional para futura expansión)
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'Agente') THEN
        INSERT INTO public.roles (nombre, descripcion)
        VALUES ('Agente', 'Agente de ventas con acceso a clientes y pólizas específicas');
    END IF;
    
    -- Insertar rol Cliente si no existe (rol opcional para portal de clientes)
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'Cliente') THEN
        INSERT INTO public.roles (nombre, descripcion)
        VALUES ('Cliente', 'Cliente final con acceso solo a sus propias pólizas y perfil');
    END IF;
END
$$;
```

### Aplicación de la Migración con MCP Supabase

Para aplicar esta migración utilizando MCP Supabase, sigue estos pasos:

1. Accede al panel de Supabase MCP
2. Selecciona el proyecto donde se encuentra tu base de datos
3. Utiliza la función `apply_migration` para ejecutar el script SQL:

```typescript
const aplicarMigracion = async () => {
  try {
    // Ejecutar la migración
    const resultado = await supabaseMCP.applyMigration({
      project_id: 'llecyyxwlicgmwmyrmtb', // ID de tu proyecto
      name: 'insertar_roles_sistema',
      query: `-- Aquí va el script SQL de arriba`
    });

    console.log('Migración aplicada correctamente');
    
    // Verificar los roles insertados
    const { data, error } = await supabaseMCP.executeSQL({
      project_id: 'llecyyxwlicgmwmyrmtb',
      query: 'SELECT * FROM public.roles ORDER BY id_rol;'
    });
    
    if (error) {
      console.error('Error al verificar roles:', error);
      return;
    }
    
    console.log('Roles configurados en el sistema:', data);
  } catch (error) {
    console.error('Error al aplicar migración:', error);
  }
};
```

### Verificación de los Roles

Una vez aplicada la migración, podemos verificar que los roles se hayan creado correctamente:

```sql
SELECT * FROM public.roles ORDER BY id_rol;
```

El resultado debería ser similar a este:

| id_rol | nombre     | descripcion                                                              |
|--------|------------|--------------------------------------------------------------------------|
| 1      | Superadmin | Administrador del sistema con acceso total a todas las características   |
| 2      | Admin      | Administrador de correduría con acceso a todas las funciones dentro de su correduría |
| 3      | Técnico    | Personal técnico con acceso según los permisos configurados              |
| 4      | Agente     | Agente de ventas con acceso a clientes y pólizas específicas            |
| 5      | Cliente    | Cliente final con acceso solo a sus propias pólizas y perfil             |

Estos roles base son esenciales para el funcionamiento del sistema de permisos descrito anteriormente. El script utiliza la cláusula `IF NOT EXISTS` para asegurar que no se dupliquen los registros si la migración se ejecuta varias veces. 

## Estructura y Configuración de la Tabla 'usuarios_corredurias'

La tabla `usuarios_corredurias` es fundamental para el sistema de roles, ya que vincula a los usuarios con sus corredurías asignadas y les asigna un rol específico dentro de cada correduría.

### Estructura de la Tabla

La tabla tiene la siguiente estructura:

```sql
CREATE TABLE public.usuarios_corredurias (
    id_usuario_correduria UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID NOT NULL REFERENCES perfiles(auth_user_id),
    id_correduria UUID NOT NULL REFERENCES corredurias(id_correduria),
    id_rol INTEGER NOT NULL REFERENCES roles(id_rol),
    estado BOOLEAN DEFAULT true,
    fecha_creado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice único para evitar duplicados (un usuario solo puede tener un rol por correduría)
CREATE UNIQUE INDEX usuarios_corredurias_user_correduria_unique 
  ON public.usuarios_corredurias (auth_user_id, id_correduria);

-- Documentación de la tabla
COMMENT ON TABLE public.usuarios_corredurias IS 'Tabla que asocia usuarios con corredurías y les asigna un rol específico.';
COMMENT ON COLUMN public.usuarios_corredurias.auth_user_id IS 'ID de usuario en auth.users';
COMMENT ON COLUMN public.usuarios_corredurias.id_correduria IS 'ID de la correduría a la que está asignado el usuario';
COMMENT ON COLUMN public.usuarios_corredurias.id_rol IS 'Rol que tiene el usuario en esta correduría';
COMMENT ON COLUMN public.usuarios_corredurias.estado IS 'Indica si la asignación está activa o no';
COMMENT ON COLUMN public.usuarios_corredurias.fecha_creado IS 'Fecha de creación del registro';
```

### Descripción de los Campos

1. **id_usuario_correduria**: Identificador único del registro, generado automáticamente.
2. **auth_user_id**: ID del usuario en el sistema de autenticación de Supabase (auth.users).
3. **id_correduria**: ID de la correduría a la que se asigna el usuario.
4. **id_rol**: Referencia al rol que tendrá el usuario en esta correduría (conecta con la tabla roles).
5. **estado**: Indica si la asignación está activa (true) o inactiva (false).
6. **fecha_creado**: Timestamp de cuando se creó la asignación.

### Relaciones con Otras Tablas

La tabla `usuarios_corredurias` tiene relaciones con:

1. **perfiles**: A través del campo `auth_user_id`, vincula con la información de perfil del usuario.
2. **corredurias**: A través del campo `id_correduria`, indica a qué correduría pertenece la asignación.
3. **roles**: A través del campo `id_rol`, define qué rol tiene el usuario en la correduría asignada.

### Restricciones Importantes

1. **Unicidad**: Un usuario solo puede tener un rol en una correduría específica.
2. **Integridad Referencial**: Las llaves foráneas garantizan que:
   - El usuario existe en la tabla `perfiles`
   - La correduría existe en la tabla `corredurias`
   - El rol existe en la tabla `roles`
3. **Valores Requeridos**: Los campos `auth_user_id`, `id_correduria` y `id_rol` son obligatorios (NOT NULL).

### Funcionamiento en el Sistema de Roles

Cuando un usuario inicia sesión, el sistema realiza los siguientes pasos:

1. Verifica el rol a nivel de autenticación en `auth.users`.
2. Consulta esta tabla para determinar:
   - A qué corredurías tiene acceso el usuario
   - Qué rol específico tiene en cada correduría

Si el usuario tiene acceso a múltiples corredurías, se le puede presentar un selector para elegir en cuál trabajar. Una vez seleccionada la correduría, su rol en esa correduría (obtenido de esta tabla) determina sus capacidades específicas.

### Ejemplo de Consulta para Obtener Corredurías y Roles de un Usuario

```sql
-- Obtener todas las corredurías y roles de un usuario
SELECT 
    uc.id_usuario_correduria,
    c.id_correduria,
    c.nombre AS nombre_correduria,
    r.id_rol,
    r.nombre AS nombre_rol,
    uc.estado
FROM 
    usuarios_corredurias uc
    JOIN corredurias c ON uc.id_correduria = c.id_correduria
    JOIN roles r ON uc.id_rol = r.id_rol
WHERE 
    uc.auth_user_id = '00000000-0000-0000-0000-000000000000' -- ID del usuario
    AND uc.estado = true;
```

Esta consulta se utilizaría, por ejemplo, para mostrar un selector de corredurías al usuario si tiene acceso a más de una. 

## Estado Actual de la Implementación

Tras revisar el código de la aplicación, podemos ver que ya existen elementos del sistema de roles implementados, pero se necesitan ajustes para seguir las mejores prácticas recomendadas de verificación en dos niveles.

### Componentes Existentes

1. **Autenticación en useSupabaseAuth.ts**:
   ```typescript
   // En useSupabaseAuth.ts
   const signIn = async (email: string, password: string): Promise<SignInResponse> => {
     // ...
     // Verificar el rol del usuario
     const userRole = data.user?.user_metadata?.role || 
                      data.user?.app_metadata?.role

     if (!userRole) {
       throw new Error('Usuario sin rol asignado')
     }
     // ...
   }
   ```
   - Ya verifica el rol en `user_metadata` o `app_metadata`
   - Devuelve el rol como parte de la respuesta de inicio de sesión

2. **Redirección basada en roles en Login.vue**:
   ```typescript
   // En Login.vue
   const onLogin = async () => {
     // ...
     // Redireccionar según el rol
     const redirectMap: Record<string, string> = {
       admin: 'dashboard',
       tecnico: 'tecnico-dashboard',
       superadmin: 'admin-dashboard'
     };

     const defaultRedirect = 'dashboard';
     const redirectRoute = role && role in redirectMap ? redirectMap[role] : defaultRedirect;

     await router.replace({ name: redirectRoute });
     // ...
   }
   ```
   - Implementa redirección específica basada en el rol del usuario
   - Diferencia entre admin, superadmin y tecnico

3. **Obtención de correduría en auth.store.ts**:
   ```typescript
   // En auth.store.ts
   const fetchUserCorreduria = async (userId: string): Promise<string> => {
     // ...
     const { data, error } = await supabase
       .from('usuarios_corredurias')
       .select('id_correduria')
       .eq('auth_user_id', userId)
       .eq('id_rol', 2) // ID del rol Admin
       .eq('estado', true)
     // ...
   }
   ```
   - Consulta la tabla `usuarios_corredurias` para obtener la correduría
   - Filtra por el id de rol específico (2 para Admin)

### Elementos Faltantes o a Mejorar

1. **Guards para rutas específicas por rol**:
   - No existe un guard específico para superadmin o admin
   - Solo hay verificación de autenticación general (`isAuthenticatedGuard`)
   - Se debe implementar un guard que verifique el rol en Auth y en la tabla

2. **Verificación en dos niveles en componentes**:
   - La mayoría de los componentes no verifican acceso basado en roles
   - No hay una función centralizada que combine la verificación de Auth y BD

3. **Función para verificar permisos granulares**:
   - No se encontró una función que verifique permisos específicos desde `permisos_de_acceso`

### Recomendaciones para Completar la Implementación

1. **Crear un guard para roles específicos**:
   ```typescript
   // src/modules/auth/guards/role-guard.ts
   import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
   import { useAuthStore } from '@/stores/auth.store';
   import { supabase } from '@/lib/supabase';

   export const createRoleGuard = (allowedRoles: string[]) => {
     return async (
       _to: RouteLocationNormalized,
       _from: RouteLocationNormalized,
       next: NavigationGuardNext,
     ) => {
       const authStore = useAuthStore();

       // Inicializar el store si es necesario
       if (authStore.loading) {
         await authStore.initialize();
       }

       if (!authStore.isAuthenticated) {
         return next({ name: 'login' });
       }

       try {
         // 1. Verificar rol a nivel de Auth (primera capa)
         const { data: { user } } = await supabase.auth.getUser();
         const authRole = user?.app_metadata?.role || user?.user_metadata?.role;
         
         if (!authRole || !allowedRoles.includes(authRole)) {
           return next({ name: 'unauthorized' });
         }

         // 2. Verificar en la base de datos (segunda capa, solo para admin)
         if (authRole === 'admin') {
           // Verificar que tenga asignación de correduría con rol admin
           const { data } = await supabase
             .from('usuarios_corredurias')
             .select('id_rol')
             .eq('auth_user_id', user.id)
             .eq('id_rol', 2) // ID del rol Admin
             .eq('estado', true);

           if (!data || data.length === 0) {
             return next({ name: 'unauthorized' });
           }
         }

         // Todo correcto, permitir acceso
         return next();
       } catch (error) {
         console.error('Error en role-guard:', error);
         return next({ name: 'error' });
       }
     };
   };

   // Uso:
   // export const adminGuard = createRoleGuard(['admin', 'superadmin']);
   // export const superadminGuard = createRoleGuard(['superadmin']);
   ```

2. **Crear un composable para verificación de permisos**:
   ```typescript
   // src/composables/usePermissions.ts
   import { ref, computed } from 'vue';
   import { supabase } from '@/lib/supabase';
   import { useAuthStore } from '@/stores/auth.store';

   export function usePermissions() {
     const authStore = useAuthStore();
     const permissionsLoaded = ref(false);
     const permissions = ref<Record<string, boolean>>({});
     
     // Verifica si el usuario es superadmin basado en auth
     const isSuperAdmin = computed(() => {
       return authStore.user?.app_metadata?.role === 'superadmin' || 
              authStore.user?.user_metadata?.role === 'superadmin';
     });
     
     // Verifica si el usuario es admin basado en auth y BD
     const isAdmin = computed(() => {
       const authRole = authStore.user?.app_metadata?.role || 
                       authStore.user?.user_metadata?.role;
       return authRole === 'admin' && !!authStore.id_correduria;
     });
     
     // Cargar permisos específicos desde permisos_de_acceso
     const loadPermissions = async () => {
       if (!authStore.user?.id) return;
       
       try {
         // Si es superadmin, tiene todos los permisos
         if (isSuperAdmin.value) {
           permissions.value = {
             polizas_create: true,
             polizas_edit: true,
             polizas_delete: true,
             clientes_create: true,
             clientes_edit: true,
             clientes_delete: true,
           };
           permissionsLoaded.value = true;
           return;
         }
         
         // Para otros roles, cargar desde la BD
         const { data } = await supabase
           .from('permisos_de_acceso')
           .select('*')
           .eq('id_usuario', authStore.user.id)
           .eq('id_correduria', authStore.id_correduria)
           .single();
         
         if (data) {
           permissions.value = {
             polizas_create: !!data.polizas_create,
             polizas_edit: !!data.polizas_edit,
             polizas_delete: !!data.polizas_delete,
             clientes_create: !!data.clientes_create,
             clientes_edit: !!data.clientes_edit,
             clientes_delete: !!data.clientes_delete,
           };
         }
         
         permissionsLoaded.value = true;
       } catch (error) {
         console.error('Error al cargar permisos:', error);
       }
     };
     
     // Verificar si tiene un permiso específico
     const hasPermission = (permissionKey: string): boolean => {
       // Superadmin siempre tiene todos los permisos
       if (isSuperAdmin.value) return true;
       
       // Para el resto, verificar en los permisos cargados
       return !!permissions.value[permissionKey];
     };
     
     return {
       permissions,
       permissionsLoaded,
       isSuperAdmin,
       isAdmin,
       loadPermissions,
       hasPermission
     };
   }
   ```

3. **Actualizar las rutas para usar los guards**:
   ```typescript
   // src/modules/admin/routes/index.ts
   import { adminGuard, superadminGuard } from '@/modules/auth/guards/role-guard';
   
   export const adminRoutes: RouteRecordRaw = {
     path: '/admin',
     name: 'admin',
     beforeEnter: adminGuard, // Solo admin y superadmin
     // ...
     children: [
       // ...
       {
         path: '/aseguradoras',
         name: 'aseguradoras',
         component: () => import('@/modules/admin/views/Aseguradoras.vue'),
         beforeEnter: superadminGuard, // Solo superadmin
       },
       // ...
     ]
   };
   ```

4. **Implementar verificación en componentes**:
   ```vue
   <!-- Ejemplo en un componente -->
   <template>
     <div>
       <button 
         v-if="permissions.hasPermission('polizas_create')"
         @click="createPolicy">
         Nueva Póliza
       </button>

       <!-- Solo visible para superadmin -->
       <button 
         v-if="permissions.isSuperAdmin"
         @click="manageAseguradoras">
         Gestionar Aseguradoras
       </button>
     </div>
   </template>

   <script setup>
   import { onMounted } from 'vue';
   import { usePermissions } from '@/composables/usePermissions';

   const permissions = usePermissions();

   onMounted(async () => {
     // Cargar permisos al montar el componente
     await permissions.loadPermissions();
   });
   </script>
   ```

Estas implementaciones asegurarán que se siga la mejor práctica de verificación en dos niveles: primero en Auth (`app_metadata` o `user_metadata`) y luego en la base de datos (tabla `usuarios_corredurias` y `permisos_de_acceso`). 