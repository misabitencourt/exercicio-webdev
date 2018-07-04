<?php

$app->post('/save', '\App\Controllers\EquipeController:save');
$app->get('/list', '\App\Controllers\EquipeController:list');
