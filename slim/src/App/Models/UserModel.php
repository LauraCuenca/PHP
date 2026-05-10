<?php
namespace App\Models;

use App\Database;
use PDO;

class UserModel {

    public function __construct(
    private Database $database,
    private PortfolioModel $portfolioModel
) {}

    public function findByEmail($email) {
        $pdo = $this->database->getConnection();

        $query = "SELECT * FROM users WHERE email = :email";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->database->closeConnection();
        return $result ?? null;
    }

    public function create($email, $password, $name, $balance) {
        $pdo = $this->database->getConnection();

        $query = "INSERT INTO users (email, password, name, balance)
                VALUES (:email, :password, :name, :balance)";

        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':password', $password, PDO::PARAM_STR);
        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->bindValue(':balance', $balance, PDO::PARAM_STR);

        $stmt->execute();

        $this->database->closeConnection();
    }

    public function findById($id){
        $pdo = $this->database->getConnection();

        $query = "SELECT id, name, email, balance, is_admin FROM users WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

   public function getPortfolioValue($userId) {
      $portfolio = $this->portfolioModel->getPortfolio($userId);

      if (empty($portfolio)) {
        return 0;
      }

      $total = 0;

      foreach ($portfolio as $asset) {
          $total += $asset['total_value'];
    }

    return $total;
  }
    public function update($id, $name = null, $password = null){
        $pdo = $this->database->getConnection();

        $fields = [];
        $params = [':id' => $id];

        if ($name !== null) {
            $fields[] = "name = :name";
            $params[':name'] = $name;
        }

        if ($password !== null) {
            $fields[] = "password = :password";
            $params[':password'] = $password;
        }

        $query = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        $this->database->closeConnection();
    }

    public function getAll(){
        $pdo = $this->database->getConnection();

        $query = "SELECT id, name FROM users WHERE is_admin = 0";
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
?>