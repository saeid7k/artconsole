<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
});

Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
  Route::get('/contacts', [ContactController::class, 'index'])->name('contacts.index');
});

require __DIR__.'/auth.php';
