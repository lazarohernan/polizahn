# Estructura de Tablas de la Base de Datos

Este documento detalla todas las tablas y sus campos en la base de datos.

## Tablas del Esquema Público

### 1. activity_log
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_actividad | uuid | NO | Identificador único, clave primaria |
| id_correduria | uuid | SÍ | Referencia a la correduría |
| auth_user_id | uuid | SÍ | ID del usuario que realizó la actividad |
| tipo_actividad | character varying | NO | Tipo de actividad registrada |
| descripcion | text | SÍ | Descripción detallada de la actividad |
| fecha | timestamp without time zone | SÍ | Fecha y hora del registro |

### 2. agentes
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_agente | uuid | NO | Identificador único, clave primaria |
| id_correduria | uuid | SÍ | Correduría a la que pertenece el agente |
| nombres | character varying | NO | Nombres del agente |
| apellidos | character varying | NO | Apellidos del agente |
| identificacion | character varying | NO | Número de identificación del agente |
| correo | character varying | NO | Correo electrónico del agente |
| telefono | character varying | SÍ | Número telefónico del agente |
| direccion | text | SÍ | Dirección física del agente |
| estado | boolean | SÍ | Estado del agente (activo/inactivo) |
| fecha_creado | timestamp without time zone | SÍ | Fecha de creación del registro |
| creado_por | uuid | SÍ | ID del usuario que creó el registro |
| fecha_modificado | timestamp without time zone | SÍ | Fecha de última modificación |
| modificado_por | uuid | SÍ | ID del usuario que modificó el registro |

### 3. aseguradoras
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_aseguradora | uuid | NO | Identificador único, clave primaria |
| id_correduria | uuid | SÍ | Correduría a la que está asociada la aseguradora |
| nombre | character varying | NO | Nombre de la aseguradora |
| nombre_gestor | character varying | SÍ | Nombre del gestor de la aseguradora |
| tel_gestor | character varying | SÍ | Teléfono del gestor |
| correo_gestor | character varying | SÍ | Correo electrónico del gestor |
| logo | text | SÍ | URL o ruta al logo de la aseguradora |
| fecha_creado | timestamp without time zone | SÍ | Fecha de creación del registro |
| creado_por | uuid | SÍ | ID del usuario que creó el registro |
| fecha_modificado | timestamp without time zone | SÍ | Fecha de última modificación |
| modificado_por | uuid | SÍ | ID del usuario que modificó el registro |

### 4. clientes
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_cliente | uuid | NO | Identificador único, clave primaria |
| identificacion | character varying | NO | Número de identificación del cliente |
| correo | character varying | NO | Correo electrónico del cliente |
| nombres | character varying | NO | Nombres del cliente |
| apellidos | character varying | NO | Apellidos del cliente |
| dob | date | SÍ | Fecha de nacimiento |
| empresa | character varying | SÍ | Empresa donde trabaja el cliente |
| tel_1 | character varying | SÍ | Teléfono principal |
| tel_2 | character varying | SÍ | Teléfono secundario |
| fecha_creado | timestamp without time zone | NO | Fecha de creación del registro |
| creado_por | uuid | NO | ID del usuario que creó el registro |
| fecha_modificado | timestamp without time zone | SÍ | Fecha de última modificación |
| modificado_por | uuid | SÍ | ID del usuario que modificó el registro |
| direccion | text | SÍ | Dirección física del cliente |
| estado | boolean | NO | Estado del cliente (activo/inactivo) |
| search_vector | tsvector | SÍ | Vector para búsquedas de texto |

### 5. clientes_por_correduria
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_cliente_correduria | uuid | NO | Identificador único, clave primaria |
| id_cliente | uuid | NO | Referencia al cliente |
| id_correduria | uuid | NO | Referencia a la correduría |
| fecha_creado | timestamp without time zone | NO | Fecha de creación del registro |

### 6. corredurias
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_correduria | uuid | NO | Identificador único, clave primaria |
| nombre | text | NO | Nombre de la correduría |
| tel | character varying | SÍ | Teléfono de contacto |
| correo | character varying | SÍ | Correo electrónico |
| direccion | text | SÍ | Dirección física |
| fecha_creado | timestamp without time zone | NO | Fecha de creación del registro |
| creado_por | uuid | NO | ID del usuario que creó el registro |
| fecha_modificado | timestamp without time zone | SÍ | Fecha de última modificación |
| modificado_por | uuid | SÍ | ID del usuario que modificó el registro |

