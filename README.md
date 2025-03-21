# ToDo MERN - Aplicación de Lista de Tareas

## 📋 Descripción del Proyecto

ToDo MERN es una aplicación full-stack para gestión de tareas, desarrollada con el stack MERN (MongoDB, Express, React, Node.js). Permite a los usuarios crear cuentas, administrar tareas personales con fechas límite y prioridad, además de ofrecer filtrado y ordenamiento para una mejor organización.

## ✨ Características

- **Autenticación completa** con JWT, registro e inicio de sesión
- **CRUD de tareas** con validaciones en frontend y backend
- **Filtrado y ordenamiento** por estado, prioridad y fecha
- **Diseño responsivo** adaptado a dispositivos móviles y escritorio
- **Sistema de notificaciones** para tareas pendientes y vencidas
- **Modo oscuro/claro** para mejor experiencia de usuario

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js & Express
- MongoDB con Mongoose
- JWT para autenticación
- bcrypt para encriptación
- express-validator para validaciones
- cors, helmet para seguridad

### Frontend
- React 18 con hooks personalizados
- React Router v6 para navegación
- Axios para comunicación con API
- Tailwind CSS para estilos
- React-icons para iconografía
- React-datepicker para selección de fechas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### Configuración del Backend
```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno (crear archivo .env)
# Ver .env.example para referencia

# Iniciar servidor en modo desarrollo
npm run dev
```

### Configuración del Frontend
```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (crear archivo .env)
# Ver .env.example para referencia

# Iniciar aplicación React
npm start
```

## 📚 Documentación API

La API REST sigue principios RESTful y está versionada (v1).

### Endpoints principales:

#### Autenticación
- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/profile` - Obtener perfil del usuario autenticado

#### Tareas
- `GET /api/v1/tasks` - Obtener todas las tareas del usuario
- `POST /api/v1/tasks` - Crear nueva tarea
- `GET /api/v1/tasks/:id` - Obtener una tarea específica
- `PUT /api/v1/tasks/:id` - Actualizar una tarea
- `DELETE /api/v1/tasks/:id` - Eliminar una tarea

## 🧪 Testing

El proyecto incluye pruebas unitarias y de integración:

```bash
# Ejecutar pruebas del backend
cd backend
npm test

# Ejecutar pruebas del frontend
cd frontend
npm test
```

## 📝 Estructura del Proyecto

```
toDo_MERN/
├── backend/              # Servidor Express
│   ├── config/           # Configuración 
│   ├── controllers/      # Controladores
│   ├── middleware/       # Middlewares
│   ├── models/           # Modelos Mongoose
│   ├── routes/           # Rutas API
│   ├── services/         # Servicios y lógica de negocio
│   ├── utils/            # Utilidades
│   └── tests/            # Pruebas
│
└── frontend/             # Aplicación React
    ├── public/           # Archivos estáticos
    └── src/
        ├── components/   # Componentes React
        │   ├── auth/     # Componentes de autenticación
        │   ├── tasks/    # Componentes de tareas
        │   └── ui/       # Componentes de interfaz
        ├── context/      # Context API
        ├── hooks/        # Custom Hooks
        ├── pages/        # Páginas principales
        ├── services/     # Servicios API
        └── utils/        # Utilidades
```

## 👥 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Steven [Tu Apellido] - [tu.email@ejemplo.com]

Enlace del proyecto: [https://github.com/tu-usuario/toDo_MERN](https://github.com/tu-usuario/toDo_MERN)

