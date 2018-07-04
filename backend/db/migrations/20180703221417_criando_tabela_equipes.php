<?php


use Phinx\Migration\AbstractMigration;

class CriandoTabelaEquipes extends AbstractMigration
{
    public function up()
    {
        $users = $this->table('equipes');
        $users->addColumn('name', 'string', ['limit' => 30])
            ->addColumn('continente', 'string', ['limit' => 30])
            ->addColumn('grupo_id', 'integer', ['null' => true])
            ->addForeignKey('grupo_id', 'grupos', 'id', ['delete'=> 'SET_NULL', 'update'=> 'NO_ACTION'])
            ->save();
    }

    public function down()
    {

    }
}
