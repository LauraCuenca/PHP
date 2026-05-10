<?php
namespace App\Middleware;

use App\Models\AuthModel;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Slim\Psr7\Response;

class AuthMiddleware {

    public function __construct(private AuthModel $authModel) {}

    public function __invoke($request, $handler)
    {
        $header = $request->getHeaderLine('Authorization');

        if (!$header) {
            return $this->unauthorized();
        }

        if (!preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            return $this->unauthorized();
        }

        $token = $matches[1];

        $user = $this->authModel->findByToken($token);

        if (!$user) {
            return $this->unauthorized();
        }

        if (strtotime($user['token_expired_at']) < time()) {
            $this->authModel->clearToken($user['id']);
            return $this->unauthorized();
        }

        $this->authModel->extendToken($user['id']);

        return $handler->handle(
            $request->withAttribute('user', [
                'id' => $user['id'],
                'role' => (int)$user['is_admin']
            ])
        );
    }

    private function unauthorized()
    {
        $response = new \Slim\Psr7\Response();
        $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
        return $response->withStatus(401)
                        ->withHeader('Content-Type', 'application/json');
    }
}
?>