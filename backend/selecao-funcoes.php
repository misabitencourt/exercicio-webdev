<?php

include_once('_banco.php');

function selecao_cadastrar( $paDados=array() ){
    
    $vfNome    = $paDados['nome'];
    $vfGrupo   = $paDados['grupo'];
    $vfContinente      = $paDados['continente'];
    
    $vmSql = "insert into selecao 
                (nome, grupo, continente) 
                values 
                ('{$vfNome}'
                 ,'{$vfGrupo}'
                 , '{$vfContinente}')";             
    $vmConexao = conectar();
    if (mysqli_query( $vmConexao, $vmSql)) {
        return true;
    } else {
        return false;
    } 
}

function selecao_alterar( $paId=null, $paDados=array() ){
    
    $vfId       = $paId;
    
    $vfNome         = $paDados['nome'];
    $vfGrupo        = $paDados['grupo'];
    $vfContinente   = $paDados['continente'];  
    
    $vmSql = "update selecao "
            . "set nome         = '{$vfNome}' "
            . ", grupo          = '{$vfGrupo}' "
            . ", continente     = '{$vfContinente}' "
            . "where nome       = '{$vfId}' " ;
            //echo $vmSql; 
            //die();
    
    return mysqli_query( conectar(), $vmSql );    
}

function selecao_excluir( $paId='' ){
    
    if ($paId==''){
        return false;
    }
    
    return mysqli_query( conectar(), 
        "delete from selecao "
        . "where nome = '{$paId}' " );    
    
}

function selecao_buscar( $filtro =''){
    
    if ($filtro == '')
    {
        return false;
    }
        
    $vmSql = "SELECT nome "
            . ", grupo "
            . ", continente "
            . "FROM selecao WHERE nome = '"
            . $filtro
            . "'";    
    
    $vmResultado = mysqli_query( conectar(), $vmSql );     
    
    $vtResultado = array();
    while ($vtSelecao = mysqli_fetch_assoc($vmResultado)){
        $vtResultado[] = $vtSelecao;
    }
    
    return $vtResultado;
}

function validar()
{
    $vmSql = "SELECT * "
            . "FROM selecao WHERE 1";
    
    $vmResultado = mysqli_query( conectar(), $vmSql );     
    
    $vtResultado = array();
    while ($vtSelecao = mysqli_fetch_assoc($vmResultado)){
        $vtResultado[] = $vtSelecao;
    }
    
    return sizeof($vtResultado) < 33;
}