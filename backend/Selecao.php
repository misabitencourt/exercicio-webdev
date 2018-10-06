<?php
define('DATABASE',"../selecao.db");
class Model {
    private $tableName;
    private $tableColumns = [];
    private $connection;
   
    function __construct($tableName){
        $this->connection = new SQLite3(DATABASE);
        $this->tableName = $tableName;
        $result = $this->connection->query("select * from selecao");
        for ($i = 0 ;$i< $result->numColumns(); $i++ ){
            $this->tableColumns[] = $result->columnName($i);
        }
    }
    function __destruct(){
        $this->connection->close();
    }

    function list(){
        $sql = "SELECT * FROM {$this->tableName}";
        $result = $this->connection->query($sql);
        while( $x  = $result->fetchArray(SQLITE3_ASSOC)){
            $arr[] = $x; 
        }
        $json = json_encode($arr);
        return $json;
    }

    function update($json){
      $arr = json_decode($json,true);
      $_id = $arr['_id'];
      array_shift($arr);
      $sql = "UPDATE {$this->tableName} 
                SET ";
      foreach( $arr as $campo => $valor){
          if(gettype($valor) == "NULL"){
            continue;    
          }else if (gettype($valor) == "string"){
            $sql.= $campo ." =  '" . $valor."' ,";
          }else{
            $sql.= $campo ." = " . $valor." ,";
          }
      }
      $sql[strlen($sql)-1] = " ";
      $sql.= " WHERE _id = {$_id} "; 
      $result = $this->connection->query($sql);
      return $result;
    }

    function insert($json){
        $arr = json_decode($json,true);
        $sql = "INSERT INTO {$this->tableName} ( ";
        foreach( $this->tableColumns as $column){
            if ($column == "_id") continue;
            $sql.=$column.",";
        }
        $sql[strlen($sql)-1] = ")";
        $sql.= " VALUES (";
        foreach( $arr as $valor){
            if(gettype($valor) == "NULL"){
              continue;    
            }else if (gettype($valor) == "string"){
              $sql.= "'".$valor."' ,";
            }else{
              $sql.= $valor." ,";
            }
        }
        $sql[strlen($sql)-1] = ")";
        $result = $this->connection->query($sql);
        return $result;
    }

    function delete($json){
        $arr = json_decode($json,true);
        $sql = "DELETE FROM {$this->tableName} WHERE _id = {$arr['_id']} "; 
        $result = $this->connection->query($sql);
        return $result;
    }

    function getTableColumns(){
        return json_encode($this->tableColumns);
    }
}

class Selecao extends Model{ 

    
    function __construct(){
        parent::__construct("selecao");

    }
    function validateData($json){
        $arr = json_decode($json,true);
        foreach(json_decode($this->list(),true) as $list){
            if($list['nome'] == $arr['nome'] && $list['_id'] <>  $arr['_id']){
                return (['err'=>'Nome desta selecao já cadastrada']);
            }
        }
        if(strlen($arr['grupo'])> 1) return (['err'=>'Campo grupo possui mais de um caracter']);
        $arr['grupo'] = strtoupper($arr['grupo']);
        if(ord($arr['grupo'] ) >72 || ord($arr['grupo'] ) < 65 ) return (['err'=>'Campo grupo deve ter valores de A até H']);
        foreach($arr as $campo => $valor){
            if(gettype($valor) == "NULL" || strlen($valor) < 1){
                return (['err'=>"O Campo -> ". $campo . " está em Branco "]) ; 
            }
        }
        return false;
    }
    function insert($json){
        if(!$this->validateData($json)){
            if(count(json_decode($this->list(),true)) == 32){
                return (['err'=>"Limite de Seleções excedido"]) ; 
            }
            return parent::insert($json);
        }else{
            return $this->validateData($json);
        }
       
    }
    function update($json){
        if(!$this->validateData($json)){
            return parent::update($json);
        }else{
            return $this->validateData($json);
        }
    }
   
}
?>