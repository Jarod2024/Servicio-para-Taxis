# 🚕 TaxiApp - Sistema de Gestión de Viajes Premium

TaxiApp es una plataforma de movilidad urbana desarrollada con **Next.js 15**, **TypeScript** y **PostgreSQL**. El proyecto aplica principios de **Clean Architecture** para separar la lógica de negocio de la infraestructura, garantizando escalabilidad y mantenibilidad.

---

## 🚀 Características Principales

* **Doble Rol**: Dashboards personalizados para Clientes y Conductores.
* **Gestión en Tiempo Real**: Visualización de viajes pendientes y actualización de estados.
* **Arquitectura Limpia**: Separación clara entre entidades, repositorios y casos de uso.
* **Interfaz Moderna**: Diseño oscuro (Dark Mode) con efectos de cristal (Glassmorphism) usando Tailwind CSS.

---

## 🛠️ Tecnologías Utilizadas

* **Framework**: Next.js 15 (App Router)
* **Lenguaje**: TypeScript
* **Base de Datos**: PostgreSQL
* **ORM/Query Builder**: `pg` (Pool de conexiones nativo)
* **Estilos**: Tailwind CSS & Lucide Icons

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (Versión 18 o superior)
* [PostgreSQL](https://www.postgresql.org/) (Local o en la nube como Supabase/Neon)

---

## 🗄️ Configuración de la Base de Datos

Ejecuta el siguiente script SQL en tu terminal de PostgreSQL o herramienta de gestión (pgAdmin/DBeaver) para crear las tablas necesarias:

```sql
-- Crear tabla de Usuarios (Clientes y Conductores)
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('CLIENT', 'DRIVER')),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de Viajes
CREATE TABLE "Trip" (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED')),
    "clientId" INTEGER REFERENCES "User"(id),
    "driverId" INTEGER REFERENCES "User"(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
⚙️ Instalación y Configuración
Clonar el repositorio:

Bash

git clone [https://github.com/tu-usuario/taxi-app.git](https://github.com/tu-usuario/taxi-app.git)
cd taxi-app
Instalar dependencias:

Bash

npm install
Variables de Entorno: Crea un archivo .env en la raíz del proyecto y configura tus credenciales de base de datos:

Fragmento de código

DATABASE_URL=postgres://usuario:password@localhost:5432/nombre_db
Configuración de Imágenes (Unsplash): Asegúrate de que tu next.config.ts permita dominios externos:

TypeScript

images: {
  remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
}
🏃‍♂️ Ejecución
Inicia el servidor de desarrollo:

Bash

npm run dev
La aplicación estará disponible en http://localhost:3000.

📂 Estructura del Proyecto (Clean Architecture)
Plaintext

src/
├── app/              # Rutas de Next.js (Frontend y API Routes)
├── core/             # Reglas de negocio (Entidades e Interfaces)
├── use-cases/        # Lógica de aplicación (Aceptar viaje, Crear usuario)
├── infrastructure/   # Implementación de DB (Repositorios PostgreSQL)
├── lib/              # Configuración de herramientas (db.js, auth.js)
└── components/       # Componentes de UI reutilizables
🤝 Contribución
Haz un Fork del proyecto.

Crea una rama para tu función (git checkout -b feature/NuevaFuncion).

Haz commit de tus cambios (git commit -m 'Añadir nueva función').

Sube los cambios (git push origin feature/NuevaFuncion).

Abre un Pull Request.