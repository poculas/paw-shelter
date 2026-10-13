<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\AdoptionRequestController;

Route::apiResource('animals', AnimalController::class);
Route::apiResource('adoption-requests', AdoptionRequestController::class);
