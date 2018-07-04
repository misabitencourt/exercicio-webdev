<?php

$app->post('/save', '\App\Controllers\EquipeController:save');
$app->delete('/delete/{id}', '\App\Controllers\EquipeController:delete');
$app->get('/list', '\App\Controllers\EquipeController:list');
$app->get('/search/{name}', '\App\Controllers\EquipeController:search');