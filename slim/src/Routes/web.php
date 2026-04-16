<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Middleware\AuthMiddleware;

$app->group('/assets', function (RouteCollectorProxy $group) {
    $group->get('', [\App\Controllers\AssetController::class, 'getAll']);
    $group->get('/{asset_id}/history/{quantity}', [\App\Controllers\AssetController::class, 'getById']);
    $group->put('', [\App\Controllers\AssetController::class, 'update']);
});

$app->group('/users', function (RouteCollectorProxy $group) {
        $group->post('', [\App\Controllers\UserController::class, 'create']);
        $group->get('/{id}', [\App\Controllers\UserController::class, 'getById'])
          ->add(AuthMiddleware::class);
        $group->put('/{id}', [\App\Controllers\UserController::class, 'update'])
          ->add(\App\Middleware\AuthMiddleware::class);
        $group->get('', [\App\Controllers\UserController::class, 'getAll'])
          ->add(\App\Middleware\AuthMiddleware::class);
});

$app->post('/login', [\App\Controllers\AuthController::class, 'login']);
$app->post('/logout', [\App\Controllers\AuthController::class, 'logout'])
       ->add(AuthMiddleware::class);


//para probar la API
$app->get('/', function ($request, $response) {
    $response->getBody()->write("API funcionando");
    return $response;
});
?>