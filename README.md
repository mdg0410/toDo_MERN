# 📌 To-Do App con Autenticación

## 🛠️ Instalación de Herramientas (Punto 0)

Este documento describe los pasos iniciales para configurar el entorno de desarrollo de la aplicación **To-Do App con Autenticación**, incluyendo la instalación de dependencias para el frontend y backend.

---

## 📂 Estructura del Proyecto

```
📦 to-do-app/  
│  
├── 📂 backend/                # Backend con Node.js + Express  
│   ├── 📂 node_modules/       # Dependencias del backend  
│   ├── 📜 package.json        # Paquetes del backend  
│   ├── 📜 package-lock.json   # Bloqueo de versiones  
│  
├── 📂 frontend/               # Frontend con React + TypeScript  
│   ├── 📂 node_modules/       # Dependencias del frontend  
│   ├── 📜 package.json        # Paquetes del frontend  
│   ├── 📜 package-lock.json   # Bloqueo de versiones  
│  
├── 📜 .gitignore              # Ignora node_modules/  
└── 📜 README.md               # Documentación inicial
```

---

## 📌 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/to-do-app.git
cd to-do-app
```

---

## 📌 2️⃣ Configurar el Backend (Node.js + Express)

```bash
cd backend
npm init -y
npm install express mongoose dotenv cors bcrypt jsonwebtoken
```

✏️ **Descripción de paquetes:**
- `express` → Framework para manejar rutas y peticiones HTTP.
- `mongoose` → ORM para trabajar con MongoDB.
- `dotenv` → Manejo de variables de entorno.
- `cors` → Permite la comunicación entre el frontend y backend.
- `bcrypt` → Encriptación de contraseñas.
- `jsonwebtoken` → Manejo de autenticación con JWT.

---

## 📌 3️⃣ Configurar el Frontend (React + TypeScript + SWC + React Router)

```bash
cd ../frontend
npm create vite@latest . --template react-ts
npm install react-router-dom
```

✏️ **Descripción de paquetes:**
- `react-router-dom` → Manejo de navegación entre páginas.

---

## 📌 4️⃣ Ignorar node_modules en Git

Agrega esto en **`.gitignore`** para evitar subir dependencias innecesarias:
```bash
# Node.js dependencies
node_modules/
backend/node_modules/
frontend/node_modules/
```

---

## 📌 5️⃣ Levantar Servidores

**Backend:**
```bash
cd backend
node index.js  # O usar nodemon si está instalado
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Tu aplicación ahora estará corriendo en **`http://localhost:5173`** (frontend) y **`http://localhost:3000`** (backend).

---

## 🚀 ¡Listo para el siguiente paso!

Ahora que el entorno está configurado, pasamos al siguiente punto: **Definir la estructura de la base de datos**. 📌🔧

