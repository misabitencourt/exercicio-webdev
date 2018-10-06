<?php

header('Content-Type: application/json');

include ("Selecao.php");
$selecao = new Selecao();
$request_body = file_get_contents('php://input'); // Raw_request_data
echo ( json_encode($selecao->delete($request_body)));
