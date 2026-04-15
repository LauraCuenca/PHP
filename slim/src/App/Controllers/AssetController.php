<?php
namespace App\Controllers;
use App\Models\AssetModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Exception;

class AssetController {

public function __construct(private $assetModel) {}

        public function getAll(Request $request, Response $response, $args) {
        $params = $request->getQueryParams();
        $nombre = $params['type'] ?? null;
        $minPrice = $params['min_price'] ?? null;
        $maxPrice = $params['max_price'] ?? null;
        $rows = $this->assetModel->getAssetByFilter($nombre, $minPrice, $maxPrice);
        if (empty ($rows)) {
            $mensaje = 'No se encontraron activos.';
        $response->getBody()->write(json_encode([
            'message' => $mensaje,
            'Sugerencia' => 'Intente con otros criterios de búsqueda.'
        ]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);;
        }
        else {
        $activos = array_map(function ($row) {
            return [
                'Nombre' => $row['name'],
                'Precio' => $row['current_price'],
            ];
        }, $rows);
        $response->getBody()->write(json_encode([
            'Mensaje' => 'Activos encontrados.',
            'Activos' => $activos
        ]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        }
    }

    public function getById(Request $request, Response $response, $args) {
        $assetId = $args['asset_id'];
        $quantity = (int)$args['quantity'];
        $asset = $this->assetModel->getById($assetId);
        if(!$asset) {
            $payload = ['Mensaje' => 'Activo no encontrado.'];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }
        else{
            if ($quantity <= 0 || $quantity > 5) {
                $payload = ['Mensaje' => 'Cantidad no válida.'];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
            else {
                $historial = $this->assetModel->getHistory($assetId, $quantity);
                $payload = [
                    'Nombre' => $asset['name'],
                    'Historial' => $historial
                ];
                $response->getBody()->write(json_encode($payload));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            }
        }
    }

    public function update(Request $request, Response $response, $args) {
        $user = $request->getAttribute('user');
        if (!$user || $user['is_admin'] == 0) {
            $payload = ['Mensaje' => 'Acceso denegado.'];
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }
        else {
            $asset = $this->assetModel->getAll();
            foreach ($asset as $activo) {
                $timestamp = strtotime($activo['last_update']);
                $nuevoPrecio = $this->variarPrecioPorTiempo($activo['current_price'], $timestamp);
                $this->assetModel->updatePrice($activo['id'], $nuevoPrecio);
            }
            $response->getBody()->write(json_encode(['Mensaje' => 'Precios actualizados.']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        }
    }

    private function variarPrecioPorTiempo(float $precioActual, int $timestampUltimaVez, float $volatilidadPorSegundo = 0.05) {
        $tiempoPasado = time() - $timestampUltimaVez;
        if ($tiempoPasado <= 0)
            return $precioActual;
        $direccion = mt_rand(-100, 100) / 100;
        $delta = $direccion * $volatilidadPorSegundo * $tiempoPasado;
        return $precioActual + $delta;
    }
    
}  
?>