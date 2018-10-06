<?php

header('Content-Type: application/json');

include ("Selecao.php");
$selecao = new Selecao();
$request_body = file_get_contents('php://input');
echo ( json_encode($selecao->insert($request_body)));
