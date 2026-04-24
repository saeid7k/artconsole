<?php

namespace App\Console\Commands;

use Database\Seeders\AppSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class InitialSetup extends Command
{
  protected $signature = 'app:initial-setup';
  protected $description = '';

  public function handle()
  {
    // rollback all migrations
    $this->call('migrate:reset');

    // run all migrations
    $this->call('migrate');

    // Clear Public Path Drive Folder
    $this->comment('Clearing drive folder...');
    $drivePath = public_path('drive');
    if (File::exists($drivePath)) {
      File::cleanDirectory($drivePath);
    }
    $this->info('✅ Drive folder cleared.');

    // seed the database
    $this->call('db:seed', ['--class' => AppSeeder::class]);

    // Run queued jobs
    $this->comment('Processing queued jobs...');
    $this->callSilent('queue:work', ['--stop-when-empty' => true]);

    $this->info('✅ Demo setup complete!');
  }
}
