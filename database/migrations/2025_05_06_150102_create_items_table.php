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
        // Items Table
        Schema::create('items', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('image_url');
            $table->string('item_name');
            $table->text('tags'); // "Gaming, Desktop, High-end"
            $table->string('warehouse');
            $table->decimal('price', 10, 2);
            $table->integer('stocks')->default(0);
            $table->integer('reviews_count')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0.00);

            // Specs (JSON-formatted fields) - removed default values
            $table->json('processor')->nullable();
            $table->json('graphics_card')->nullable();
            $table->json('ram')->nullable();
            $table->json('storage')->nullable();
            $table->json('motherboard')->nullable();
            $table->json('display')->nullable();
            $table->json('battery')->nullable();
            $table->json('keyboard')->nullable();
            $table->json('mouse')->nullable();
            $table->json('microphone')->nullable();
            $table->json('headset')->nullable();

            // Array-form specs as comma-separated strings
            $table->string('ports')->nullable();
            $table->string('connectivity')->nullable();

            $table->string('operating_system')->nullable();
            $table->string('power_supply')->nullable();
            $table->string('cooling')->nullable();
            $table->string('dimensions')->nullable();
            $table->string('weight')->nullable();

            $table->timestamps();
        });
        
        // Cart Items Table
        Schema::create('cart_items', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->string('item_id');
            $table->foreign('user_id')->references('id')->on('userstable')->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('grand_total', 15, 2);
            $table->integer('stocks');
            $table->timestamps();
        });

        // Purchase Receipts Table
        Schema::create('purchase_receipts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->string('item_id');
            $table->foreign('user_id')->references('id')->on('userstable');
            $table->foreign('item_id')->references('id')->on('items');
            $table->integer('quantity');
            $table->decimal('total_price', 15, 2);
            $table->decimal('shipping_fee', 15, 2);
            $table->decimal('grand_total', 15, 2);
            $table->timestamp('ordered_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->string('deliver_to');
            $table->string('shipped_from');
            $table->string('fullname');
            $table->string('phone_number');
            $table->timestamps();
        });

        // Pending Orders Table
        Schema::create('pending_orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->string('item_id');
            $table->foreign('user_id')->references('id')->on('userstable');
            $table->foreign('item_id')->references('id')->on('items');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->decimal('shipping_fee', 15, 2);
            $table->decimal('grand_total', 15, 2);
            $table->string('deliver_to');
            $table->string('shipped_from');
            $table->string('fullname');
            $table->string('phone_number');
            $table->timestamp('ordered_at')->nullable();
            $table->timestamps();
        });

        // Comments Table
        Schema::create('comments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('item_id');
            $table->string('user_id');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('userstable')->onDelete('cascade');
            $table->text('comment');
            $table->boolean('is_edited')->default(false);
            $table->timestamps();
        });

        // Item Ratings Table
        Schema::create('itemsrate', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('item_id');
            $table->string('user_id');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('userstable')->onDelete('cascade');
            $table->integer('rate')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itemsrate');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('pending_orders');
        Schema::dropIfExists('purchase_receipts');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('items');
    }
};
