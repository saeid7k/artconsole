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
    Route::get('artists-options', [App\Http\Controllers\GalleryController::class, 'getArtistsOptions'])->name('artists-options');
    Route::post('{gallery}/update-accounting', [App\Http\Controllers\GalleryController::class, 'updateAccounting'])->name('update-accounting');
  });

  Route::prefix('artworks')->name('artworks.')->group(function () {
    Route::get('/', [App\Http\Controllers\ArtworkController::class, 'index'])->name('index');
    Route::get('/{artwork}', [App\Http\Controllers\ArtworkController::class, 'show'])->name('show');
    Route::post('/store-update', [App\Http\Controllers\ArtworkController::class, 'storeUpdate'])->name('store-update');
    Route::delete('/{artwork}', [App\Http\Controllers\ArtworkController::class, 'destroy'])->name('destroy');
    Route::post('/generate-sku', [App\Http\Controllers\ArtworkController::class, 'generateSku'])->name('generate-sku');
    Route::post('/{artwork}/move', [App\Http\Controllers\ArtworkController::class, 'moveLocation'])->name('move');
    Route::get('/{artwork}/images', [App\Http\Controllers\ArtworkController::class, 'images'])->name('images');
    Route::post('/{artwork}/upload-images', [App\Http\Controllers\ArtworkController::class, 'uploadImages'])->name('upload-images');
    Route::post('/{artwork}/rename-image', [App\Http\Controllers\ArtworkController::class, 'renameImage'])->name('rename-image');
    Route::post('/{artwork}/set-main-image', [App\Http\Controllers\ArtworkController::class, 'setAsMainImage'])->name('set-main-image');
    Route::get('/{artwork}/download-image/{media_id}', [App\Http\Controllers\ArtworkController::class, 'downloadImage'])->name('download-image');
    Route::delete('/{artwork}/delete-image/{media_id}', [App\Http\Controllers\ArtworkController::class, 'deleteImage'])->name('delete-image');
    Route::post('/{artwork}/save-note', [App\Http\Controllers\ArtworkController::class, 'saveNote'])->name('save-note');
    Route::post('/{artwork}/copy', [App\Http\Controllers\ArtworkController::class, 'copy'])->name('copy');
    Route::post('/mass-move', [App\Http\Controllers\ArtworkController::class, 'massMoveLocation'])->name('mass-move');
    Route::post('/mass-update-status', [App\Http\Controllers\ArtworkController::class, 'massUpdateStatus'])->name('mass-update-status');
    Route::post('/search', [App\Http\Controllers\ArtworkController::class, 'search'])->name('search');
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
    Route::get('/all/{type}', [App\Http\Controllers\TagController::class, 'getAllTags'])->name('get-all');
    Route::post('/store', [App\Http\Controllers\TagController::class, 'store'])->name('store');
    Route::delete('/{tag}', [App\Http\Controllers\TagController::class, 'destroy'])->name('destroy');
  });

  Route::prefix('locations')->name('locations.')->group(function () {
    Route::get('/', [App\Http\Controllers\LocationController::class, 'index'])->name('index');
    Route::post('/store-update', [App\Http\Controllers\LocationController::class, 'storeUpdate'])->name('store-update');
    Route::delete('/{location}', [App\Http\Controllers\LocationController::class, 'destroy'])->name('destroy');
    Route::get('/options', [App\Http\Controllers\LocationController::class, 'options'])->name('options');
    Route::post('/set-primary', [App\Http\Controllers\LocationController::class, 'setPrimary'])->name('set-primary');
    Route::post('/toggle-active', [App\Http\Controllers\LocationController::class, 'toggleActive'])->name('toggle-active');
  });

  Route::prefix('notes')->name('notes.')->group(function () {
    Route::get('/{note}/collaborators', [App\Http\Controllers\NoteController::class, 'getCollaborators'])->name('collaborators');
    Route::delete('/{note}', [App\Http\Controllers\NoteController::class, 'destroy']) ->name('destroy');
  });

  Route::prefix('reports')->name('reports.')->group(function () {
    Route::get('/', [App\Http\Controllers\ReportController::class, 'index'])->name('index');
    Route::post('/store', [App\Http\Controllers\ReportController::class, 'store'])->name('store');
    Route::get('/{report}/download', [App\Http\Controllers\ReportController::class, 'download'])->name('download');
  });
});

Route::middleware(['auth', Admin::class])->group(function () {
  Route::prefix('users')->name('users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::post('/{user}/delete', [UserController::class, 'destroy'])->name('delete');
  });
});

require __DIR__.'/auth.php';
