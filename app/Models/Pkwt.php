<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pkwt extends Model
{
    protected $table = 'pkwt';

    protected $fillable = [
        'user_id',
        'employee_id',
        'contract_number',
        'start_date',
        'end_date',
        'status',
    ];

    public function employee()
    {
        return $this->belongsTo(Employees::class, 'employee_id');
    }
}
