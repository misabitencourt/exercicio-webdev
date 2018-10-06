<?php

header('Content-Type: application/json');

include ("Selecao.php");
$selecao = new Selecao();
echo $selecao->list();
