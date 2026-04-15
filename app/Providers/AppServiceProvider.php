<?php

namespace App\Providers;

use App\Models\Artwork;
use App\Models\Contact;
use App\Models\Gallery;
use App\Models\InviteLink;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Location;
use App\Models\Media;
use App\Models\Payment;
use App\Models\User;
use App\Observers\ArtworkObserver;
use App\Observers\ContactObserver;
use App\Observers\GalleryObserver;
use App\Observers\InviteLinkObserver;
use App\Observers\InvoiceItemObserver;
use App\Observers\InvoiceObserver;
use App\Observers\LocationObserver;
use App\Observers\MediaObserver;
use App\Observers\PaymentObserver;
use App\Observers\SubscriptionObserver;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Subscription;
use Spatie\Browsershot\Browsershot;
use Spatie\LaravelPdf\Facades\Pdf;

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
        Contact::observe(ContactObserver::class);
        Invoice::observe(InvoiceObserver::class);
        InvoiceItem::observe(InvoiceItemObserver::class);
        Payment::observe(PaymentObserver::class);
        Subscription::observe(SubscriptionObserver::class);

        Pdf::default()
          ->withBrowsershot(function (Browsershot $browsershot) {
            $browsershot->noSandbox()->timeout(120);
            if (app()->environment('production', 'staging')) {
              $browsershot->setNodeBinary('/usr/bin/node')
                 ->setNpmBinary('/usr/bin/npm');
            }
          });

        Cashier::calculateTaxes();
        Cashier::useCustomerModel(Gallery::class);
    }
}
