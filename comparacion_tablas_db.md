# Comparación de Estructuras de Base de Datos

Este documento lista las diferencias encontradas entre el respaldo de la base de datos (`seguros_db`) y la estructura actual de la base de datos.

## Tabla: aseguradoras

| Campo | En Respaldo | En Actual | Diferencia |
|-------|-------------|-----------|------------|
| id_aseguradora | uuid, NOT NULL, DEFAULT uuid_generate_v4() | uuid, NOT NULL, DEFAULT uuid_generate_v4() | ✅ Coincide |
| id_correduria | uuid, NOT NULL | uuid, NULL | ❌ En respaldo es NOT NULL |
| nombre | character varying(500), NOT NULL | character varying, NOT NULL | ✅ Coincide |
| nombre_gestor | character varying(500) | character varying | ✅ Coincide |
| tel_gestor | character varying(500) | character varying | ✅ Coincide |
| correo_gestor | character varying(500) | character varying | ✅ Coincide |
| logo | text | text | ✅ Coincide |
| fecha_creado | timestamp, NOT NULL, DEFAULT CURRENT_TIMESTAMP | timestamp, NULL | ❌ En respaldo es NOT NULL con DEFAULT |
| creado_por | uuid, NOT NULL | uuid, NULL | ❌ En respaldo es NOT NULL |
| fecha_modificado | timestamp | timestamp | ✅ Coincide |
| modificado_por | uuid | uuid | ✅ Coincide |
| estado | boolean, NOT NULL, DEFAULT true | No existe | ❌ Falta en actual |
| descripcion | text | No existe | ❌ Falta en actual |

## Tabla: clientes

| Campo | En Respaldo | En Actual | Diferencia |
|-------|-------------|-----------|------------|
| id_cliente | uuid, NOT NULL, DEFAULT uuid_generate_v4() | uuid, NOT NULL, DEFAULT uuid_generate_v4() | ✅ Coincide |
| id_correduria | uuid, NOT NULL | No existe | ❌ Falta en actual |
| identificacion | character varying(500), NOT NULL | character varying, NOT NULL | ✅ Coincide |
| correo | character varying(500), NOT NULL | character varying, NOT NULL | ✅ Coincide |
| nombres | character varying(500), NOT NULL | character varying, NOT NULL | ✅ Coincide |
| apellidos | character varying(500), NOT NULL | character varying, NOT NULL | ✅ Coincide |
| dob | date | date | ✅ Coincide |
| empresa | character varying(500) | character varying | ✅ Coincide |
| tel_1 | character varying(500) | character varying | ✅ Coincide |
| tel_2 | character varying(500) | character varying | ✅ Coincide |
| fecha_creado | timestamp | timestamp, NOT NULL, DEFAULT CURRENT_TIMESTAMP | ❌ En actual tiene más restricciones |
| creado_por | uuid | uuid, NOT NULL, DEFAULT auth.uid() | ❌ En actual tiene más restricciones |
| fecha_modificado | timestamp | timestamp | ✅ Coincide |
| modificado_por | uuid | uuid | ✅ Coincide |
| id_usuario_correduria | uuid, NOT NULL | No existe | ❌ Falta en actual |
| estado | boolean, NOT NULL, DEFAULT true | boolean, NOT NULL, DEFAULT true | ✅ Coincide |
| direccion | text | text | ✅ Coincide |
| foto | text | No existe | ❌ Falta en actual |
| search_vector | No existe | tsvector | ❌ Campo adicional en actual |

## Tabla: corredurias

| Campo | En Respaldo | En Actual | Diferencia |
|-------|-------------|-----------|------------|
| id_correduria | uuid, NOT NULL, DEFAULT uuid_generate_v4() | uuid, NOT NULL, DEFAULT uuid_generate_v4() | ✅ Coincide |
| nombre | text, NOT NULL | text, NOT NULL | ✅ Coincide |
| tel | character varying(500) | character varying | ✅ Coincide |
| correo | character varying(500) | character varying | ✅ Coincide |
| direccion | text | text | ✅ Coincide |
| fecha_creado | timestamp, NOT NULL, DEFAULT CURRENT_TIMESTAMP | timestamp, NOT NULL | ❌ En respaldo tiene DEFAULT |
| creado_por | uuid, NOT NULL | uuid, NOT NULL | ✅ Coincide |
| fecha_modificado | timestamp | timestamp | ✅ Coincide |
| modificado_por | uuid | uuid | ✅ Coincide |
| estado | boolean, NOT NULL, DEFAULT true | No existe | ❌ Falta en actual |
| logo | text | No existe | ❌ Falta en actual |

