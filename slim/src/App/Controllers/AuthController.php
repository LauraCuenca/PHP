<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\AuthModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController {

    public function __construct(
        private UserModel $userModel,
        private AuthModel $authModel
    ) {}

public function login(Request $request, Response $response)
{
    $data = $request->getParsedBody();

    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    if (!$email || !$password) {
        return $this->json($response, ['error' => 'Faltan datos'], 400);
    }

    $user = $this->userModel->findByEmail($email);

    if (!$user) {
        return $this->json($response, ['error' => 'Usuario no encontrado'], 404);
    }

    if (!password_verify($password, $user['password'])) {
        return $this->json($response, ['error' => 'Password incorrecta'], 401);
    }

    $token = bin2hex(random_bytes(32));

    $this->authModel->storeToken($user['id'], $token);

    $response = $response->withHeader(
        'Authorization',
        'Bearer ' . $token
    );

    return $this->json($response, [
        'message' => 'Login exitoso'
    ], 200);
}

    public function logout(Request $request, Response $response)
{
    $header = $request->getHeaderLine('Authorization');

    if (!$header) {
        return $this->json($response, ['error' => 'Token requerido'], 401);
    }

    $token = str_replace('Bearer ', '', $header);

    $user = $this->authModel->findByToken($token);

    if (!$user) {
        return $this->json($response, ['error' => 'Token inválido'], 401);
    }

    $this->authModel->clearToken($user['id']);

    return $this->json($response, [
        'message' => 'Logout exitoso'
    ], 200);
}

    private function json($response, $data, $status)
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')
                        ->withStatus($status);
    }
}
?>