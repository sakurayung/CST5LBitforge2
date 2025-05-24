<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop and re-add foreign keys with cascade
        Schema::table('purchase_receipts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['item_id']);
            $table->foreign('user_id')->references('id')->on('userstable')->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });

        Schema::table('pending_orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['item_id']);
            $table->foreign('user_id')->references('id')->on('userstable')->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse the cascade
        Schema::table('purchase_receipts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['item_id']);
            $table->foreign('user_id')->references('id')->on('userstable');
            $table->foreign('item_id')->references('id')->on('items');
        });

        Schema::table('pending_orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['item_id']);
            $table->foreign('user_id')->references('id')->on('userstable');
            $table->foreign('item_id')->references('id')->on('items');
        });
    }
};
