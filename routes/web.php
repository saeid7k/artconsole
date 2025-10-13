<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
});

Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
  Route::get('/contacts', [ContactController::class, 'index'])->name('contacts.index');

  Route::prefix('galleries')->name('galleries.')->group(function () {
    Route::post('set-current', [App\Http\Controllers\GalleryController::class, 'setCurrentGallery'])->name('set-current');
  });
});

require __DIR__.'/auth.php';
