<?php

namespace App\Services\Systems;

use App\Constants\ModelConstant;
use App\Constants\SupplierAndBalanceConstant;
use App\Models\OrderProductAttribute;
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
        ?string $description = null,
        ?string $supplierResourceCode = null,
        ?string $transactionDate = null,
    ): SupplierBalanceTransaction {

        // Validate supplier.
        $supplier = Supplier::query()
            ->where('code', $supplierResourceCode)
            ->firstOrFail();

        $supplierId = $supplier->id;

        // Validate balance type.
        if (! in_array($balanceType, [
            SupplierAndBalanceConstant::TYPE_PREPAID,
            SupplierAndBalanceConstant::TYPE_POSTPAID,
        ], true)) {
            throw ValidationException::withMessages([
                'balance_type' => 'Invalid supplier balance type.',
            ]);
        }

        // Validate amount.
        $amount = bcadd((string) $amount, '0', 2);

        if (bccomp($amount, '0', 2) <= 0) {
            throw ValidationException::withMessages([
                'amount' => 'Transaction amount must be greater than zero.',
            ]);
        }

        // Validate transaction type and determine direction.
        $delta = $this->getBalanceDelta(
            $balanceType,
            $transactionType
        );

        return DB::transaction(function () use (
            $supplierId,
            $currencyCode,
            $balanceType,
            $transactionType,
            $amount,
            $referenceType,
            $referenceId,
            $description,
            $supplierResourceCode,
            $transactionDate,
            $delta,
        ) {

            // Lock supplier to prevent concurrent balance creation.
            Supplier::query()
                ->whereKey($supplierId)
                ->lockForUpdate()
                ->firstOrFail();

            // Find supplier balance.
            $balance = SupplierBalance::query()
                ->where('supplier_id', $supplierId)
                ->where('currency_code', $currencyCode)
                ->where('balance_type', $balanceType)
                ->lockForUpdate()
                ->first();

            // Create balance if not exists.
            if (! $balance) {
                $balance = SupplierBalance::create([
                    'supplier_id' => $supplierId,
                    'currency_code' => $currencyCode,
                    'balance_type' => $balanceType,
                    'initial_balance' => 0,
                    'current_balance' => 0,
                    'is_active' => true,
                ]);
            }

            // Validate active balance.
            if (! $balance->is_active) {
                throw ValidationException::withMessages([
                    'supplier_balance' => 'Supplier balance is inactive.',
                ]);
            }

            $before = bcadd(
                (string) $balance->current_balance,
                '0',
                2
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
                        'transaction_type' => 'Initial balance has already been recorded.',
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

            // Postpaid outstanding cannot become negative.
            if (
                $balanceType === SupplierAndBalanceConstant::TYPE_POSTPAID &&
                bccomp($after, '0', 2) < 0
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Payment or refund exceeds outstanding balance.',
                ]);
            }

            // Create transaction history.
            $transaction = SupplierBalanceTransaction::create([
                'supplier_balance_id' => $balance->id,
                'supplier_resource_code' => $supplierResourceCode,
                'transaction_type' => $transactionType,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'description' => $description,
                'amount' => $amount,
                'balance_before' => $before,
                'balance_after' => $after,
                'transaction_date' => $transactionDate ?? now(),
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
     * Check whether supplier has sufficient balance
     * to process a booking.
     *
     * PREPAID:
     * Current balance must be >= booking amount.
     *
     * POSTPAID:
     * Current outstanding + booking amount
     * must not exceed credit limit.
     */
    public static function hasSufficientBalance(OrderProductAttribute $orderAtt): bool
    {
        $supplierResourceCode = $orderAtt->supplier_source;
        $currencyCode = 'IDR';
        $amount = 0;
        /**
         * =======================================================================
         * Initial section for customization per supplier
         * =======================================================================
         */
        if ($supplierResourceCode == ModelConstant::ORDER_SUPPLIER_RESOURCE_MG) {
            $currencyCode = $orderAtt->details->hotelBookingRoomDetails->first()->currency_code;
            foreach ($orderAtt->details->hotelBookingRoomDetails ?: [] as $hbrd) {
                $amount += (int) $hbrd->nta_price;
            }
        }

        /**
         * =======================================================================
         * End of supplier customization
         * =======================================================================
         */
        $supplier = Supplier::query()
            ->where('code', $supplierResourceCode)
            ->first();

        if (! $supplier) {
            return false;
        }

        $balance = SupplierBalance::query()
            ->where('supplier_id', $supplier->id)
            ->where('currency_code', $currencyCode)
            ->first();

        if (! $balance || ! $balance->is_active) {
            return false;
        }

        $amount = bcadd((string) $amount, '0', 2);

        if (bccomp($amount, '0', 2) <= 0) {
            return false;
        }

        $currentBalance = bcadd(
            (string) $balance->current_balance,
            '0',
            2
        );

        return bccomp($currentBalance, $amount, 2) >= 0;
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

        if (! isset($directions[$transactionType])) {
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
