<?php
/**
 * Description of DB
 * Classe abstrata de conexão com o banco de dados
 * 
 * @author Angelo Marin
 */
class _DB {
    
    protected   $conexao;   // guarda a ultima conexao
    protected   $erros; 

    public function __construct() {        
        $this->conecta();
    }
    
    /**
     * Limpa todas as variáveis da classe
     */
    public function __destruct(){
        foreach ($this as $key => $value) {
            unset($this->$key);
        }
    }
    
    protected function conecta(){
        try {
            $this->conexao = new PDO( CC_SGBD.":host=".CC_HOST.";dbname=".CC_BANCO, CC_USER, CC_SENHA);
        } catch (PDOException $i) {
            die("Erro: <code>" . $i->getMessage() . "</code>");
        }
         
        return ($this->conexao);
    }
    
    protected function desconecta(){
        $this->conexao = null;
    }
    
    
    public function select( $paSql, $paParams=null ){
        
        $vmQuery=$this->conexao->prepare($paSql);
        $vmQuery->execute($paParams);
        
        $vtResultado = $vmQuery->fetchAll();
        //       or die(  print_r($vmQuery->errorInfo(), true)."<br><br>Sql: ".$paSql );

        return $vtResultado;
    }

}