## Tabla: pagos_de_polizas

Esta tabla fue corregida previamente y ahora coincide con la estructura del respaldo.

## Tabla: plan_de_pago

| Campo | En Respaldo | En Actual | Diferencia |
|-------|-------------|-----------|------------|
| id_plan | uuid, NOT NULL, DEFAULT uuid_generate_v4() | uuid, NOT NULL, DEFAULT uuid_generate_v4() | ✅ Coincide |
| id_cliente | uuid, NOT NULL | uuid, NOT NULL | ✅ Coincide |
| id_poliza | uuid, NOT NULL | uuid, NOT NULL | ✅ Coincide |
| prima_total | numeric, NOT NULL | numeric, NOT NULL | ✅ Coincide |
| plazo | integer, NOT NULL | integer, NOT NULL | ✅ Coincide |
| fecha_de_pago | date, NOT NULL | date, NOT NULL | ✅ Coincide |
| estado | boolean, NOT NULL, DEFAULT true | boolean, NOT NULL | ❌ En respaldo tiene DEFAULT true |
| fecha_creado | timestamp, NOT NULL | timestamp, NOT NULL | ✅ Coincide |
| creado_por | uuid, NOT NULL | uuid, NOT NULL | ✅ Coincide |
| fecha_modificado | timestamp | timestamp | ✅ Coincide |
| modificado_por | uuid | uuid | ✅ Coincide |
| pago_uno | numeric, NOT NULL | numeric, NOT NULL | ✅ Coincide |
| numero_poliza | character varying(500), NOT NULL | character varying, NOT NULL | ✅ Coincide |
| archivo_poliza | text | text | ✅ Coincide |
| observacion | text | text | ✅ Coincide |

## Tabla: polizas

| Campo | En Respaldo | En Actual | Diferencia |
|-------|-------------|-----------|------------|
| id_poliza | uuid, NOT NULL, DEFAULT uuid_generate_v4() | uuid, NOT NULL, DEFAULT uuid_generate_v4() | ✅ Coincide |
| id_correduria | uuid, NOT NULL | uuid, NULL | ❌ En respaldo es NOT NULL |
| nombre | character varying(500), NOT NULL | character varying, NOT NULL | ✅ Coincide |
| descripcion | text | text | ✅ Coincide |
| archivo_poliza | text, NOT NULL | text, NOT NULL | ✅ Coincide |
| fecha_poliza | No existe | timestamp, NOT NULL | ❌ Campo adicional en actual |
| fecha_creado | timestamp, NOT NULL, DEFAULT CURRENT_TIMESTAMP | timestamp, NOT NULL | ❌ En respaldo tiene DEFAULT |
| creado_por | uuid, NOT NULL | uuid, NOT NULL | ✅ Coincide |
| fecha_modificado | timestamp | timestamp | ✅ Coincide |
| modificado_por | uuid | uuid | ✅ Coincide |
| id_aseguradora | uuid, NOT NULL | uuid, NOT NULL | ✅ Coincide |
| estado | boolean, NOT NULL, DEFAULT true | No existe | ❌ Falta en actual |

## Tabla: permisos_de_acceso

