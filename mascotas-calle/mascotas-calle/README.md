# Mascotas Calle

Aplicación web para reportar y buscar mascotas perdidas (Node.js + Express + PostgreSQL).

## Requisitos
- Node.js 16 o superior
- Una base de datos PostgreSQL con las tablas `propietario`, `mascota`, `raza` y `publicidad`

## Instalación
```bash
npm install
cp .env.example .env   # y completa DATABASE_URL con tus datos
npm start
```
Abre http://localhost:3000

## Estructura
- `server.js` – API y servidor
- `public/` – páginas HTML, CSS y JS del cliente
