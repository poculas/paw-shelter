<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdoptionRequest extends Model
{
    protected $fillable = [
        'animal_id',
        'applicant_name',
        'email',
        'phone',
        'address',
        'housing_type',
        'pet_experience',
        'notes',
        'status',
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class, 'animal_id');
    }
}
