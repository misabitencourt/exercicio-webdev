<?php

include_once('selecao-funcoes.php');
include_once('_init.php');

if (selecao_alterar( $_POST['id'], $_POST )){    
    
    ?>
    
    <meta http-equiv='refresh' content="1;url=../index.html">
    <?php
} else {
    ?>
    <p class='alert alert-danger'>Erro ao alterar a selecao</p>
    <?php
}  

