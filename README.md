# ToDo MERN - Aplicación de Gestión de Tareas

Una aplicación completa para gestionar proyectos y tareas, construida con el stack MERN (MongoDB, Express, React, Node.js).

## Índice

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración](#configuración)
5. [API Endpoints](#api-endpoints)
6. [Pruebas con Postman](#pruebas-con-postman)

## Requisitos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd toDo_MERN
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la carpeta backend con:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/todo_mern
JWT_SECRET=palabrasecreta
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El servidor se iniciará en `http://localhost:4000`

## Estructura del Proyecto

### Modelo de Usuario
- Nombre
- Correo electrónico (único)
- Contraseña (encriptada automáticamente)
- Fecha de creación y actualización

### Modelo de Proyecto
- Nombre
- Descripción
- Usuario propietario (relación)
- Fecha de creación y actualización

### Modelo de Tarea
- Título
- Descripción
- Estado (pendiente, en progreso, completada)
- Proyecto asociado (relación)
- Usuario asignado (relación)
- Fecha de creación y actualización

## Configuración del Backend

### Requisitos Previos
- Node.js (versión 14 o superior)
- MongoDB (local o Atlas)

### Pasos para la Instalación

1. Clonar el repositorio
```
git clone <url-del-repositorio>
cd toDo_MERN
```

2. Instalar dependencias del backend
```
cd backend
npm install
```

3. Crear archivo de variables de entorno
Crear un archivo `.env` en el directorio `/backend` con las siguientes variables:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/todo_mern
JWT_SECRET=palabrasecreta
```

4. Iniciar el servidor de desarrollo
```
npm run dev
```

El servidor se iniciará en `http://localhost:4000`

## Backend

### Resumen de Implementación

El backend de la aplicación está construido con Node.js, Express, MongoDB y Mongoose, siguiendo una arquitectura RESTful. Las principales características implementadas son:

#### Sistema de Autenticación
- Registro de usuarios con encriptación de contraseñas (bcrypt)
- Login con generación de token JWT
- Middleware de verificación de token para rutas protegidas

#### Gestión de Proyectos
- CRUD completo para proyectos
- Cada proyecto está vinculado a su usuario creador
- Protección de rutas para garantizar que solo el creador pueda modificar/eliminar

#### Gestión de Tareas
- CRUD completo para tareas
- Relaciones con proyectos y usuarios asignados
- Filtrado por proyecto, usuario asignado o estado
- Endpoint específico para obtener tareas por proyecto

#### Estructura de Datos
- **Usuarios**: autenticación y perfil
- **Proyectos**: agrupación lógica de tareas
- **Tareas**: unidades de trabajo con estado y asignación

#### Seguridad
- Tokens JWT para mantener sesiones
- Validación de datos en endpoints
- Manejo de errores centralizado

### Rutas API Principales

| Categoría | Método | Ruta | Descripción |
|-----------|--------|------|-------------|
| Auth | POST | `/api/auth/register` | Registro de usuario |
| Auth | POST | `/api/auth/login` | Login de usuario |
| Auth | GET | `/api/auth/user` | Verificar usuario autenticado |
| Proyectos | GET | `/api/projects` | Obtener todos los proyectos |
| Proyectos | POST | `/api/projects` | Crear un proyecto |
| Proyectos | GET | `/api/projects/:id` | Obtener un proyecto |
| Proyectos | GET | `/api/projects/:id/tasks` | Obtener tareas de un proyecto |
| Tareas | GET | `/api/tasks` | Obtener tareas (con filtros opcionales) |
| Tareas | POST | `/api/tasks` | Crear una tarea |
| Tareas | PUT | `/api/tasks/:id` | Actualizar una tarea |
| Tareas | DELETE | `/api/tasks/:id` | Eliminar una tarea |

Para más detalles sobre cómo probar estos endpoints, consulta la [sección de pruebas con Postman](#pruebas-con-postman).

## Próximos Pasos
- Frontend en React
- Despliegue en producción

## Tecnologías Utilizadas
- MongoDB con Mongoose
- Express.js
- Node.js
- bcrypt (para encriptación)
- JWT (para autenticación)

## Testing

Este proyecto utiliza Jest para realizar pruebas en el frontend y backend.

### Comandos disponibles

Para ejecutar todas las pruebas:
```bash
npm test
```

Para ejecutar solo pruebas del backend:
```bash
npm run test:backend
```

Para ejecutar solo pruebas del frontend:
```bash
npm run test:frontend
```

Para ejecutar pruebas en modo observador (que se re-ejecutan automáticamente al modificar archivos):
```bash
npm run test:watch        # Todos los tests
npm run test:backend:watch    # Solo backend
npm run test:frontend:watch   # Solo frontend
```

Para obtener informes de cobertura:
```bash
npm run test:coverage         # Todos los tests
npm run test:backend:coverage # Solo backend
npm run test:frontend:coverage # Solo frontend
```

### Estructura de las pruebas

- Backend: `backend/__tests__/`
- Frontend: `frontend/__tests__/`

## Licencia
ISC

