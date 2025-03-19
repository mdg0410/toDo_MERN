# ToDo MERN Stack

## Descripción del Proyecto
Una aplicación de gestión de tareas y proyectos desarrollada con el stack MERN (MongoDB, Express, React y Node.js). Permite a los usuarios crear y gestionar proyectos y tareas asociadas a dichos proyectos.

## Características Implementadas
- Estructura de base de datos para usuarios, proyectos y tareas
- Autenticación de usuarios con contraseñas encriptadas
- Relaciones entre modelos para una gestión efectiva de los datos
- API RESTful para la gestión de recursos

## Estructura de la Base de Datos

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

## Próximos Pasos
- Implementación de controladores para las operaciones CRUD
- Middleware de autenticación
- Frontend en React
- Despliegue en producción

## Tecnologías Utilizadas
- MongoDB con Mongoose
- Express.js
- Node.js
- bcrypt (para encriptación)
- JWT (para autenticación)

## Licencia
ISC