### 7. corredurias_configuraciones
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_configuracion | uuid | NO | Identificador único, clave primaria |
| id_correduria | uuid | SÍ | Referencia a la correduría |
| clave | character varying | NO | Nombre de la configuración |
| valor | text | SÍ | Valor de la configuración |
| fecha_creado | timestamp without time zone | SÍ | Fecha de creación del registro |

### 8. documentos_siniestros
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_documento | uuid | NO | Identificador único, clave primaria |
| id_siniestro | uuid | NO | Referencia al siniestro |
| url_archivo | text | NO | URL o ruta al documento |

### 9. notificaciones
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_notificacion | uuid | NO | Identificador único, clave primaria |
| id_correduria | uuid | SÍ | Referencia a la correduría |
| auth_user_id | uuid | SÍ | ID del usuario destinatario |
| titulo | character varying | NO | Título de la notificación |
| mensaje | text | NO | Mensaje de la notificación |
| leida | boolean | SÍ | Indica si ha sido leída |
| fecha_creado | timestamp without time zone | SÍ | Fecha de creación |

### 10. pagos_de_polizas
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_pago | uuid | NO | Identificador único, clave primaria |
| id_plan | uuid | SÍ | Referencia al plan de pago |
| abono | numeric | SÍ | Monto del pago |
| fecha | timestamp without time zone | SÍ | Fecha del pago |
| metodo_pago | character varying | SÍ | Método utilizado para el pago |
| url_comprobante | text | SÍ | URL o ruta al comprobante de pago |
| creado_por | uuid | NO | ID del usuario que registró el pago |
| fecha_creado | timestamp without time zone | NO | Fecha de registro |
| modificado_por | uuid | SÍ | ID del usuario que modificó el registro |
| fecha_modificado | timestamp without time zone | SÍ | Fecha de última modificación |
| estado | boolean | NO | Estado del pago |

### 11. perfiles
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_perfil | uuid | NO | Identificador único, clave primaria |
| auth_user_id | uuid | NO | Referencia al usuario en auth.users |
| nombre | character varying | NO | Nombre del usuario |
| avatar_url | text | SÍ | URL o ruta a la imagen de perfil |
| fecha_creado | timestamp without time zone | SÍ | Fecha de creación |
| apellido | character varying | NO | Apellido del usuario |
| correo | character varying | NO | Correo electrónico |
| telefono | character varying | SÍ | Número telefónico |

### 12. permisos_de_acceso
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_permiso | integer | NO | Identificador único, clave primaria |
| id_usuario | uuid | NO | Referencia al usuario |
| id_correduria | uuid | SÍ | Referencia a la correduría |
| polizas_create | boolean | NO | Permiso para crear pólizas |
| polizas_edit | boolean | NO | Permiso para editar pólizas |
| polizas_delete | boolean | NO | Permiso para eliminar pólizas |
| clientes_create | boolean | NO | Permiso para crear clientes |
| clientes_edit | boolean | NO | Permiso para editar clientes |
| clientes_delete | boolean | NO | Permiso para eliminar clientes |
| aseguradoras_view | boolean | NO | Permiso para ver aseguradoras |

### 13. plan_de_pago
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_plan | uuid | NO | Identificador único, clave primaria |
| id_poliza | uuid | NO | Referencia a la póliza |
| prima_total | numeric | NO | Monto total de la prima |
| plazo | integer | NO | Plazo en meses o períodos |
| fecha_de_pago | date | NO | Fecha establecida para el pago |
| estado | boolean | NO | Estado del plan de pago |
| fecha_creado | timestamp without time zone | NO | Fecha de creación |
| creado_por | uuid | NO | ID del usuario que creó el registro |
| fecha_modificado | timestamp without time zone | SÍ | Fecha de última modificación |
| modificado_por | uuid | SÍ | ID del usuario que modificó el registro |
| id_cliente | uuid | NO | Referencia al cliente |
| pago_uno | numeric | NO | Monto del primer pago |
| numero_poliza | character varying | NO | Número de la póliza |
| archivo_poliza | text | SÍ | URL o ruta al archivo de la póliza |
| observacion | text | SÍ | Observaciones adicionales |

