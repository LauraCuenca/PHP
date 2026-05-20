<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use DI\ContainerBuilder;

require __DIR__ . '/vendor/autoload.php';

// Container
$builder = new ContainerBuilder();
$container = $builder->addDefinitions(__DIR__ . '/config/definitions.php')->build();

// Crear app
AppFactory::setContainer($container);
$app = AppFactory::create();

// Middlewares
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
        ->withHeader('Content-Type', 'application/json');
});
$app->addBodyParsingMiddleware();

// Rutas
require __DIR__ . '/src/Routes/web.php';

$app->run();
?>