<?php

namespace App\Console\Commands;

use Database\Seeders\AppSeeder;
use Database\Seeders\DemoSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class DemoSetup extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'app:demo-setup';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Set up the application with demo data for testing and development.';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    // rollback all migrations
    $this->call('migrate:reset');

    // run all migrations
    $this->call('migrate');

    // Clear Storage Folder
    $this->comment('Clearing storage folder...');
    $storagePath = public_path('drive');
    if (File::exists($storagePath)) {
      File::cleanDirectory($storagePath);
    }
    $this->info('✅ Storage folder cleared.');

    // seed the database
    $this->call('db:seed', ['--class' => AppSeeder::class]);
    $this->call('db:seed', ['--class' => DemoSeeder::class]);
  }
}
