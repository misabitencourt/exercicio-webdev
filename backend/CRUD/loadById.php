<?php
header('Content-Type: application/json');

require_once "../teams.php";

 function utf8ize($d) 
    {
        if (is_array($d)) {
            foreach ($d as $k => $v) {
                $d[$k] = utf8ize($v);
            }
        } else if (is_string ($d)) {
            return utf8_encode($d);
        }
        return $d;
    }



$post = $_GET['id'];

$list = Teams::loadById((int)$post);

echo json_encode(utf8ize($list));