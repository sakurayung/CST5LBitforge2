<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FixMigrationsSeeder extends Seeder
{
    public function run()
    {
        try {
            // Create migrations table if needed
            if (!Schema::hasTable('migrations')) {
                Schema::create('migrations', function ($table) {
                    $table->increments('id');
                    $table->string('migration');
                    $table->integer('batch');
                });
                $this->command->info('Created migrations table');
            }

            // Mark migrations as completed
            $migrations = [
                '0001_01_01_000000_create_users_table',
                '0001_01_01_000001_create_cache_table',
                '0001_01_01_000002_create_jobs_table',
                '2025_04_11_150746_create_personal_access_tokens_table',
                '2025_05_06_150102_create_items_table'
            ];

            foreach ($migrations as $migration) {
                if (!DB::table('migrations')->where('migration', $migration)->exists()) {
                    DB::table('migrations')->insert([
                        'migration' => $migration,
                        'batch' => 1
                    ]);
                    $this->command->info("Marked $migration as completed");
                }
            }
            
            $this->command->info("Migration fix completed successfully");
        } catch (\Exception $e) {
            $this->command->error("Error fixing migrations: " . $e->getMessage());
        }
    }
}