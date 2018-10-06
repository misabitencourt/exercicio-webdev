<?php

header('Content-Type: application/json');

include ("Selecao.php");
$selecao = new Selecao();
echo $selecao->getTableColumns();

/**
 * pesquisar equipe (por nome);
 * Ao final resetar banco e testar todas funcionalidades;
 * make validateData function
 */