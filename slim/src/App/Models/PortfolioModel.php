<?php
namespace App\Models;

use App\Database;
use PDO;

class PortfolioModel {

   public function __construct(private Database $database){}
   
   public function getPortfolio($userId) {
    $pdo = $this->database->getConnection();


    $query = "
        SELECT 
            p.asset_id,
            a.name,
            p.quantity,
            a.current_price,
            (p.quantity * a.current_price) AS total_value,
            (SELECT AVG(t.price_per_unit) 
            FROM transactions t 
            WHERE t.user_id = p.user_id 
            AND t.asset_id = p.asset_id 
            AND t.transaction_type = 'buy') AS avg_purchase_price
        FROM portfolio p
        JOIN assets a ON p.asset_id = a.id
        WHERE p.user_id = :user_id
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([':user_id' => $userId]);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $this->database->closeConnection();

    return $result;
}

public function getAsset(int $userId, int $assetId) {
    $pdo = $this->database->getConnection();

    $query = "SELECT quantity FROM portfolio 
              WHERE user_id = :user_id AND asset_id = :asset_id";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':user_id' => $userId,
        ':asset_id' => $assetId
    ]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $this->database->closeConnection();
    return $result ?: null;
}

public function deleteAsset(int $userId, int $assetId) {
    $pdo = $this->database->getConnection();

    $query = "DELETE FROM portfolio 
              WHERE user_id = :user_id AND asset_id = :asset_id";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':user_id' => $userId,
        ':asset_id' => $assetId
    ]);

    $this->database->closeConnection();
}

}
?>