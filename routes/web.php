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

  Route::prefix('contacts')->name('contacts.')->group(function () {
    Route::get('/', [ContactController::class, 'index'])->name('index');
    Route::get('/{contact}', [ContactController::class, 'show'])->name('view');
    Route::post('/update-photo', [ContactController::class, 'updatePhoto'])->name('update-photo');
  });

  Route::prefix('galleries')->name('galleries.')->group(function () {
    Route::post('set-current', [App\Http\Controllers\GalleryController::class, 'setCurrentGallery'])->name('set-current');
  });

  Route::prefix('profile')->name('profile.')->group(function () {
    Route::post('/update', [App\Http\Controllers\ProfileController::class, 'update'])->name('update');
    Route::post('/update-photo', [App\Http\Controllers\ProfileController::class, 'updatePhoto'])->name('update-photo');
  });

  Route::prefix('activity-logs')->name('activity-logs.')->group(function () {
    Route::get('/model-activities', [App\Http\Controllers\ActivityLogController::class, 'modelActivities'])->name('model-activities');
  });
});

Route::middleware(['auth', Admin::class])->group(function () {
  Route::prefix('users')->name('users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::post('/{user}/delete', [UserController::class, 'destroy'])->name('delete');
  });
});

require __DIR__.'/auth.php';