| Campo | En Respaldo | En Actual | Diferencia |
|-------|-------------|-----------|------------|
| id_permiso | integer, NOT NULL | integer, NOT NULL | ✅ Coincide |
| id_usuario | uuid, NOT NULL | uuid, NOT NULL | ✅ Coincide |
| id_correduria | uuid | uuid | ✅ Coincide |
| aseguradoras_create | boolean, NOT NULL, DEFAULT false | No existe | ❌ Falta en actual |
| aseguradoras_edit | boolean, NOT NULL, DEFAULT false | No existe | ❌ Falta en actual |
| aseguradoras_delete | boolean, NOT NULL, DEFAULT false | No existe | ❌ Falta en actual |
| aseguradoras_view | No existe | boolean, NOT NULL, DEFAULT false | ❌ Campo adicional en actual |
| polizas_create | boolean, NOT NULL, DEFAULT false | boolean, NOT NULL, DEFAULT false | ✅ Coincide |
| polizas_edit | boolean, NOT NULL, DEFAULT false | boolean, NOT NULL, DEFAULT false | ✅ Coincide |
| polizas_delete | boolean, NOT NULL, DEFAULT false | boolean, NOT NULL, DEFAULT false | ✅ Coincide |
| clientes_create | boolean, NOT NULL, DEFAULT false | boolean, NOT NULL, DEFAULT false | ✅ Coincide |
| clientes_edit | boolean, NOT NULL, DEFAULT false | boolean, NOT NULL, DEFAULT false | ✅ Coincide |
| clientes_delete | boolean, NOT NULL, DEFAULT false | boolean, NOT NULL, DEFAULT false | ✅ Coincide |

## Tabla: roles

| Campo | En Respaldo | En Actual | Diferencia |
|-------|-------------|-----------|------------|
| id_rol | integer, NOT NULL | integer, NOT NULL, DEFAULT nextval('roles_id_rol_seq'::regclass) | ✅ Coincide |
| rol | character varying(255), NOT NULL | No existe | ❌ Falta en actual |
| nombre | No existe | character varying, NOT NULL | ❌ Campo adicional en actual (equivalente a 'rol') |
| descripcion | No existe | text | ❌ Campo adicional en actual |

## Tabla: tokens_push

| Campo | En Respaldo | En Actual | Diferencia |
|-------|-------------|-----------|------------|
| id_tokens_push | uuid, NOT NULL, DEFAULT uuid_generate_v4() | No existe | ❌ Nombre diferente en actual (id_token) |
| id_token | No existe | uuid, NOT NULL, DEFAULT uuid_generate_v4() | ❌ Nombre diferente en respaldo (id_tokens_push) |
| id_usuario | uuid, NOT NULL | No existe | ❌ Nombre diferente en actual (auth_user_id) |
| auth_user_id | No existe | uuid | ❌ Nombre diferente en respaldo (id_usuario) |
| token_push | text, NOT NULL | No existe | ❌ Nombre diferente en actual (token) |
| token | No existe | text, NOT NULL | ❌ Nombre diferente en respaldo (token_push) |
| dispositivo | character varying(500), NOT NULL | character varying, NOT NULL | ✅ Coincide |
| creado_en | timestamp, NOT NULL | No existe | ❌ Nombre diferente en actual (fecha_creado) |
| fecha_creado | No existe | timestamp, DEFAULT CURRENT_TIMESTAMP | ❌ Nombre diferente en respaldo (creado_en) |
| actualizado_en | timestamp | No existe | ❌ Nombre diferente en actual (fecha_actualizado) |
| fecha_actualizado | No existe | timestamp | ❌ Nombre diferente en respaldo (actualizado_en) |

## Tablas faltantes en la base de datos actual

Las siguientes tablas existen en el respaldo pero no se encuentran en la base de datos actual:

1. refresh_tokens
2. usuarios
3. usuarios_por_correduria

## Tabla: usuarios_corredurias

Esta tabla tiene una estructura completamente diferente en el respaldo y en la base de datos actual.

### En el respaldo:
- id_usuario: uuid, NOT NULL, DEFAULT uuid_generate_v4()
- correo: character varying(500), NOT NULL
- password: text, NOT NULL
- nombre: character varying(500), NOT NULL
- fecha_creado: time without time zone, DEFAULT CURRENT_TIMESTAMP
- rol: integer, NOT NULL
- estado: boolean, DEFAULT true, NOT NULL
- foto: text

### En la base de datos actual:
- id_usuario_correduria: uuid, NOT NULL, DEFAULT uuid_generate_v4()
- auth_user_id: uuid, NOT NULL
- id_correduria: uuid, NOT NULL
- id_rol: integer, NOT NULL
- estado: boolean, DEFAULT true
- fecha_creado: timestamp with time zone, DEFAULT CURRENT_TIMESTAMP

Las estructuras son completamente diferentes y no tienen una correspondencia directa. 