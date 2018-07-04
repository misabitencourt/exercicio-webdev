<?php


use Phinx\Migration\AbstractMigration;

class AdicionandoGruposPadroes extends AbstractMigration
{
    public function up()
    {
        $rows = [
            [
                'name' => 'A'
            ],
            [
                'name' => 'B'
            ],
            [
                'name' => 'C'
            ],
            [
                'name' => 'D'
            ],
            [
                'name' => 'E'
            ],
            [
                'name' => 'F'
            ],
            [
                'name' => 'G'
            ],
            [
                'name' => 'H'
            ]
        ];

        $this->table('grupos')->insert($rows)->save();
    }

    public function down()
    {
        $this->execute('DELETE FROM grupos');
    }
}
