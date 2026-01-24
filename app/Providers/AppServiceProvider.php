<?php

namespace App\Providers;

use App\Models\Artwork;
use App\Models\Gallery;
use App\Models\InviteLink;
use App\Models\Location;
use App\Models\Media;
use App\Models\User;
use App\Observers\ArtworkObserver;
use App\Observers\GalleryObserver;
use App\Observers\InviteLinkObserver;
use App\Observers\LocationObserver;
use App\Observers\MediaObserver;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        User::observe(UserObserver::class);
        Gallery::observe(GalleryObserver::class);
        InviteLink::observe(InviteLinkObserver::class);
        Artwork::observe(ArtworkObserver::class);
        Location::observe(LocationObserver::class);
        Media::observe(MediaObserver::class);
    }
}
