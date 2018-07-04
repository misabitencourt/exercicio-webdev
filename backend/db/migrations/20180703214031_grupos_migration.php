<?php


use Phinx\Migration\AbstractMigration;

class GruposMigration extends AbstractMigration
{
    public function up()
    {
        $users = $this->table('grupos');
        $users->addColumn('name', 'string', ['limit' => 30])
            ->save();
    }

    public function down()
    {

    }
}