### 14. polizas
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_poliza | uuid | NO | Identificador único, clave primaria |
| id_correduria | uuid | SÍ | Referencia a la correduría |
| nombre | character varying | NO | Nombre de la póliza |
| descripcion | text | SÍ | Descripción detallada |
| archivo_poliza | text | NO | URL o ruta al archivo de la póliza |
| fecha_poliza | timestamp without time zone | NO | Fecha de la póliza |
| fecha_creado | timestamp without time zone | NO | Fecha de creación |
| creado_por | uuid | NO | ID del usuario que creó el registro |
| fecha_modificado | timestamp without time zone | SÍ | Fecha de última modificación |
| modificado_por | uuid | SÍ | ID del usuario que modificó el registro |
| id_aseguradora | uuid | NO | Referencia a la aseguradora |

### 15. roles
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_rol | integer | NO | Identificador único, clave primaria |
| nombre | character varying | NO | Nombre del rol |
| descripcion | text | SÍ | Descripción del rol |

### 16. siniestros
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_siniestro | uuid | NO | Identificador único, clave primaria |
| id_cliente | uuid | NO | Referencia al cliente |
| id_correduria | uuid | NO | Referencia a la correduría |
| fecha_creado | timestamp without time zone | NO | Fecha de creación |
| id_poliza | uuid | NO | Referencia a la póliza |
| descripcion | text | NO | Descripción del siniestro |
| estatus | character varying | NO | Estado del siniestro |

### 17. tickets_soporte
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_ticket | uuid | NO | Identificador único, clave primaria |
| id_correduria | uuid | SÍ | Referencia a la correduría |
| auth_user_id | uuid | SÍ | ID del usuario que creó el ticket |
| asunto | character varying | NO | Asunto del ticket |
| descripcion | text | NO | Descripción del problema |
| estado | character varying | SÍ | Estado del ticket |
| fecha_creado | timestamp without time zone | SÍ | Fecha de creación |
| fecha_actualizado | timestamp without time zone | SÍ | Fecha de última actualización |

### 18. tokens_push
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_token | uuid | NO | Identificador único, clave primaria |
| auth_user_id | uuid | SÍ | ID del usuario |
| token | text | NO | Token para notificaciones push |
| dispositivo | character varying | NO | Identificador del dispositivo |
| fecha_creado | timestamp without time zone | SÍ | Fecha de creación |
| fecha_actualizado | timestamp without time zone | SÍ | Fecha de última actualización |

### 19. usuarios_corredurias
| Campo | Tipo de Dato | Nulo | Descripción |
|-------|--------------|------|-------------|
| id_usuario_correduria | uuid | NO | Identificador único, clave primaria |
| auth_user_id | uuid | NO | Referencia al usuario en auth.users |
| id_correduria | uuid | NO | Referencia a la correduría |
| id_rol | integer | NO | Referencia al rol del usuario |
| estado | boolean | SÍ | Estado de la asignación |
| fecha_creado | timestamp with time zone | SÍ | Fecha de creación |

## Tablas del Esquema Auth

### 1. users
Tabla principal del sistema de autenticación de Supabase.

| Campo Clave | Tipo de Dato | Descripción |
|-------------|--------------|-------------|
| id | uuid | Identificador único del usuario |
| email | character varying | Correo electrónico |
| encrypted_password | character varying | Contraseña encriptada |
| raw_user_meta_data | jsonb | Metadatos adicionales del usuario |
| created_at | timestamp with time zone | Fecha de creación |
| updated_at | timestamp with time zone | Fecha de actualización |

### 2. refresh_tokens
Tabla para manejar los tokens de refresco para JWT.

| Campo Clave | Tipo de Dato | Descripción |
|-------------|--------------|-------------|
| id | bigint | Identificador único del token |
| token | character varying | Token de refresco |
| user_id | character varying | ID del usuario |
| session_id | uuid | ID de la sesión |
| created_at | timestamp with time zone | Fecha de creación |
| updated_at | timestamp with time zone | Fecha de actualización | 