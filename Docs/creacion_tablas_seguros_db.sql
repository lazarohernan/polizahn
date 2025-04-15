CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SEQUENCE IF NOT EXISTS aseguradoras_id_aseguradora_seq;

CREATE TABLE IF NOT EXISTS aseguradoras (
  id_aseguradora uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre varchar(500) NOT NULL,
  nombre_gestor varchar(500),
  tel_gestor varchar(500),
  correo_gestor varchar(500),
  logo text,
  fecha_creado timestamp without time zone,
  creado_por uuid,
  fecha_modificado timestamp without time zone,
  modificado_por uuid
);

CREATE SEQUENCE IF NOT EXISTS clientes_id_cliente_seq;

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_correduria uuid NOT NULL,
  identificacion varchar(500) NOT NULL,
  correo varchar(500) NOT NULL,
  nombres varchar(500) NOT NULL,
  apellidos varchar(500) NOT NULL,
  dob date,
  empresa varchar(500),
  tel_1 varchar(500),
  tel_2 varchar(500),
  fecha_creado timestamp without time zone,
  creado_por uuid,
  fecha_modificado timestamp without time zone,
  modificado_por uuid
);

COMMENT ON COLUMN clientes.identificacion IS 'Puede ser DNI o RTN';

CREATE SEQUENCE IF NOT EXISTS usuarios_corredurias_id_usuario_seq;

CREATE TABLE IF NOT EXISTS usuarios_corredurias (
  id_usuario uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  correo varchar(500) NOT NULL UNIQUE,
  password text NOT NULL,
  nombre varchar(500) NOT NULL,
  fecha_creado timestamp without time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS polizas_id_poliza_seq;

CREATE TABLE IF NOT EXISTS polizas (
  id_poliza uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_correduria uuid NOT NULL,
  nombre varchar(500) NOT NULL,
  descripcion text,
  archivo_poliza text NOT NULL,
  fecha_poliza timestamp without time zone NOT NULL,
  fecha_creado timestamp without time zone NOT NULL,
  creado_por uuid NOT NULL,
  fecha_modificado timestamp without time zone,
  modificado_por uuid
);

CREATE SEQUENCE IF NOT EXISTS usuarios_por_correduria_id_seq;

CREATE TABLE IF NOT EXISTS usuarios_por_correduria (
  id bigint NOT NULL PRIMARY KEY,
  id_usuario uuid NOT NULL,
  id_correduria uuid
);

CREATE SEQUENCE IF NOT EXISTS pagos_de_polizas_id_pago_seq;

CREATE TABLE IF NOT EXISTS pagos_de_polizas (
  id_pago uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_plan uuid,
  abono numeric,
  fecha timestamp without time zone
);

CREATE SEQUENCE IF NOT EXISTS plan_de_pago_id_plan_seq;

CREATE TABLE IF NOT EXISTS plan_de_pago (
  id_plan uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_cliente uuid NOT NULL,
  id_poliza uuid NOT NULL,
  prima_total numeric NOT NULL,
  plazo integer NOT NULL,
  fecha_de_pago date NOT NULL,
  estado boolean NOT NULL,
  fecha_creado timestamp without time zone NOT NULL,
  creado_por uuid NOT NULL,
  fecha_modificado timestamp without time zone,
  modificado_por uuid
);

CREATE SEQUENCE IF NOT EXISTS corredurias_id_correduria_seq;

CREATE TABLE IF NOT EXISTS corredurias (
  id_correduria uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  tel varchar(500),
  correo varchar(500),
  direccion text,
  fecha_creado timestamp without time zone NOT NULL,
  creado_por uuid NOT NULL,
  fecha_modificado timestamp without time zone,
  modificado_por uuid
);

CREATE SEQUENCE IF NOT EXISTS usuarios_id_usuario_seq;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  identificacion varchar(500) NOT NULL,
  correo varchar(500) NOT NULL,
  password text NOT NULL,
  nombre varchar(500) NOT NULL,
  fecha_creado timestamp without time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS tokens_push_id_tokens_push_seq;

CREATE TABLE IF NOT EXISTS tokens_push (
  id_tokens_push uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_usuario uuid NOT NULL,
  token_push text NOT NULL UNIQUE,
  dispositivo varchar(500) NOT NULL,
  creado_en timestamp without time zone NOT NULL,
  actualizado_en timestamp without time zone
);

ALTER TABLE aseguradoras ADD CONSTRAINT aseguradoras_id_correduria_fk FOREIGN KEY (id_correduria) REFERENCES corredurias (id_correduria);
ALTER TABLE clientes ADD CONSTRAINT clientes_id_correduria_fk FOREIGN KEY (id_correduria) REFERENCES corredurias (id_correduria);
ALTER TABLE pagos_de_polizas ADD CONSTRAINT pagos_de_polizas_id_plan_fk FOREIGN KEY (id_plan) REFERENCES plan_de_pago (id_plan);
ALTER TABLE plan_de_pago ADD CONSTRAINT plan_de_pago_id_cliente_fk FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente);
ALTER TABLE plan_de_pago ADD CONSTRAINT plan_de_pago_id_poliza_fk FOREIGN KEY (id_poliza) REFERENCES polizas (id_poliza);
ALTER TABLE polizas ADD CONSTRAINT polizas_id_correduria_fk FOREIGN KEY (id_correduria) REFERENCES corredurias (id_correduria);
ALTER TABLE usuarios_por_correduria ADD CONSTRAINT usuarios_por_correduria_id_correduria_fk FOREIGN KEY (id_correduria) REFERENCES corredurias (id_correduria);
ALTER TABLE usuarios_por_correduria ADD CONSTRAINT usuarios_por_correduria_id_usuario_fk FOREIGN KEY (id_usuario) REFERENCES usuarios_corredurias (id_usuario);
ALTER TABLE tokens_push ADD CONSTRAINT tokens_push_id_usuario_fk FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario);