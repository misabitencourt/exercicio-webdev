<?php
include_once('_CONFIG.PHP');

/**
 * Retorna uma conexao com o banco de dados. 
 * Necessário definir CC_HOST, CC_USER ... 
 * 
 * @return mysqli_connect */
function conectar( $paTexto='' ){
    return mysqli_connect( 
                    CC_HOST
                    , CC_USER
                    , CC_SENHA
                    , CC_BANCO );    
    
}
    

