<?php

namespace App\Console\Commands;

use Database\Seeders\AppSeeder;
use Database\Seeders\DemoSeeder;
use Database\Seeders\FullFakeSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class LocalFreshSetup extends Command
{
  protected $signature = 'app:local-fresh-setup';
  protected $description = 'Perform a fresh setup of the application with demo data. This will reset the database, run all migrations, seed the database with demo data, and clear the storage folder.';

  public function handle()
  {
    // exit if not in local environment
    if (
      !app()->environment('local')
      || !in_array(getenv('DB_HOST'), ['127.0.0.1', 'localhost'])
    ) {
      $this->error('This command can only be run in the local environment and with a local database.');
      return;
    }

    // rollback all migrations
    $this->call('migrate:reset');

    // run all migrations
    $this->call('migrate');

    // Clear Drive Folder
    $this->comment('Clearing drive folder...');
    $drivePath = public_path('drive');
    if (File::exists($drivePath)) {
      File::cleanDirectory($drivePath);
    }
    $this->info('✅ Drive folder cleared.');

    // seed the database
    $this->call('db:seed', ['--class' => AppSeeder::class]);
    $this->call('db:seed', ['--class' => FullFakeSeeder::class]);

    // Run queued jobs
    $this->comment('Processing queued jobs...');
    $this->callSilent('queue:work', ['--stop-when-empty' => true]);
    $this->info('✅ Demo setup complete!');
  }
}
