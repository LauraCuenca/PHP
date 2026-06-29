# WallyStreet

Simulador de inversiones desarrollado con PHP (backend) y React + Vite (frontend).

---

## Backend - API RESTful con Slim Framework

### Descripción

API RESTful desarrollada con Slim Framework en PHP que simula un entorno de mercado financiero. Los usuarios pueden invertir en distintos activos usando un saldo virtual inicial. Permite gestionar usuarios, consultar cotizaciones, realizar operaciones de compra y venta, y mantener un historial de transacciones. La comunicación se realiza mediante JSON siguiendo el modelo CRUD.

### Tecnologías

- **Slim Framework** - Framework para la API REST
- **PHP** - Lenguaje principal del backend
- **Composer** - Gestión de dependencias
- **JSON** - Formato de intercambio de datos
- **Docker** - Contenerización del proyecto
- **Docker Compose** - Orquestación de contenedores

### Base URL

La API se ejecuta mediante Docker con el siguiente mapeo de puertos:

```
SLIM_PORT=80
```

Disponible en: `http://localhost`

### Ejecución con Docker

```bash
# Construir contenedores
docker-compose build

# Levantar el proyecto
docker-compose up -d

# Detener contenedores
docker-compose down
```

### Instalación Manual (opcional)

```bash
composer install
php -S localhost:8000
```

### Ejemplos de Endpoints

```
POST http://localhost/trade/buy    → Comprar activo
POST http://localhost/trade/sell   → Vender activo
GET  http://localhost/assets       → Listar activos
GET  http://localhost/transactions → Historial de transacciones
```

---

## Frontend - React + Vite

### Descripción

Aplicación web desarrollada con React y Vite que consume la API del backend.

### Tecnologías

- **React** - Librería de interfaz de usuario
- **Vite** - Bundler y servidor de desarrollo
- **Bootstrap 5** - Diseño y componentes de UI

### Instalación de librerías externas

#### Bootstrap 5

Utilizada para modales, botones, cards, alertas y diseño general.

```bash
npm install bootstrap
```

Importada en `main.jsx`:

```js
import 'bootstrap/dist/css/bootstrap.min.css'
```

### Ejecución

```bash
npm install
npm run dev
```

---

## Endpoints modificados o agregados

### `GET /portfolio`

**Motivo:** se agregó el campo `avg_purchase_price` a la respuesta para que el frontend pueda mostrar si cada activo está al alza ↑ o a la baja ↓ respecto al precio de compra inicial. Se calcula como el promedio de todas las compras del usuario para ese activo usando un subquery sobre la tabla `transactions`.

**Campo agregado en la respuesta:**
```json
{
    "asset_id": 1,
    "name": "Bitcoin",
    "quantity": 2,
    "current_price": "60000.00",
    "total_value": "120000.00",
    "avg_purchase_price": "55000.00"
}
```

---

### `PUT /users/{id}`

**Motivo:** se agregó el parámetro `id` en la ruta para permitir que un administrador pueda editar la información de cualquier usuario desde la sección Manejo de Usuarios, reutilizando el formulario de edición.

---

### `GET /transactions`

**Motivo:** se implementaron filtros por tipo de operación (`buy`/`sell`) y por activo (`asset_id`). Además se modificó la consulta para incluir el nombre del activo (`asset_name`) mediante un JOIN con la tabla `assets`, permitiendo visualizar el historial en la sección Mis Operaciones sin requerir consultas adicionales desde el frontend.

### `POST /login`

**Motivo:** se implementaron cambios en como se envia el id.