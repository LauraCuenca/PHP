<?php
use App\Database;
use App\Models\AssetModel;
use App\Controllers\AssetController;

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
];