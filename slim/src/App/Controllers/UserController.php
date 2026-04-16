<?php

namespace App\Controllers;

use App\Models\UserModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController {

    public function __construct(private UserModel $userModel) {}

    public function create(Request $request, Response $response){
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

   public function getById(Request $request, Response $response, array $args){
    $authUser = $request->getAttribute('user'); 
    $userId = (int) $args['id'];

    if ($authUser['role'] !== 1 && $authUser['id'] !== $userId) {
        $response->getBody()->write(json_encode([
            'error' => 'Forbidden'
        ]));
        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(403);
    }

    $user = $this->userModel->findById($userId);

    if (!$user) {
        $response->getBody()->write(json_encode([
            'error' => 'Usuario no encontrado'
        ]));
        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(404);
    }

    $portfolioValue = $this->userModel->getPortfolioValue($userId);

    $response->getBody()->write(json_encode([
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'balance' => (float) $user['balance'],
        'portfolio_value' => (float) $portfolioValue
    ]));

    return $response->withHeader('Content-Type', 'application/json')
        ->withStatus(200);
}

  public function update(Request $request, Response $response, array $args){
    $authUser = $request->getAttribute('user');
    $userId = (int) $args['id'];

    if ($authUser['role'] !== 1 && $authUser['id'] !== $userId) {
        return $this->json($response, ['error' => 'Forbidden'], 403);
    }

    $data = $request->getParsedBody();

    $name = $data['name'] ?? null;
    $password = $data['password'] ?? null;


    if (!$name && !$password) {
        return $this->json($response, [
            'error' => 'Debe enviar al menos name o password'
        ], 400);
    }

    if ($name && !preg_match('/^[a-zA-Z]+$/', $name)) {
        return $this->json($response, ['error' => 'Nombre inválido'], 400);
    }

    if ($password && !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/', $password)) {
        return $this->json($response, ['error' => 'Password inválida'], 400);
    }

    if ($password) {
        $password = password_hash($password, PASSWORD_BCRYPT);
    }

    $user = $this->userModel->findById($userId);

    if (!$user) {
        return $this->json($response, ['error' => 'Usuario no encontrado'], 404);
    }

    $this->userModel->update($userId, $name, $password);

    return $this->json($response, [
        'message' => 'Usuario actualizado correctamente'
    ], 200);
}

private function json($response, $data, $status){
    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-Type', 'application/json')
                    ->withStatus($status);
}

public function getAll(Request $request, Response $response){
    $authUser = $request->getAttribute('user');

    // 🔐 solo admin
    if ($authUser['role'] !== 1) {
        return $this->json($response, ['error' => 'Forbidden'], 403);
    }

    $users = $this->userModel->getAll();

    $result = [];

    foreach ($users as $user) {
        $portfolioValue = $this->userModel->getPortfolioValue($user['id']);

        $result[] = [
            'name' => $user['name'],
            'portfolio_value' => (float) $portfolioValue
        ];
    }

    return $this->json($response, $result, 200);
}
}
?>