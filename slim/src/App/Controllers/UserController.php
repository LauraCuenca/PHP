<?php

namespace App\Controllers;

use App\Models\UserModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController {

    public function __construct(private UserModel $userModel) {}

    public function create(Request $request, Response $response)
    {
        $data = $request->getParsedBody();

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $name = $data['name'] ?? null;

        if (!$email || !$password || !$name) {
            $response->getBody()->write(json_encode(['error' => 'Faltan datos']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response->getBody()->write(json_encode(['error' => 'Email inválido']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        if (!preg_match('/^[a-zA-Z]+$/', $name)) {
            $response->getBody()->write(json_encode(['error' => 'Nombre inválido']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/', $password)) {
            $response->getBody()->write(json_encode(['error' => 'Password inválida']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $existingUser = $this->userModel->findByEmail($email);

        if ($existingUser) {
            $response->getBody()->write(json_encode(['error' => 'Email ya registrado']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        $balance = 1000;

        $this->userModel->create($email, $passwordHash, $name, $balance);

        $response->getBody()->write(json_encode([
            'message' => 'Usuario creado correctamente'
        ]));

        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }
}