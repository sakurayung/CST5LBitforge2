<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DistanceController;
use App\Http\Controllers\Api\PopulateController;
use App\Http\Controllers\Api\ItemsController;
use App\Http\Controllers\Api\ReviewsController;
use App\Http\Controllers\Api\TransactionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

Route::get('/user', function (Request $request) {
    $user = Auth::user();

    // --- Aggregates ---
    $overallSpend = DB::table('purchase_receipts')
        ->where('user_id', $user->id)
        ->sum('grand_total');

    $averageSpend = DB::table('purchase_receipts')
        ->selectRaw('DATE(ordered_at) as date, SUM(grand_total) as total')
        ->where('user_id', $user->id)
        ->groupBy(DB::raw('DATE(ordered_at)'))
        ->get()
        ->avg('total');

    $itemsOrdered = DB::table('pending_orders')
        ->where('user_id', $user->id)
            ->count();

    $cart_items_quantity = DB::table('cart_items')
        ->where('user_id', $user->id)
            ->count();

    $items_purchased = DB::table('purchase_receipts')
        ->where('user_id', $user->id)
            ->sum('quanitity');

    // Cart Items (with JOIN)
    $cartItems = DB::table('cart_items')
        ->join('items', 'items.id', '=', 'cart_items.item_id')
        ->where('cart_items.user_id', $user->id)
        ->select(
            'items.id as item_id',
            'items.item_name as item_name',
            'items.image_url',
            'cart_items.id',
            'cart_items.quantity',
            'cart_items.unit_price',
            'cart_items.grand_total',
            'cart_items.stocks'
        )
        ->get();

    // Purchase Receipts (with JOIN)
    $purchaseReceipts = DB::table('purchase_receipts')
        ->join('items', 'items.id', '=', 'purchase_receipts.item_id')
        ->where('purchase_receipts.user_id', $user->id)
        ->select(
            'purchase_receipts.*',
            'items.item_name as item_name',
            'items.image_url',
            DB::raw('ROUND(purchase_receipts.total_price / purchase_receipts.quantity, 2) as unit_price') // Fixed calculation
        )
        ->get()
        ->map(function ($receipt) {
            $receipt->unit_price = (float)$receipt->unit_price;
            return $receipt;
        });

    // Pending Orders (with JOIN)
    $pendingOrders = DB::table('pending_orders')
        ->join('items', 'items.id', '=', 'pending_orders.item_id')
        ->where('pending_orders.user_id', $user->id)
        ->select(
            'pending_orders.*',
            'items.item_name as item_name',
            'items.image_url'
        )
        ->get();

    

    return response()->json([
        'user' => [
            'profile_picture' => $user->profile_picture,
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'phone_number' => $user->phone_number,
            'password' => $user->password,
            'default_address' => [
                'street' => $user->street,
                'city' => $user->city,
                'region' => $user->region,
                'postal_code' => $user->postal_code,
            ],
            'is_suspend' => $user->isSuspend,
            'overall_spend' => round($overallSpend ?? 0, 2),
            'average_spend' => round($averageSpend ?? 0, 2),
            'cart_items' => $cartItems,
            'purchase_receipts' => $purchaseReceipts,
            'pending_orders' => $pendingOrders,
            'cart_items_quantity' => $cart_items_quantity,
            'items_ordered' => $itemsOrdered,
            'items_purchased' => $items_purchased

        ]
    ]);
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/populate-users', [PopulateController::class, 'populateUsers']);
    Route::put('/user/{id}', [AuthController::class, 'update']);
    Route::delete('/user/{id}', [AuthController::class, 'deleteUser']);
    Route::post('/items-create', [ItemsController::class, 'store']);
    Route::put('/items/{id}', [ItemsController::class, 'update']);
    Route::get('/pending-orders', [PopulateController::class, 'pendingOrders']);
    Route::delete('/items/{id}', [ItemsController::class, 'destroy'])->name('items.destroy');
    Route::post('/confirm-order', [TransactionsController::class, 'confirmOrders']);
    Route::put('/items/{id}/stocks', [ItemsController::class, 'updateStocks']);
    Route::post('/store-pending-orders', [TransactionsController::class, 'storePendingOrders']);
    Route::post('/cart/store', [TransactionsController::class, 'storeCartItems']);
    Route::delete('/cart/{id}', [TransactionsController::class, 'deleteCart']);
    Route::post('/rate-item', [ReviewsController::class, 'RecordReviews']);
    Route::post('/comment-item', [ReviewsController::class, 'AddComment']);
    Route::get('/display-admin-details', [AuthController::class, 'displayAdminDetails']);
    Route::put('/cart/{id}/quantity', [TransactionsController::class, 'updateCartQuantity']);
    Route::patch('/users/{id}/suspend', [AuthController::class, 'suspendUser']);
    Route::get('/user/further-details', [AuthController::class, 'furtherUserDetails']);
});

Route::get('/populate-items', [PopulateController::class, 'populateItems']);
Route::get('/populate-top-pre-build-desktops', [PopulateController::class, 'populateTopPreBuildDesktops']);
Route::get('/populate-top-items', [PopulateController::class, 'populateTopItems']);
Route::get('/show-item/{id}', [ItemsController::class, 'show']);
Route::get('/search-items', [PopulateController::class, 'searchItems']);

Route::post('/signin', [AuthController::class, 'signUp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/calculate-distance', [DistanceController::class, 'calculateDistance']);
