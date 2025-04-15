# Plataforma de Seguros

Aplicación web diseñada para corredores de seguros y administradores, permitiendo la gestión centralizada de pólizas, clientes y aseguradoras.

## Características

- 🔐 Sistema de autenticación y autorización
- 📋 Gestión de pólizas por corredor
- 👥 Administración de cartera de clientes
- 🏢 Gestión de aseguradoras
- 🔔 Sistema de notificaciones
- 🎨 Interfaz moderna y responsiva
- 🌙 Modo oscuro/claro

## Tecnologías

- Vue.js 3 con Composition API
- TypeScript
- Tailwind CSS
- Vite
- Vue Router
- Pinia para estado global
- Lucide Icons

## Requisitos Previos

- Node.js (versión LTS)
- npm
- Git

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/edzuniga/
cd seguros-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo .env basado en .env.example:

```bash
cp .env.example .env
```

4. Iniciar servidor de desarrollo:

```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── assets/      # Recursos estáticos
├── components/  # Componentes Vue
├── composables/ # Composables de Vue
├── router/      # Configuración de rutas
├── services/    # Servicios y APIs
├── stores/      # Estado global
├── types/       # Tipos TypeScript
└── views/       # Componentes de página
```

## Scripts Disponibles

- `npm run dev`: Inicia servidor de desarrollo
- `npm run build`: Compila para producción
- `npm run preview`: Vista previa de producción
- `npm run lint`: Ejecuta ESLint
- `npm run format`: Formatea código con Prettier

## Características en Desarrollo

- [ ] Sistema de registro controlado por administradores
- [ ] Implementación de roles y permisos
- [ ] CRUD completo de pólizas
- [ ] Sistema de validaciones por tipo de póliza
- [ ] Catálogo de productos de aseguradoras
- [ ] Sistema de notificaciones en tiempo real

## Contribución

1. Crear rama para nueva característica (`git checkout -b feature/nueva-caracteristica`)
2. Hacer commit de cambios (`git commit -am 'Agrega nueva característica'`)
3. Push a la rama (`git push origin feature/nueva-caracteristica`)
4. Crear Pull Request

## Licencia

Este proyecto es privado y de uso interno.
