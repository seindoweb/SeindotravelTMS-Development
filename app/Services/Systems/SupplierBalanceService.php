<?php

namespace App\Services\Systems;

use App\Constants\SupplierAndBalanceConstant;
use App\Models\Supplier;
use App\Models\SupplierBalance;
use App\Models\SupplierBalanceTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SupplierBalanceService
{
    /**
     * Record supplier balance transaction.
     *
     * All transaction amounts must be positive.
     * Balance direction is determined by balance type
     * and transaction type.
     */
    public function record(
        string $currencyCode,
        string $balanceType,
        string $transactionType,
        float|string $amount,
        ?string $referenceType = null,
        ?string $referenceId = null,
        ?string $referenceNo = null,
        ?string $description = null,
        ?string $supplierResourceCode = null,
        ?string $transactionDate = null,
    ): SupplierBalanceTransaction {

        $supplier = Supplier::query()->where('code', $supplierResourceCode)->firstOrFail();
        $supplierId = $supplier->id;
        return DB::transaction(function () use (
            $supplierId,
            $currencyCode,
            $balanceType,
            $transactionType,
            $amount,
            $referenceType,
            $referenceId,
            $referenceNo,
            $description,
            $supplierResourceCode,
            $transactionDate,
        ) {

            // Find or create supplier balance.
            $balance = SupplierBalance::query()
                ->where('supplier_id', $supplierId)
                ->where('currency_code', $currencyCode)
                ->where('balance_type', $balanceType)
                ->lockForUpdate()
                ->first();

            if (!$balance) {
                $balance = SupplierBalance::create([
                    'supplier_id' => $supplierId,
                    'currency_code' => $currencyCode,
                    'balance_type' => $balanceType,
                    'initial_balance' => 0,
                    'current_balance' => 0,
                    'credit_limit' => 0,
                    'is_active' => true,
                ]);

                // Lock newly created balance.
                $balance = SupplierBalance::query()
                    ->lockForUpdate()
                    ->findOrFail($balance->id);
            }

            if (!$balance->is_active) {
                throw ValidationException::withMessages([
                    'supplier_balance' => 'Supplier balance is inactive.',
                ]);
            }

            // Validate amount.
            $amount = bcadd((string) $amount, '0', 2);

            if (bccomp($amount, '0', 2) <= 0) {
                throw ValidationException::withMessages([
                    'amount' => 'Transaction amount must be greater than zero.',
                ]);
            }

            $balanceType = $balance->balance_type;

            if (!in_array($balanceType, [
                SupplierAndBalanceConstant::TYPE_PREPAID,
                SupplierAndBalanceConstant::TYPE_POSTPAID,
            ], true)) {
                throw ValidationException::withMessages([
                    'balance_type' => 'Invalid supplier balance type.',
                ]);
            }

            $before = bcadd(
                (string) $balance->current_balance,
                '0',
                2
            );

            // Determine transaction direction.
            $delta = $this->getBalanceDelta(
                $balanceType,
                $transactionType
            );

            // Initial balance can only be recorded once.
            if (
                $transactionType ===
                SupplierAndBalanceConstant::TRANSACTION_INITIAL
            ) {
                $hasTransactions = SupplierBalanceTransaction::query()
                    ->where('supplier_balance_id', $balance->id)
                    ->exists();

                if (
                    $hasTransactions ||
                    bccomp($before, '0', 2) !== 0
                ) {
                    throw ValidationException::withMessages([
                        'transaction_type' =>
                        'Initial balance has already been recorded.',
                    ]);
                }
            }

            // Calculate new balance.
            $after = $delta === 1
                ? bcadd($before, $amount, 2)
                : bcsub($before, $amount, 2);

            // Prepaid cannot have negative deposit balance.
            if (
                $balanceType === SupplierAndBalanceConstant::TYPE_PREPAID &&
                bccomp($after, '0', 2) < 0
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Insufficient supplier deposit balance.',
                ]);
            }

            // Postpaid cannot exceed credit limit.
            if (
                $balanceType === SupplierAndBalanceConstant::TYPE_POSTPAID &&
                $transactionType ===
                SupplierAndBalanceConstant::TRANSACTION_USAGE &&
                bccomp($after, (string) $balance->credit_limit, 2) > 0
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Supplier credit limit exceeded.',
                ]);
            }

            // Postpaid outstanding cannot become negative.
            if (
                $balanceType === SupplierAndBalanceConstant::TYPE_POSTPAID &&
                bccomp($after, '0', 2) < 0
            ) {
                throw ValidationException::withMessages([
                    'amount' =>
                    'Payment or refund exceeds outstanding balance.',
                ]);
            }

            $now = now();

            // Create transaction history.
            $transaction = SupplierBalanceTransaction::create([
                'supplier_balance_id' => $balance->id,
                'supplier_resource_code' => $supplierResourceCode,
                'transaction_type' => $transactionType,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'reference_no' => $referenceNo,
                'description' => $description,
                'amount' => $amount,
                'balance_before' => $before,
                'balance_after' => $after,
                'transaction_date' => $transactionDate ?? $now,
            ]);

            // Update current balance.
            $balance->current_balance = $after;

            if (
                $transactionType ===
                SupplierAndBalanceConstant::TRANSACTION_INITIAL
            ) {
                $balance->initial_balance = $amount;
            }

            $balance->save();

            return $transaction;
        });
    }

    /**
     * Determine balance direction.
     *
     * +1 = Increase balance
     * -1 = Decrease balance
     */
    private function getBalanceDelta(
        string $balanceType,
        string $transactionType
    ): int {

        $directions = [
            SupplierAndBalanceConstant::TRANSACTION_INITIAL => 1,
            SupplierAndBalanceConstant::TRANSACTION_TOPUP => 1,
            SupplierAndBalanceConstant::TRANSACTION_USAGE => -1,
            SupplierAndBalanceConstant::TRANSACTION_REFUND => 1,
            SupplierAndBalanceConstant::TRANSACTION_PAYMENT => -1,
            SupplierAndBalanceConstant::TRANSACTION_ADJUSTMENT_IN => 1,
            SupplierAndBalanceConstant::TRANSACTION_ADJUSTMENT_OUT => -1,
        ];

        if (!isset($directions[$transactionType])) {
            throw ValidationException::withMessages([
                'transaction_type' => 'Invalid supplier transaction type.',
            ]);
        }

        // Postpaid usage increases outstanding.
        // Postpaid refund decreases outstanding.
        if (
            $balanceType === SupplierAndBalanceConstant::TYPE_POSTPAID
        ) {
            return match ($transactionType) {
                SupplierAndBalanceConstant::TRANSACTION_USAGE => 1,
                SupplierAndBalanceConstant::TRANSACTION_REFUND => -1,
                default => $directions[$transactionType],
            };
        }

        return $directions[$transactionType];
    }
}
