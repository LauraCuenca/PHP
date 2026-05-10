<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Middleware\AuthMiddleware;
use App\Controllers\UserController;
use App\Controllers\PortfolioController;
use App\Controllers\TradeController;

$app->group('/assets', function (RouteCollectorProxy $group) {
    $group->get('', [\App\Controllers\AssetController::class, 'getAll']);
    $group->get('/{asset_id}/history/{quantity}', [\App\Controllers\AssetController::class, 'getById']);
    $group->put('', [\App\Controllers\AssetController::class, 'update'])->add(\App\Middleware\AuthMiddleware::class);
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

$app->group('', function ($group) {
    $group->get('/portfolio', [PortfolioController::class, 'getPortfolio']);
    $group->delete('/portfolio/{asset_id}', [PortfolioController::class, 'deleteAsset']);
})->add(\App\Middleware\AuthMiddleware::class);

$app->post('/login', [\App\Controllers\AuthController::class, 'login']);
$app->post('/logout', [\App\Controllers\AuthController::class, 'logout'])
      ->add(AuthMiddleware::class);

$app->group('/trade', function (RouteCollectorProxy $group) {
    $group->post('/buy', [\App\Controllers\TradeController::class, 'buy']);
    $group->post('/sell', [\App\Controllers\TradeController::class, 'sell']);
})->add(\App\Middleware\AuthMiddleware::class);

$app->get('/transactions', [TradeController::class, 'getTransactions'])
    ->add(\App\Middleware\AuthMiddleware::class);

    
$app->get('/', function ($request, $response) {
    $response->getBody()->write("Api Funcionando");
    return $response;
});

?>