<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\Animal::firstOrCreate(
            ['name' => 'Farquad'],
            [
                'breed' => 'Shih Tzu Mix',
                'weight' => 5.2,
                'age' => 2,
                'gender' => 'Male',
                'category' => 'priority',
                'description' => 'Rescued from an abandoned building in Manila. Gentle-natured, loves treats, and gets along well with other small dogs.',
                'personality' => 'Affectionate, quiet, couch-potato, easygoing with humans.',
                'image' => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
            ]
        );

        \App\Models\Animal::firstOrCreate(
            ['name' => 'Blacky'],
            [
                'breed' => 'Aspin (Native)',
                'weight' => 14.5,
                'age' => 3,
                'gender' => 'Male',
                'category' => 'priority',
                'description' => 'High-energy rescue found wandering near Quezon City circle. Fully vaccinated and eager to find an active family.',
                'personality' => 'Loyal, energetic, great watch-companion, highly trainable.',
                'image' => 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
            ]
        );

        \App\Models\Animal::firstOrCreate(
            ['name' => 'Beverly'],
            [
                'breed' => 'Domestic Shorthair',
                'weight' => 3.8,
                'age' => 1,
                'gender' => 'Female',
                'category' => 'priority',
                'description' => 'Playful kitten rescued from a drainage pipe. She loves feather wands, warm laps, and window watching.',
                'personality' => 'Curious, purrs constantly, friendly with children.',
                'image' => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
            ]
        );

        \App\Models\Animal::firstOrCreate(
            ['name' => 'Abdul'],
            [
                'breed' => 'Labrador Mix',
                'weight' => 21.0,
                'age' => 4,
                'gender' => 'Male',
                'category' => 'normal',
                'description' => 'Rescued as a stray pup, now a gentle giant who walks smoothly on a leash and loves belly rubs.',
                'personality' => 'Calm, patient, friendly with dogs and kids alike.',
                'image' => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
            ]
        );

        \App\Models\Animal::firstOrCreate(
            ['name' => 'Lee'],
            [
                'breed' => 'Tabby Cat',
                'weight' => 4.2,
                'age' => 2,
                'gender' => 'Male',
                'category' => 'normal',
                'description' => 'Calm feline rescued near our Katipunan shelter. Fully neutered and litter-trained.',
                'personality' => 'Independent, serene, loves sunbathing and chin scratches.',
                'image' => 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
            ]
        );

        \App\Models\Animal::firstOrCreate(
            ['name' => 'Ismail'],
            [
                'breed' => 'Calico Cat',
                'weight' => 3.5,
                'age' => 2,
                'gender' => 'Female',
                'category' => 'normal',
                'description' => 'Sweet and social calico looking for a calm home. Gets along well with other friendly pets.',
                'personality' => 'Gentle, vocal when dinner is served, cuddly.',
                'image' => 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
            ]
        );
    }
}
