<?php
namespace App\Controllers;

use App\Models\TradeModel;
use App\Models\AssetModel;
use App\Middleware\AuthMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class TradeController {

    public function __construct(private $tradeModel, private $assetModel) {}

public function sell(Request $request, Response $response) {
    $user = $request->getAttribute('user');

    if (!$user) {
        return $this->json($response, ['error' => 'Unauthorized'], 401);
    }
    $userId = $user['id'];
    $data = $request->getParsedBody();

    $assetId = $data['asset_id'] ?? null;
    $quantity = (int)($data['quantity'] ?? 0);

    if (!$assetId || !is_numeric($assetId)) {
        return $this->json($response, ['error' => 'Invalid asset_id'], 400);
    }
    if ($quantity <= 0) {
        return $this->json($response, ['error' => 'Cantidad no válida'], 400);
    }
    $asset = $this->assetModel->getById($assetId);
    if (!$asset) {
        return $this->json($response, ['error' => 'Activo no encontrado'], 404);
    }

    $cantidadPortfolio = $this->tradeModel->getPortfolioQuantity($userId, $assetId);

    if ($cantidadPortfolio < $quantity) {
        return $this->json($response, [
            'error' => 'Cantidad de activos insuficientes para la venta'
        ], 409);
    }
    $result = $this->tradeModel->sellAsset(
        $userId,
        $assetId,
        $quantity,
        $asset['current_price']
    );

    if ($result['success']) {
        return $this->json($response, ['mensaje' => 'Venta realizada con éxito'], 200);
    }

    return $this->json($response, [
        'error' => 'No se pudo realizar la venta',
        'detalle' => $result['message'] ?? null
    ], 409);
}
public function buy(Request $request, Response $response) {
    $user = $request->getAttribute('user');

    if (!$user) {
        return $this->json($response, ['error' => 'Unauthorized'], 401);
    }

    $userId = $user['id'];
    $data = $request->getParsedBody();

    $assetId = $data['asset_id'] ?? null;
    $quantity = (int)($data['quantity'] ?? 0);

    if (!$assetId || !is_numeric($assetId)) {
        return $this->json($response, ['error' => 'Invalid asset_id'], 400);
    }

    if ($quantity <= 0) {
        return $this->json($response, ['error' => 'Cantidad no válida'], 400);
    }

    $asset = $this->assetModel->getById($assetId);

    if (!$asset) {
        return $this->json($response, ['error' => 'Activo no encontrado'], 404);
    }

    if ($asset['current_price'] == 0) {
    return $this->json($response, [
        'error' => 'No se puede comprar un activo con precio 0'
    ], 400);
    }   

    $totalCost = $asset['current_price'] * $quantity;
    $userBalance = $this->tradeModel->getUserBalance($userId);

    if ($userBalance < $totalCost) {
        return $this->json($response, ['error' => 'Saldo insuficiente'], 409);
    }

    $result = $this->tradeModel->buyAsset(
        $userId,
        $assetId,
        $quantity,
        $asset['current_price']
    );

    if ($result['success']) {
        return $this->json($response, ['mensaje' => 'Compra realizada con éxito'], 200);
    }

    return $this->json($response, [
        'error' => 'No se pudo realizar la compra',
        'detalle' => $result['message'] ?? null
    ], 409);
}

public function getTransactions(Request $request, Response $response){
    $user = $request->getAttribute('user');

    if (!$user) {
        return $this->json($response, ['error' => 'Unauthorized'], 401);
    }

    $userId = $user['id'];
    $params = $request->getQueryParams();

    $type = $params['type'] ?? null;
    $assetId = $params['asset_id'] ?? null;

    if ($type && !in_array($type, ['buy', 'sell'])) {
        return $this->json($response, ['error' => 'Invalid transaction type'], 400);
    }

    if ($assetId && !is_numeric($assetId)) {
        return $this->json($response, ['error' => 'Invalid asset_id'], 400);
    }

    $assetId = $assetId ? (int)$assetId : null;

    $transactions = $this->tradeModel->getTransactions(
        $userId,
        $type,
        $assetId
    );

    return $this->json($response, $transactions, 200);
}

private function json(Response $response, $data, int $status = 200): Response {
    $response->getBody()->write(json_encode($data));
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status);
}
}
?>
