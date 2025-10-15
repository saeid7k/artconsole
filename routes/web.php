<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\Admin;
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

Route::middleware(['auth', Admin::class])->group(function () {
  Route::prefix('users')->name('users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index');
  });
});

require __DIR__.'/auth.php';
