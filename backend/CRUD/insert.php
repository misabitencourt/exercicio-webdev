<?php
header('Content-Type: application/json');

require_once "../teams.php";

$post = file_get_contents('php://input');

$array = explode(',', $post);

$list = Teams::insert($array[0], $array[1], $array[2]);
