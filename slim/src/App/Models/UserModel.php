<?php
namespace App\Models;

use App\Database;
use PDO;

class UserModel {

    public function __construct(private Database $database){}

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
}
?>