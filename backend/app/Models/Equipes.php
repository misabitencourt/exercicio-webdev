<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipes extends Model
{
    protected $table = "equipes";
    protected $fillable = ['name', 'grupo_id', 'continente'];
    public $timestamps = false;

    public function grupo()
    {
        return $this->belongsTo('App\Models\Grupos');
    }
}
