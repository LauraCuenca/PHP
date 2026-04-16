<?php
use App\Database;
use App\Models\AssetModel;
use App\Models\UserModel;
use App\Models\AuthModel;

use App\Controllers\AssetController;
use App\Controllers\UserController;
use App\Controllers\AuthController;
use App\Middleware\AuthMiddleware;

return [
    Database::class => function() {
        return new Database(
            host: 'db',
            name: 'seminariophp',
            user: 'seminariophp',
            password: 'seminariophp'
        );
    },

    UserModel::class => function ($container) {
        return new UserModel(
            $container->get(Database::class)
        );
    },

    AuthModel::class => function ($container) {
        return new AuthModel(
            $container->get(Database::class)
        );
    },

    AssetModel::class => function ($container) {
        return new AssetModel(
            $container->get(Database::class)
        );
    },

    UserController::class => function ($container) {
        return new UserController(
            $container->get(UserModel::class)
        );
    },

    AssetController::class => function ($container) {
        return new AssetController(
            $container->get(AssetModel::class)
        );
    },

    AuthMiddleware::class => function ($container) {
        return new AuthMiddleware(
            $container->get(AuthModel::class)
        );
    },
];
?>