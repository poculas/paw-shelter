<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adoption_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('animal_id')->constrained('animals')->onDelete('cascade');
            $table->string('applicant_name');
            $table->string('email');
            $table->string('phone', 50);
            $table->text('address');
            $table->string('housing_type', 100);
            $table->text('pet_experience')->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 50)->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adoption_requests');
    }
};
