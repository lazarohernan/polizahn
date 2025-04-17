# Estructura de Base de Datos - Sistema de Seguros

## Roles del Sistema

El sistema cuenta con los siguientes roles:

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | Superadmin | Administrador del sistema con acceso total a todas las características |
| 2 | Admin | Administrador de correduría con acceso a todas las funciones dentro de su correduría |
| 3 | Técnico | Personal técnico con acceso según los permisos configurados |
| 4 | Cliente | Cliente final con acceso solo a sus propias pólizas y perfil |

## Tablas Principales y Relaciones

### Autenticación y Perfiles

- `auth.users`: Tabla gestionada por Supabase Auth para autenticación.
- `public.perfiles`: Contiene información adicional sobre usuarios autenticados.
  - Campos principales: `id_perfil`, `auth_user_id`, `nombre`, `apellido`, `correo`, `telefono`, `avatar_url`, `fecha_creado`
  - Se vincula a `auth.users` mediante el campo `auth_user_id`

### Clientes

- `public.clientes`: Almacena información de los clientes de las corredurías.
  - Campos principales: `id_cliente`, `identificacion`, `correo`, `nombres`, `apellidos`, `tel_1`, `tel_2`, `empresa`, `direccion`
  - `identificacion` es el campo clave para vincular clientes que acceden al sistema

### Corredurías

- `public.corredurias`: Información de las corredurías de seguros.
  - Campos principales: 
    - `id_correduria` (uuid, NOT NULL): Identificador único de la correduría
    - `nombre` (text, NOT NULL): Nombre de la correduría
    - `tel` (character varying): Número telefónico de contacto
    - `correo` (character varying): Correo electrónico de contacto
    - `direccion` (text): Dirección física
    - `fecha_creado` (timestamp, NOT NULL): Fecha de creación del registro
    - `creado_por` (uuid, NOT NULL): Usuario que creó el registro
    - `fecha_modificado` (timestamp): Fecha de última modificación
    - `modificado_por` (uuid): Usuario que realizó la última modificación

- `public.clientes_por_correduria`: Tabla de relación que vincula clientes con corredurías.
  - Campos:
    - `id_cliente_correduria` (uuid, NOT NULL): Identificador único de la relación
    - `id_cliente` (uuid, NOT NULL): Referencia al cliente
    - `id_correduria` (uuid, NOT NULL): Referencia a la correduría
    - `fecha_creado` (timestamp, NOT NULL): Fecha de creación del registro

- `public.usuarios_corredurias`: Asigna usuarios administrativos (roles 1, 2, 3) a corredurías.
  - Campos: `id_usuario_correduria`, `auth_user_id`, `id_correduria`, `id_rol`, `estado`

### Pólizas y Seguros

- `public.aseguradoras`: Compañías aseguradoras.
  - Campos principales:
    - `id_aseguradora` (uuid, NOT NULL): Identificador único de la aseguradora
    - `id_correduria` (uuid): Correduría asociada (opcional)
    - `nombre` (character varying, NOT NULL): Nombre de la aseguradora
    - `nombre_gestor` (character varying): Nombre del gestor de la aseguradora
    - `tel_gestor` (character varying): Teléfono del gestor
    - `correo_gestor` (character varying): Correo electrónico del gestor
    - `logo` (text): URL al logo de la aseguradora
    - `fecha_creado` (timestamp): Fecha de creación del registro
    - `creado_por` (uuid): Usuario que creó el registro
    - `fecha_modificado` (timestamp): Fecha de última modificación
    - `modificado_por` (uuid): Usuario que realizó la última modificación

- `public.polizas`: Información de las pólizas de seguro.
  - Campos principales:
    - `id_poliza` (uuid, NOT NULL): Identificador único de la póliza
    - `id_correduria` (uuid): Correduría asociada (opcional)
    - `nombre` (character varying, NOT NULL): Nombre de la póliza
    - `descripcion` (text): Descripción detallada
    - `archivo_poliza` (text, NOT NULL): URL al archivo de la póliza
    - `fecha_poliza` (timestamp, NOT NULL): Fecha de emisión de la póliza
    - `fecha_creado` (timestamp, NOT NULL): Fecha de creación del registro
    - `creado_por` (uuid, NOT NULL): Usuario que creó el registro
    - `fecha_modificado` (timestamp): Fecha de última modificación
    - `modificado_por` (uuid): Usuario que realizó la última modificación
    - `id_aseguradora` (uuid, NOT NULL): Aseguradora que emitió la póliza

- `public.plan_de_pago`: Planes de pago asociados a pólizas.
- `public.pagos_de_polizas`: Registro de pagos realizados.

### Siniestros

- `public.siniestros`: Registro de siniestros reportados.
- `public.documentos_siniestros`: Documentos asociados a siniestros.

## Composables y Manejo de Datos

### Composable useClientes

Este composable proporciona funcionalidades para gestionar clientes en el sistema:

- **Estado:**
  - `loading`: Estado de carga de las operaciones
  - `error`: Mensajes de error durante las operaciones
  - `clientes`: Lista de clientes cargados
  - `totalRegistros`, `paginaActual`, `limite`: Para paginación

- **Métodos:**
  - `getClientes(page, limit)`: Obtiene clientes con paginación
  - `getClienteById(id)`: Obtiene un cliente por su ID
  - `createCliente(cliente)`: Crea un nuevo cliente
  - `updateCliente(id, cliente)`: Actualiza información de un cliente
  - `deleteCliente(id)`: Elimina un cliente
  - `associateClienteWithCorreduria(idCliente, idCorreduria)`: Asocia un cliente con una correduría específica

El composable maneja automáticamente la asociación de clientes con corredurías cuando se crean nuevos clientes, utilizando la correduría actual del usuario autenticado.

## Acceso de Clientes al Sistema

Cuando un cliente desea acceder al sistema:

1. Se crea una cuenta en `auth.users`
2. Se crea un registro en `perfiles` vinculado a ese usuario
3. Se asigna el rol Cliente (id_rol = 4)
4. Se vincula con su(s) registro(s) en `clientes` mediante búsqueda por `identificacion`

Esta estructura permite:
- Clientes pueden tener perfiles en múltiples corredurías
- Un cliente autenticado puede ver todas sus pólizas en diferentes corredurías
- Mantener separada la información administrativa de la información de clientes

## Índices y Optimizaciones

- Índice en `clientes.identificacion` para optimizar la búsqueda de clientes por su identificación.

## Consideraciones Técnicas

- La tabla `usuarios_corredurias` solo se usa para usuarios administrativos (roles 1, 2, 3).
- Los clientes no se registran en `usuarios_corredurias` sino que se vinculan directamente a través de `clientes` y `clientes_por_correduria`.
- Se evita la duplicación de datos entre `auth.users`, `perfiles` y `clientes`. 


