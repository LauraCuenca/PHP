<?php
namespace App\Models;

use App\Database;
use PDO;

class AuthModel {

    // Ahora recibe Database, igual que tu UserModel
    public function __construct(private Database $database) {}

    public function storeToken($userId, $token)
    {
        // 1. Obtienes la conexión PDO desde el objeto database
        $pdo = $this->database->getConnection();
        
        // 2. Usas la variable local $pdo (NO $this->pdo)
        $stmt = $pdo->prepare("
            UPDATE users 
            SET token = ?, token_expired_at = DATE_ADD(NOW(), INTERVAL 5 MINUTE)
            WHERE id = ?
        ");
        $stmt->execute([$token, $userId]);
    }

    public function findByToken($token)
    {
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE token = ?");
        $stmt->execute([$token]);
        return $stmt->fetch();
    }

    public function extendToken($userId)
    {
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare("
            UPDATE users 
            SET token_expired_at = DATE_ADD(NOW(), INTERVAL 5 MINUTE)
            WHERE id = ?
        ");
        $stmt->execute([$userId]);
    }

    public function clearToken($userId)
    {
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare("
            UPDATE users 
            SET token = NULL, token_expired_at = NULL
            WHERE id = ?
        ");
        $stmt->execute([$userId]);
    }
}