<?php

abstract class _MODEL extends _DB { 
    protected   $tabela;    // nome da tabela da classe extendida. Carregada automaticamente
    /**
     * A estrutura de campos deve ser um array com 
     *  nome
     *  tipo (varchar, integer, double, datetime)
     *  tamanho 
     *  precisao (para double)
     *  chave_primaria
     *  unico
     *  auto_increment
     *  
     *  nome[
     *      array [   nome
     *              , tipo 
    *               , tamanho 
    *               , precisao (para double)
    *               , chave_primaria
    *               , unico
    *               , auto_increment
     *             ]
     *      ]
     * 
     *  Será alimentado automaticamente sempre que uma classe filha, vinculada a uma tabela, for instanciada
     * 
     * @var array
     */
    private $campos = array();
    private $campo_id = '';
    protected $filtros=array();
    protected $nome_campos = '';

    public function __construct($paDados=array()) {
        parent::__construct();

        if ( $this->tabela=='') { 
            $this->tabela = strtolower( get_class($this) ) ;
        }
        
        $this->carregaCampos($paDados);
        
    }

    function preechePorRequest( $paRequest = array() ){
        
        if (count($paRequest)>0){
            foreach ($paRequest as $dado=>$valor){
                if (array_key_exists($dado, $this->campos) ) {
                    if ($dado<>$this->campo_id || ($dado==$this->campo_id && $valor<>0) ) {
                        $this->set($dado, $valor);   
                    }
                }
            }
        } 
    }
    
    /**
     * retorna todos os registros do banco
     * 
     * Se existirem filtros aplicados à classe pela função addFiltrosPersonalizados 
     * eles serão considerados 
     * 
     * @param array $paFiltros
     * 
     * @return array Objeto
     */
    public function selectAll($paFiltros=array()){
        
        if (count($paFiltros) > 0 ){
            $this->addFiltrosPersonalizados($paFiltros);
        }
        
        $vmSql = "select {$this->nome_campos} ";
        $vmSql.= " from {$this->tabela} ";

        if (count($this->filtros)>0) {
            foreach ($this->filtros as $x=>$filtro){
                $vmSql.= ($x==0)?' where ':' and ';
                $vmSql.= $filtro;                
            }
        }
        
        $vtResultado = $this->select($vmSql);
        
        if (count($vtResultado)>0){
            $vtObjetos = array();
            foreach ($vtResultado as $dados){
                $obj = new $this();
                $obj->preechePorRequest($dados);
                $vtObjetos[] = $obj;
            }
            return $vtObjetos;
        } else {
            return array();
        }
    }
    
    /**
     * Retorna o registro correspondete ao ID informado
     * 
     * @param int ID
     * 
     * @return array Objeto
     */
    public function selectPorID($paId){
        
        if ( !is_numeric($paId) ) {
            echo "O ID deve ser numérico";
            return false;
        } 
        
        $this->filtros[] = " {$this->campo_id} = {$paId} ";
        
        $vtCarros = $this->selectAll( array( $this->campo_id => $paId ) );
        
        if (count($vtCarros)>0){
            return $vtCarros[0];
        } else {
            return false;
        }        
    }
    
    /**
     * Implementar uma funcão que receba um array de filtros 
     * e adicione os filtros na variável $filtros da classe
     * 
     * Esses filtros serão utilizados pela função selectPorFiltro()
     * 
     * Ex.: if (@$paFiltros['vfCar_marca']<>''){
     *          $this->filtros[] = " and car_marca like '%{$paFiltros['vfCar_marca']}%' ";
     *      }
     * 
     * @param array paFiltros
     * 
     * @return Objetos
     */
    function addFiltrosPersonalizados( $paFiltros ){
        echo 'necessário implementar a função de seleção por filtro';
        return false();
    }
    
    function limpaFiltros(){
        $this->filtros = array();
    }
    
    /**
     * Detela o registro correspondete ao ID informado
     * 
     * @param int ID
     * 
     * @return array Objeto
     */
    public function deletePorID($paId){
        
        if ( !is_numeric($paId) ) {
            echo "O ID deve ser numérico";
            return false;
        } 
        
        $vmSql = "delete from {$this->tabela} where {$this->campo_id} = {$paId} ";
        return $this->conexao->exec($vmSql);
    }
    
    /** 
     * grava os dados no banco. 
     * Se o campo chave estiver preenchido, insere um novo dado, senão, altera os dados existentes
     * 
     * retorna a chave do registro
     */
    public function grava(){
        $this->erros=array();
        $this->validaCampo();
        if (count($this->erros)>0) {
            echo '<pre>';
            print_r( $this->erros);
            return false;
        }
        
        if ($this->campos[$this->campo_id]['valor'] == null){
            $vmSql = $this->getSqlInsert();
        } else {
            $vmSql = $this->getSqlUpdate();
        }
        $vmConexao = $this->conecta();
        $vmConexao->exec($vmSql);
        
        if ($this->get($this->campo_id)>0){
            return $this->get($this->campo_id);
        } else {
            return $vmConexao->lastInsertId();
        }
           
    }

