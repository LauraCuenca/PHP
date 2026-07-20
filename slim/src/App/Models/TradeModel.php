<?php
namespace App\Models;

use App\Database;
use PDO;
use Exception;

class TradeModel {

    public function __construct(private Database $database){}

    public function getPortfolioQuantity($userId, $assetId) {
        $pdo = $this->database->getConnection();
        $query =
        "SELECT quantity 
        FROM portfolio
        WHERE user_id = :user_id AND asset_id = :asset_id";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':asset_id', $assetId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->database->closeConnection();
        return $result ? (int) $result['quantity'] : 0;
    }

    public function sellAsset($userId, $assetId, $quantity, $price) {
        $pdo = $this->database->getConnection();
        try {
            $pdo->beginTransaction();
            $this->updatePortfolio($pdo, $userId, $assetId, $quantity);
            $total = $quantity * $price;
            $this->updateTransactionHistory($pdo, $userId, $assetId, $quantity, $price, $total);
            $this->updateBalance($pdo, $userId, $assetId, $total);
            $pdo->commit();
            return ['success' => true];
        }
        catch (Exception $e) {
            $pdo->rollback();
            return ['success' => false, 'message' => $e->getMessage()];
        }
        finally {
            $this->database->closeConnection();
        }
    }

    private function updatePortfolio($pdo, $userId, $assetId, $quantityChange) {
        $query =
        "UPDATE portfolio
        SET quantity = quantity - :quantity
        WHERE user_id = :user_id AND asset_id = :asset_id";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':asset_id', $assetId, PDO::PARAM_INT);
        $stmt->bindValue(':quantity', $quantityChange, PDO::PARAM_INT);
        $stmt->execute();
    }

    private function updateTransactionHistory($pdo, $userId, $assetId, $quantity, $price, $total) {
        $query =
        "INSERT INTO transactions (user_id, asset_id, quantity, transaction_type, price_per_unit, total_amount, transaction_date)
        VALUES (:user_id, :asset_id, :quantity, 'sell', :price_per_unit, :total_amount, NOW())";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':asset_id', $assetId, PDO::PARAM_INT);
        $stmt->bindValue(':quantity', $quantity, PDO::PARAM_INT);
        $stmt->bindValue(':price_per_unit', $price, PDO::PARAM_STR);
        $stmt->bindValue(':total_amount', $total, PDO::PARAM_STR);
        $stmt->execute();
    }

    private function updateBalance($pdo, $userId, $assetId, $total) {
        $query =
        "UPDATE users
        SET balance = balance + :total
        WHERE id = :user_id";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':total', $total, PDO::PARAM_STR);
        $stmt->execute();
    }

    public function buyAsset($userId, $assetId, $quantity, $price) {
    $pdo = $this->database->getConnection();

    try {
        $pdo->beginTransaction();

        $total = $quantity * $price;

        $this->decreaseBalance($pdo, $userId, $total);

        $this->addToPortfolio($pdo, $userId, $assetId, $quantity);

        $this->insertBuyTransaction($pdo, $userId, $assetId, $quantity, $price, $total);

        $pdo->commit();
        return ['success' => true];

    } catch (Exception $e) {
        $pdo->rollback();
        return ['success' => false, 'message' => $e->getMessage()];
    } finally {
        $this->database->closeConnection();
    }
  }

   private function addToPortfolio($pdo, $userId, $assetId, $quantity) {
      $query = "SELECT quantity FROM portfolio WHERE user_id = :user_id AND asset_id = :asset_id";
      $stmt = $pdo->prepare($query);
      $stmt->execute([
        ':user_id' => $userId,
        ':asset_id' => $assetId
     ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        $query = "UPDATE portfolio
                  SET quantity = quantity + :quantity
                  WHERE user_id = :user_id AND asset_id = :asset_id";
      } else {
        $query = "INSERT INTO portfolio (user_id, asset_id, quantity)
                  VALUES (:user_id, :asset_id, :quantity)";
       }
      $stmt = $pdo->prepare($query);
      $stmt->execute([
        ':user_id' => $userId,
        ':asset_id' => $assetId,
        ':quantity' => $quantity
      ]);
     }

   private function decreaseBalance($pdo, $userId, $total) {
    $query = "
        UPDATE users
        SET balance = balance - :total
        WHERE id = :user_id
    ";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':user_id' => $userId,
        ':total' => $total
    ]);
   }

   private function insertBuyTransaction($pdo, $userId, $assetId, $quantity, $price, $total) {
    $query = "
        INSERT INTO transactions 
        (user_id, asset_id, quantity, transaction_type, price_per_unit, total_amount, transaction_date)
        VALUES (:user_id, :asset_id, :quantity, 'buy', :price_per_unit, :total_amount, NOW())
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':user_id' => $userId,
        ':asset_id' => $assetId,
        ':quantity' => $quantity,
        ':price_per_unit' => $price,
        ':total_amount' => $total
    ]);
   }
 
  public function getUserBalance($userId) {
    $pdo = $this->database->getConnection();

    $query = "SELECT balance FROM users WHERE id = :user_id";
    $stmt = $pdo->prepare($query);
    $stmt->execute([':user_id' => $userId]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $this->database->closeConnection();

    return $result ? (float)$result['balance'] : 0;
}

public function getTransactions($userId, $type = null, $assetId = null) {
    $pdo = $this->database->getConnection();

    $query = "
        SELECT
            t.id,
            t.asset_id,
            a.name AS asset_name,
            t.quantity,
            t.transaction_type,
            t.price_per_unit,
            t.total_amount,
            t.transaction_date
        FROM transactions t
        INNER JOIN assets a
            ON a.id = t.asset_id
        WHERE t.user_id = :user_id
    ";

    $params = [
        ':user_id' => $userId
    ];

    if ($type !== null && $type !== '') {
        $query .= " AND t.transaction_type = :type";
        $params[':type'] = $type;
    }

    if ($assetId !== null) {
        $query .= " AND t.asset_id = :asset_id";
        $params[':asset_id'] = (int)$assetId;
    }

    $query .= " ORDER BY t.transaction_date DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $this->database->closeConnection();

    return $result;
}

}
?>

