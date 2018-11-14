<?php
header('Content-Type: application/json');

require_once "../teams.php";

$post = file_get_contents('php://input');

$list = Teams::delete($post);
