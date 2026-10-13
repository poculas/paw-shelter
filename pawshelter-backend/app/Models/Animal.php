<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Animal extends Model
{
    protected $fillable = [
        'name', 'breed', 'weight', 'age', 'gender', 'description', 'personality', 'image', 'category'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        // If the image is already a full URL (Cloudinary or web URL), return as is
        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        // Fallback for local storage files if any
        return asset('storage/' . ltrim($this->image, '/'));
    }
}
