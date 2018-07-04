<?php

namespace App\Controllers;

use App\Models\Equipes;

class EquipeControllerException extends \Exception
{
}

;

class EquipeController extends BaseController
{
    public function list($request, $response)
    {
        return json_encode(Equipes::with('grupo')->get());
    }

    public function save($request, $response)
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
            echo "<pre>";
            print_r($e);
            echo "</pre>";
            echo json_encode(
                [
                    'code' => 404,
                    'message' => 'Algum erro aconteceu'
                ]

            );
        }

    }

    public function save_validate($requestBody)
    {
        if (!array_key_exists('name', $requestBody) OR empty(trim($requestBody['name']))) {
            throw new EquipeControllerException('O Campo nome é obrigatório', 404);
        }

        if (!array_key_exists('grupo', $requestBody) OR empty(trim($requestBody['grupo']))) {
            throw new EquipeControllerException('O Campo grupo é obrigatório', 404);
        }

        if (!array_key_exists('continente', $requestBody) OR empty(trim($requestBody['continente']))) {
            throw new EquipeControllerException('O Campo continente é obrigatório', 404);
        }

    }
}
