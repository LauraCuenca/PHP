<?php
namespace App\Models;
use App\Database;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use PDO;

class AssetModel {

    public function __construct(private Database $database){}

    public function getAssetByFilter($nombre, $minPrice, $maxPrice) {
        $pdo = $this->database->getConnection();
        $query =
        "SELECT a.name, a.current_price
        FROM assets a
        WHERE 1=1";
        if ($nombre!= null) {
            $query .= " AND LOWER(a.name) LIKE :nombre";
        }
        if ($minPrice!= null) {
            $query .= " AND a.current_price >= :minPrice";
        }
        if ($maxPrice!= null) {
            $query .= " AND current_price <= :maxPrice";
        }
        $stmt = $pdo->prepare($query);
        if($nombre) {
            $stmt->bindValue(':nombre', '%' . strtolower($nombre) . '%', PDO::PARAM_STR);
        }
        if($minPrice) {
            $stmt->bindValue(':minPrice', $minPrice, PDO::PARAM_STR);
        }
        if($maxPrice) {
            $stmt->bindValue(':maxPrice', $maxPrice, PDO::PARAM_STR);
        }
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $this->database->closeConnection();
        return $result;
    }

    public function getById($assetId) {
        $pdo = $this->database->getConnection();
        $query =
        "SELECT a.name 
        FROM assets a 
        WHERE a.id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':id', $assetId, PDO::PARAM_INT);
        $stmt-> execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->database->closeConnection();
        return $result ?? null;
    }

    public function getHistory($assetId, $quantity) {
        $pdo = $this->database->getConnection();
        $query =
        "SELECT t.transaction_type AS Tipo, 
        t.price_per_unit AS Precio, 
        t.transaction_date AS Fecha
        FROM transactions t
        WHERE t.asset_id = :id
        ORDER BY t.transaction_date DESC LIMIT :quantity";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':id', $assetId, PDO::PARAM_INT);
        $stmt->bindValue(':quantity', $quantity, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $this->database->closeConnection();
        return $result;
    }

    public function getAll() {
        $pdo = $this->database->getConnection();
        $stmt = $pdo->query("SELECT id, name, current_price, last_update FROM assets");
        $this->database->closeConnection();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updatePrice($assetId, $newPrice) {
        $pdo = $this->database->getConnection();
        $query =
        "UPDATE assets 
        SET current_price = :newPrice
        WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':newPrice', $newPrice, PDO::PARAM_STR);
        $stmt->bindValue(':id', $assetId, PDO::PARAM_INT);
        $stmt->execute();
        $this->database->closeConnection();
    }
}
?>
