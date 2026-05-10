<?php
namespace App\Controllers;

use App\Models\PortfolioModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class PortfolioController {
    public function __construct(private PortfolioModel $portfolioModel){}
   
    public function getPortfolio(Request $request, Response $response) {
      $user = $request->getAttribute('user');
      $userId = $user['id'];

      $portfolio = $this->portfolioModel->getPortfolio($userId);

      return $this->json($response, $portfolio, 200);
    }

    public function deleteAsset(Request $request, Response $response, array $args){
      $user = $request->getAttribute('user');
      $userId = $user['id'];
      $assetId = (int)$args['asset_id'];

      $asset = $this->portfolioModel->getAsset($userId, $assetId);

      if (!$asset) {
         return $this->json($response, ["error" => "Activo no encontrado"], 404);
     }

      if ($asset['quantity'] != 0) {
         return $this->json($response, [
             "error" => "No puedes quitar un activo de tu portfolio si aún tienes unidades. Debes venderlas primero."
         ], 409);
     }
      $this->portfolioModel->deleteAsset($userId, $assetId);
     return $this->json($response, ["message" => "Activo eliminado"], 200);
    }

    public function getAsset(Request $request, Response $response, array $args) {
      $user = $request->getAttribute('user');
      $userId = $user['id'];
      $assetId = (int)$args['asset_id'];

      $asset = $this->portfolioModel->getAsset($userId, $assetId);

      if (!$asset) {
        return $this->json($response, ["error" => "Activo no encontrado"], 404);
     }

      return $this->json($response, $asset, 200);
}  

private function json(Response $response, $data, int $status = 200) {
    $response->getBody()->write(json_encode($data));
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status);
}

}
?>