<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

$app->group('/assets', function (RouteCollectorProxy $group) {
    $group->get('', [\App\Controllers\AssetController::class, 'getAll']);
    $group->get('/{asset_id}/history/{quantity}', [\App\Controllers\AssetController::class, 'getById']);
    $group->put('', [\App\Controllers\AssetController::class, 'update']);
});

$app->group('/users', function (RouteCollectorProxy $group) {
    $group->post('', [\App\Controllers\UserController::class, 'create']);
});

$app->get('/', function ($request, $response) {
    $response->getBody()->write("API funcionando");
    return $response;
});
?>