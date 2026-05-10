API RESTful con Slim Framework en PHP

Descripción del Proyecto

Este proyecto consiste en el desarrollo de una API RESTful utilizando Slim Framework en PHP.
El objetivo principal es simular un entorno de mercado financiero donde los usuarios pueden invertir en distintos activos utilizando un saldo virtual inicial. La API permite gestionar usuarios, consultar cotizaciones, realizar operaciones de compra y venta, y mantener un historial de transacciones.
La comunicación entre cliente y servidor se realiza mediante JSON, siguiendo el modelo CRUD.

Tecnologías Utilizadas

Slim Framework: Framework utilizado para la creación de la API REST
PHP: Lenguaje principal del backend
Composer: Gestión de dependencias
JSON: Formato de intercambio de datos
Docker: Contenerización del proyecto
Docker Compose: Orquestación de contenedores

Base URL
La API se ejecuta mediante Docker y utiliza el siguiente mapeo de puertos:

ports:
  - "${SLIM_PORT}:80"

En la configuración actual:

SLIM_PORT=80

Por lo tanto, la API se encuentra disponible en:

http://localhost

Ejemplos de Endpoints
POST http://localhost/trade/buy → Comprar activo
POST http://localhost/trade/sell → Vender activo
GET http://localhost/assets → Listar activos
GET http://localhost/history → Historial de transacciones

Ejecución con Docker
Construir contenedores:
docker-compose build

Levantar el proyecto:
docker-compose up -d

Acceder a la API:
http://localhost

Detener contenedores
docker-compose down

Instalación Manual (opcional)
composer install
php -S localhost:8000