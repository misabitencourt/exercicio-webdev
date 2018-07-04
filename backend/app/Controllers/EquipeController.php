<?php

namespace App\Controllers;

use App\Models\Equipes;
use App\Models\Grupos;

class EquipeControllerException extends \Exception
{
}

;

class EquipeController extends BaseController
{
    public function list()
    {
        try {
            echo json_encode(
                [
                    'code' => 200,
                    'message' => Equipes::with('grupo')->get()
                ]

            );
        } catch (\Exception $e) {
            echo json_encode(
                [
                    'code' => 404,
                    'message' => 'Algum erro aconteceu'
                ]

            );
        }
    }

    public function search($request)
    {
        try {
            $route = $request->getAttribute('route');
            $this->search_validate($route);

            echo json_encode(
                [
                    'code' => 200,
                    'message' => Equipes::where('name', 'LIKE', $route->getArgument('name') . '%')->get()
                ]

            );

        } catch (EquipeControllerException $e) {
            echo json_encode(
                [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage()
                ]

            );
        } catch (\Exception $e) {
            echo json_encode(
                [
                    'code' => 404,
                    'message' => 'Algum erro aconteceu'
                ]

            );
        }
    }


    public function save($request)
    {
        try {
            $requestBody = $request->getParsedBody();
            $this->save_validate($requestBody);


            Equipes::create([
                'name' => $requestBody['name'],
                'continente' => $requestBody['continente'],
                'grupo_id' => $requestBody['grupo']
            ]);

            echo json_encode(
                [
                    'code' => 200,
                    'message' => 'Equipe criada com sucesso!!'
                ]

            );

        } catch (EquipeControllerException $e) {
            echo json_encode(
                [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage()
                ]

            );
        } catch (\Exception $e) {
            echo json_encode(
                [
                    'code' => 500,
                    'message' => 'Algum erro aconteceu'
                ]

            );
        }

    }

    public function delete($request)
    {
        try {
            $route = $request->getAttribute('route');
            $this->delete_validate($route);

            if (!Equipes::destroy($route->getArgument('id'))) {
                throw new EquipeControllerException("Equipe ID é inválido!", 400);
            }

            echo json_encode(
                [
                    'code' => 200,
                    'message' => 'Equipe excluída com sucesso!'
                ]

            );

        } catch (EquipeControllerException $e) {
            echo json_encode(
                [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage()
                ]

            );
        } catch (\Exception $e) {
            echo json_encode(
                [
                    'code' => 500,
                    'message' => 'Algum erro aconteceu'
                ]

            );
        }
    }


    private function save_validate($requestBody)
    {
        if (!is_array($requestBody) OR empty($requestBody)) {
            throw new EquipeControllerException('Os campos nome, grupo e continente são obrigatórios', 422);
        }

        if (!array_key_exists('name', $requestBody) OR empty(trim($requestBody['name']))) {
            throw new EquipeControllerException('O Campo nome é obrigatório', 422);
        }

        if (!array_key_exists('grupo', $requestBody) OR empty(trim($requestBody['grupo']))) {
            throw new EquipeControllerException('O Campo grupo é obrigatório', 422);
        }

        if (!array_key_exists('continente', $requestBody) OR empty(trim($requestBody['continente']))) {
            throw new EquipeControllerException('O Campo continente é obrigatório', 422);
        }

        if (Equipes::where('name', '=', trim($requestBody['name']))->count() > 0) {
            throw new EquipeControllerException('A equipe já existe!', 409);
        }


        $grupoId = trim($requestBody['grupo']);

        if (Grupos::where('id', '=', $grupoId)->count() == 0) {
            throw new EquipeControllerException('O grupo selecionado não existe!', 409);
        }

        if (Equipes::where('grupo_id', '=', $grupoId)->count() > 4) {
            throw new EquipeControllerException('O grupo selecionado já está lotado!', 409);
        }

    }

    private function search_validate($routeBody)
    {
        if (empty($routeBody->getArgument('name'))) {
            throw new EquipeControllerException('O Campo nome é obrigatório', 422);
        }
    }

    private function delete_validate($routeBody)
    {
        if (empty($routeBody->getArgument('id'))) {
            throw new EquipeControllerException('O Campo ID é obrigatório', 422);
        }
    }
}
