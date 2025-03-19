# To-Do App con Autenticación

Aplicación de lista de tareas con funcionalidades de autenticación y autorización, desarrollada utilizando el stack MERN (MongoDB, Express, React, Node.js).

## Tecnologías Utilizadas

### Backend
- Node.js
- Express
- MongoDB con Mongoose
- JWT para autenticación
- Bcrypt para encriptación de contraseñas

### Frontend
- React con TypeScript
- Redux Toolkit para gestión de estado
- TailwindCSS para estilizado
- Vite como herramienta de construcción

## Estructura del Proyecto

```
to-do-app/
├── backend/         # Servidor Node.js con Express
├── frontend/        # Cliente React
├── README.md        # Este archivo
└── .gitignore       # Configuración de archivos ignorados por Git
```

## Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB (local o en la nube)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/to-do-app.git
   cd to-do-app
   ```

2. **Configurar el Backend**
   ```bash
   cd backend
   npm install
   # Crear archivo .env basado en env.example
   npm start
   ```

3. **Configurar el Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Características

- Registro y autenticación de usuarios
- Creación, lectura, actualización y eliminación de tareas (CRUD)
- Filtrado de tareas por estado
- Interfaz responsiva y amigable

## Contribución

Las contribuciones son bienvenidas. Por favor, siente libre de abrir un issue o enviar un pull request.

## Licencia

MIT

