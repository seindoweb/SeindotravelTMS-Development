<?php

namespace App\Http\Controllers\Pages\Finances;

use App\Constants\SupplierAndBalanceConstant;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Services\Systems\SupplierBalanceService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class FinanceSupplierController extends Controller
{
    public static function balance(Supplier $supplier, array $validated)
    {
        if ($validated['transaction_type'] == SupplierAndBalanceConstant::TRANSACTION_INITIAL) {
            $validated['description'] = 'Initial supplier balance';
        } else if ($validated['transaction_type'] === SupplierAndBalanceConstant::TRANSACTION_TOPUP && blank($validated['description'] ?? null)) {
            $validated['description'] = 'Supplier deposit top up';
        } else if ($validated['transaction_type'] === SupplierAndBalanceConstant::TRANSACTION_ADJUSTMENT_IN && blank($validated['description'] ?? null)) {
            $validated['description'] = 'Supplier balance correction';
        } else if ($validated['transaction_type'] === SupplierAndBalanceConstant::TRANSACTION_ADJUSTMENT_OUT && blank($validated['description'] ?? null)) {
            $validated['description'] = 'Supplier balance correction';
        }
        app(SupplierBalanceService::class)->record(
            currencyCode: 'IDR',
            balanceType: SupplierAndBalanceConstant::TYPE_PREPAID,
            transactionType: $validated['transaction_type'],
            amount: $validated['amount'],
            referenceType: $validated['reference_type'],
            description: $validated['description'],
            supplierResourceCode: $supplier->code,
            transactionDate: Carbon::now()
        );
    }
}
