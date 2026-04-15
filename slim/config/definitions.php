<?php
use App\Database;
use App\Models\AssetModel;
use App\Models\UserModel;


use App\Controllers\AssetController;
use App\Controllers\UserController;

return [
    Database::class => function() {
        return new Database(
            host: 'db',
            name: 'seminariophp',
            user: 'seminariophp',
            password: 'seminariophp'
        );
    },
    AssetModel::class => function ($container) {
        return new AssetModel(
            $container->get(Database::class)
        );
    },
    AssetController::class => function ($container) {
        return new AssetController(
            $container->get(AssetModel::class)
        );
    },
    UserModel::class => function ($container) {
        return new UserModel(
            $container->get(Database::class)
        );
    },
    UserController::class => function ($container) {
        return new UserController(
            $container->get(UserModel::class)
        );
    },
];