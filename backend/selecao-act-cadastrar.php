<?php

include_once('selecao-funcoes.php');
include_once('_init.php');


if (validar() && selecao_cadastrar($_POST)){
    ?>
    <p class='alert alert-success'>
        Selecao <?=$_POST['nome']."/".$_POST['grupo']?> cadastrado com sucesso!</p>
    
    <meta http-equiv='refresh' content="1;url=../index.html">
<?php } else { ?>
    <p class='alert alert-danger'>Erro ao cadastrar a selecao</p>
    <?php
}
?>
