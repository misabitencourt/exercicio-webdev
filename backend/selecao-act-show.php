<?php
include_once('selecao-funcoes.php');
?>

<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">Nome</th>
      <th scope="col">Grupo</th>
      <th scope="col">Continente</th>
    </tr>
  </thead>
<?php
$vtSelecoes = selecao_buscar( $_POST['vfTextoBusca'] );
foreach ($vtSelecoes as $vtSelecao) {
    if ($vtSelecao['nome'])
        ?>
        <tr>
          <th scope="row"><?=$vtSelecao['nome']?></th>
          <td><?=$vtSelecao['grupo']?></td>
          <td><?=$vtSelecao['continente']?></td>
        </tr>
</table>

<a href="../index.html" class='btn btn-primary'>
        Voltar</a>
<?php
}
?>

