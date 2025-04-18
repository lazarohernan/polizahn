# Relaciones entre Tablas de la Base de Datos

Este documento describe las principales relaciones entre las tablas de la base de datos y la lógica del negocio implementada.

## 1. Sistema de Usuarios y Autenticación

### Tablas Principales:
- `auth.users`: Almacena la información de autenticación (parte del sistema Supabase Auth)
- `perfiles`: Guarda datos complementarios de los usuarios
- `usuarios_corredurias`: Asocia usuarios con corredurías y asigna roles
- `roles`: Define los roles disponibles en el sistema
- `permisos_de_acceso`: Gestiona permisos granulares por usuario

### Relaciones:
- `perfiles.auth_user_id` → `auth.users.id`: Un perfil pertenece a un usuario autenticado
- `usuarios_corredurias.auth_user_id` → `perfiles.auth_user_id`: Un usuario puede estar asociado a múltiples corredurías
- `usuarios_corredurias.id_rol` → `roles.id_rol`: Cada usuario tiene un rol específico en cada correduría
- `usuarios_corredurias.id_correduria` → `corredurias.id_correduria`: Usuario asociado a una correduría

## 2. Gestión de Clientes y Corredurías

### Tablas Principales:
- `clientes`: Información de los asegurados
- `corredurias`: Empresas de corretaje de seguros
- `clientes_por_correduria`: Relación muchos a muchos entre clientes y corredurías
- `aseguradoras`: Compañías aseguradoras
- `agentes`: Agentes de seguros asociados a corredurías

### Relaciones:
- `clientes_por_correduria.id_cliente` → `clientes.id_cliente`: Asocia clientes a corredurías
- `clientes_por_correduria.id_correduria` → `corredurias.id_correduria`: Asocia corredurías a clientes
- `aseguradoras.id_correduria` → `corredurias.id_correduria`: Aseguradoras asociadas a corredurías
- `agentes.id_correduria` → `corredurias.id_correduria`: Agentes asociados a corredurías

## 3. Gestión de Pólizas y Pagos

### Tablas Principales:
- `polizas`: Pólizas de seguro ofrecidas
- `plan_de_pago`: Plan de pago para una póliza específica asignada a un cliente
- `pagos_de_polizas`: Registros de pagos realizados para un plan de pago

### Relaciones:
- `polizas.id_correduria` → `corredurias.id_correduria`: Pólizas pertenecen a una correduría
- `polizas.id_aseguradora` → `aseguradoras.id_aseguradora`: Pólizas ofrecidas por aseguradoras
- `plan_de_pago.id_poliza` → `polizas.id_poliza`: Plan de pago asociado a una póliza
- `plan_de_pago.id_cliente` → `clientes.id_cliente`: Plan de pago asignado a un cliente
- `pagos_de_polizas.id_plan` → `plan_de_pago.id_plan`: Pagos realizados para un plan específico

## 4. Sistema de Siniestros

### Tablas Principales:
- `siniestros`: Registro de siniestros reportados
- `documentos_siniestros`: Documentos asociados a siniestros

### Relaciones:
- `siniestros.id_cliente` → `clientes.id_cliente`: Siniestro reportado por un cliente
- `siniestros.id_correduria` → `corredurias.id_correduria`: Siniestro gestionado por una correduría
- `siniestros.id_poliza` → `polizas.id_poliza`: Siniestro asociado a una póliza
- `documentos_siniestros.id_siniestro` → `siniestros.id_siniestro`: Documentos pertenecientes a un siniestro

## 5. Módulos Adicionales

### Notificaciones:
- `notificaciones`: Notificaciones para usuarios
- `tokens_push`: Tokens para notificaciones push

### Relaciones:
- `notificaciones.id_correduria` → `corredurias.id_correduria`: Notificaciones para una correduría
- `notificaciones.auth_user_id`: Usuario destinatario de la notificación

### Soporte:
- `tickets_soporte`: Sistema de tickets de soporte
- `tickets_soporte.id_correduria` → `corredurias.id_correduria`: Ticket asociado a una correduría

### Configuración:
- `corredurias_configuraciones`: Configuraciones específicas por correduría
- `activity_log`: Registro de actividades en el sistema

### Relaciones:
- `corredurias_configuraciones.id_correduria` → `corredurias.id_correduria`: Configuraciones para una correduría
- `activity_log.id_correduria` → `corredurias.id_correduria`: Actividades asociadas a una correduría

## 6. Flujo de Datos Principal

1. Los **usuarios** (autenticados en `auth.users`) con un perfil en `perfiles` se asocian a una o más `corredurias` a través de `usuarios_corredurias`, con roles específicos.

2. Los **clientes** se asocian a `corredurias` a través de la tabla `clientes_por_correduria`.

3. Las **pólizas** pertenecen a una `correduría` y son ofrecidas por una `aseguradora`.

4. Cuando un cliente adquiere una póliza, se crea un `plan_de_pago` que relaciona al cliente con la póliza.

5. Los **pagos** realizados por el cliente se registran en `pagos_de_polizas`, vinculados al plan de pago.

6. En caso de un **siniestro**, se registra en la tabla `siniestros`, vinculado al cliente, la correduría y la póliza. Los documentos relacionados se almacenan en `documentos_siniestros`.

7. Las **notificaciones** y **tickets de soporte** están vinculados a corredurías y/o usuarios específicos.

## 7. Observaciones sobre el Modelo de Datos

- El sistema utiliza UUIDs como claves primarias en la mayoría de las tablas, lo que facilita la distribución y migración de datos.
- La implementación de la autenticación utiliza el esquema `auth` de Supabase.
- Se utiliza el patrón de auditoría con campos como `creado_por`, `fecha_creado`, `modificado_por` y `fecha_modificado` en varias tablas.
- El sistema implementa seguridad a nivel de fila (RLS) en varias tablas para control de acceso. 