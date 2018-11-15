<?php

include_once('selecao-funcoes.php');
$vfId       = $_POST['id'];
        
if (selecao_excluir($vfId)){
    
    ?>
    <p class='alert alert-success'>
        Selecao excluída com sucesso!
    </p>
    
    <meta http-equiv='refresh' content="1;url=../index.html">
    <?php
} else {
    ?>
    <p class='alert alert-danger'>Erro ao excluir a selecao!</p>
    <?php
}    


