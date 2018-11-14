<?php

require_once "SQL.php";

class Teams
{
    static function loadById($id)
    {
        $sql = new SQL;
        $result = $sql->select("SELECT * FROM Teams WHERE id = :ID", array(
            ":ID" => $id
        ));
        return $result[0];
    }

    static function getList()
    {
        $sql = new SQL();
        $sql = $sql->select("Select * from Teams ORDER BY name;");
        return $sql;
    }

    static function search($name)
    {
        $sql = new SQL();
        return $sql->select("select * from Teams where name like :SEARCH order by name", array(
            ":SEARCH" => "%$name%"
        ));
    }

    static function insert($name, $groups, $continent)
    {
        $sql = new SQL();
        $result = $sql->select("INSERT INTO Teams (name, groups, continent) VALUES (:NAME, :GROUPS, :CONTINENT)", array(
            ":NAME" => $name,
            ":GROUPS" => $groups,
            ":CONTINENT" => $continent
        ));
    }

    static function update($id, $name, $groups, $continent)
    {
        $sql = new SQL();   
        $sql->query("update Teams set name = :NAME, groups = :GROUPS, continent = :CONTINENT where id = :ID", array(
            ":NAME" => $name,
            ":GROUPS" => $groups,
            ":CONTINENT" => $continent,
            ":ID" => $id
        ));
    }

    static function delete($id)
    {
        $sql = new SQL();

        $sql->query("DELETE FROM Teams WHERE id = :ID", array(
            ":ID" => $id
        ));
    }

    
}