<?php

header('Content-Type: application/json');

include ("Selecao.php");
$selecao = new Selecao();
echo json_encode($selecao->list());