    private function carregaCampos( $paDados=array() ){
        
        $vmSql="SELECT 	COLUMN_NAME 
                ,	ORDINAL_POSITION
                ,	IS_NULLABLE
                ,	DATA_TYPE
                , 	CHARACTER_MAXIMUM_LENGTH
                ,	NUMERIC_PRECISION
                ,	NUMERIC_SCALE
                ,	COLUMN_KEY
                ,	EXTRA
                FROM 	INFORMATION_SCHEMA.COLUMNS 
                WHERE 	TABLE_NAME = '{$this->tabela}'; ";
                
        $vtCampos = $this->select( $vmSql );
        
        $this->campos=array();
        
        foreach ( $vtCampos as $vtCampo ){
            
            $this->campos[$vtCampo['COLUMN_NAME']]=array(
                     'nome'             =>   $vtCampo['COLUMN_NAME']
                    ,'tipo'             =>   $vtCampo['DATA_TYPE']
                    ,'tamanho'          => (($vtCampo['CHARACTER_MAXIMUM_LENGTH']<>'')?$vtCampo['CHARACTER_MAXIMUM_LENGTH']:$vtCampo['NUMERIC_PRECISION'])
                    ,'precisao'         =>   $vtCampo['NUMERIC_SCALE']
                    ,'chave_primaria'   => (($vtCampo['COLUMN_KEY']=='PRI')?'S':'N')
                    ,'unico'            => (($vtCampo['COLUMN_KEY']=='UNI')?'S':'N')
                    ,'auto_increment'   => (($vtCampo['EXTRA']=='auto_increment')?'S':'N')
                    ,'permite_null'     => (($vtCampo['IS_NULLABLE']=='YES')?'S':'N')
                    ,'valor'            =>  @$paDados[ $vtCampo['COLUMN_NAME'] ]
                
            );
            
            if ($vtCampo['COLUMN_KEY']=='PRI'){
                $this->campo_id = $vtCampo['COLUMN_NAME'];
            }
        }
        $this->nome_campos=implode(', ', array_keys($this->campos));
    }

    protected function getSqlInsert() {
        $vmCampos = '';
        $vmValores = '';
        foreach ($this->campos as $campo=>$dados) {
            if ( $campo <> $this->campo_id ){
                $vmCampos .= (($vmCampos<>'')?', ': ''); 
                $vmCampos .= $campo;
                
                $vmValores .= (($vmValores<>'')?', ': ''); 
                $vmValores .= $this->getValorFormatoGrava($campo);
            }
        }
        
        return "insert into {$this->tabela} ({$vmCampos}) values ({$vmValores}) ";
        
    }
    
    protected function getSqlUpdate() {
        $vmUpdates = '';
        foreach ($this->campos as $campo=>$dados) {
            if ( $campo <> $this->campo_id ){
                $vmUpdates .= (($vmUpdates<>'')?', ': ''); 
                $vmUpdates .= $campo." = ".$this->getValorFormatoGrava($campo)." ";
            }
        }
        
        return "update {$this->tabela} set {$vmUpdates} "
                . "where {$this->campo_id} = {$this->get($this->campo_id)} ";
        
    }
    
    protected function getValorFormatoGrava( $paCampo ){
        
        if ($this->campos[$paCampo]['tipo']=='varchar'){
            return "'{$this->campos[$paCampo]['valor']}'";
        }
        
        
        return $this->campos[$paCampo]['valor'];
    }

    protected function validaCampo( $paCampo='' ){
        
        if ($paCampo==''){
            foreach (array_keys($this->campos) as $campo) {
                if ($campo<>$this->campo_id) {
                    $this->validaCampo($campo);
                }
            }
            return true;
        }

        $vmCountErros = 0;
        if ($this->campos[$paCampo]['permite_null'] == 'N' 
                && $this->campos[$paCampo]['valor'] == null) {
            $this->erros[] = "Campo {$paCampo} não pode ser nulo";
            $vmCountErros++;
        }
        
        if ($this->campos[$paCampo]['tipo'] == 'double'
                && !is_double((double)$this->campos[$paCampo]['valor']) ) {
            $this->erros[] = "Campo {$paCampo} deve ser do tipo Double";
            $vmCountErros++;
        }
        
        if ($this->campos[$paCampo]['tipo'] == 'int'
                && !is_integer((int)$this->campos[$paCampo]['valor']) ) {
            $this->erros[] = "Campo {$paCampo} deve ser do tipo Inteiro";
            $vmCountErros++;
        }
        
        return ($vmCountErros==0);
    } 
    
    function set( $paCampo, $paValor){
        
        if (!array_key_exists($paCampo, $this->campos)){
             $this->erros[] = "Campo {$paCampo} não existe!";
             return false;
        }
        
        $this->campos[$paCampo]['valor'] = $paValor;
        
        return true;
        
    }
    
    function get( $paCampo ){
        if (!array_key_exists($paCampo, $this->campos)){
             $this->erros[] = "Campo {$paCampo} não existe!";
             return false;
        }
        
        return $this->campos[$paCampo]['valor'];
    }
    
}