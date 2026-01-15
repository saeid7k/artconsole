<?php

use App\Http\Controllers\AppLayoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GeocodeController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\Admin;
use Illuminate\Support\Facades\Route;

Route::get('join/{token}', [App\Http\Controllers\InviteLinkController::class, 'joinByToken'])->name('join-by-token');

Route::middleware('auth')->group(function () {
  Route::prefix('geocode')->name('geocode.')->group(function () {
    Route::get('/coordinates', [GeocodeController::class, 'getCoordinates'])->name('coordinates');
  });
});

Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
  Route::get('/interval-data', [AppLayoutController::class, 'intervalData'])->name('interval-data');

  Route::prefix('contacts')->name('contacts.')->group(function () {
    Route::get('/', [App\Http\Controllers\ContactController::class, 'index'])->name('index');
    Route::get('/{contact}', [App\Http\Controllers\ContactController::class, 'show'])->name('show');
    Route::post('/store', [App\Http\Controllers\ContactController::class, 'store'])->name('store');
    Route::post('/update-photo', [App\Http\Controllers\ContactController::class, 'updatePhoto'])->name('update-photo');
    Route::post('/store-update', [App\Http\Controllers\ContactController::class, 'storeUpdate'])->name('store-update');
    Route::post('/{contact}/delete', [App\Http\Controllers\ContactController::class, 'destroy'])->name('delete');
    Route::post('/{contact}/update-relationships', [App\Http\Controllers\ContactController::class, 'updateRelationships'])->name('update-relationships');
  });

  Route::get('/all-contacts', [App\Http\Controllers\ContactController::class, 'getContacts'])->name('all-contacts');
  Route::get('/artists', [App\Http\Controllers\ContactController::class, 'getArtists'])->name('artists');

  Route::prefix('galleries')->name('galleries.')->group(function () {
    Route::post('/create', [App\Http\Controllers\GalleryController::class, 'create'])->name('create');
    Route::post('set-current', [App\Http\Controllers\GalleryController::class, 'setCurrentGallery'])->name('set-current');
    Route::post('{gallery}/update-logo', [App\Http\Controllers\GalleryController::class, 'updateGalleryLogo'])->name('update-logo');
    Route::post('{gallery}/remove-logo', [App\Http\Controllers\GalleryController::class, 'removeLogo'])->name('remove-logo');
    Route::post('{gallery}/update', [App\Http\Controllers\GalleryController::class, 'update'])->name('update');
    Route::post('{gallery}/update-address', [App\Http\Controllers\GalleryController::class, 'updateAddress'])->name('update-address');
  });

  Route::prefix('artworks')->name('artworks.')->group(function () {
    Route::get('/', [App\Http\Controllers\ArtworkController::class, 'index'])->name('index');
    Route::get('/{artwork}', [App\Http\Controllers\ArtworkController::class, 'show'])->name('show');
    Route::post('/store-update', [App\Http\Controllers\ArtworkController::class, 'storeUpdate'])->name('store-update');
    Route::post('/generate-sku', [App\Http\Controllers\ArtworkController::class, 'generateSku'])->name('generate-sku');
    Route::post('/{artwork}/move', [App\Http\Controllers\ArtworkController::class, 'moveLocation'])->name('move');
  });

  Route::prefix('members')->name('members.')->group(function () {
    Route::get('{gallery}', [App\Http\Controllers\MemberController::class, 'getMembers'])->name('all');
    Route::post('{gallery}/add', [App\Http\Controllers\MemberController::class, 'addMember'])->name('add');
    Route::post('{gallery}/change-access-level', [App\Http\Controllers\MemberController::class, 'changeAccessLevel'])->name('change-access-level');
    Route::post('{gallery}/remove/{member}', [App\Http\Controllers\MemberController::class, 'removeMember'])->name('remove');
  });

  Route::prefix('profile')->name('profile.')->group(function () {
    Route::post('/update', [App\Http\Controllers\ProfileController::class, 'update'])->name('update');
    Route::post('/update-photo', [App\Http\Controllers\ProfileController::class, 'updatePhoto'])->name('update-photo');
  });

  Route::prefix('activity-logs')->name('activity-logs.')->group(function () {
    Route::get('/model-activities', [App\Http\Controllers\ActivityLogController::class, 'modelActivities'])->name('model-activities');
  });

  Route::prefix('invite-links')->name('invite-links.')->group(function () {
    Route::post('{invite_link}/delete', [App\Http\Controllers\InviteLinkController::class, 'delete'])->name('delete');
    Route::post('{invite_link}/accept', [App\Http\Controllers\InviteLinkController::class, 'accept'])->name('accept');
    Route::post('{invite_link}/decline', [App\Http\Controllers\InviteLinkController::class, 'decline'])->name('decline');
  });

  Route::prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', [App\Http\Controllers\NotificationController::class, 'index'])->name('index');
    Route::get('/{count}/latest-notifications', [App\Http\Controllers\NotificationController::class, 'getLatest'])->name('latest');
    Route::post('/{notification_id}/mark-as-read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('mark-as-read');
    Route::post('/mark-all-as-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('mark-all-as-read');
    Route::post('/{notification_id}/mark-as-unread', [App\Http\Controllers\NotificationController::class, 'markAsUnread'])->name('mark-as-unread');
  });

  Route::prefix('tags')->name('tags.')->group(function () {
    Route::get('/grouped', [App\Http\Controllers\TagController::class, 'getGroupedTags'])->name('get-grouped');
  });

  Route::prefix('locations')->name('locations.')->group(function () {
    Route::get('/', [App\Http\Controllers\LocationController::class, 'index'])->name('index');
    Route::post('/store-update', [App\Http\Controllers\LocationController::class, 'storeUpdate'])->name('store-update');
    Route::get('/options', [App\Http\Controllers\LocationController::class, 'options'])->name('options');
  });
});

Route::middleware(['auth', Admin::class])->group(function () {
  Route::prefix('users')->name('users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::post('/{user}/delete', [UserController::class, 'destroy'])->name('delete');
  });
});

require __DIR__.'/auth.php';
