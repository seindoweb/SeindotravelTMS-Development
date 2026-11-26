<?php

namespace App\Http\Controllers\Pages\Finances;

use App\Constants\ModelConstant;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\SupplierBalance;
use App\Models\SupplierBalanceTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HotelsMgController extends Controller
{
    /**
     * index
     */
    public function index(): Response
    {
        $search = request()->input('search');
        $transactionType = request()->input('transaction_type');

        $transactions = SupplierBalanceTransaction::query()
            ->where('supplier_resource_code', 'MG')
            ->when($search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('id', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('reference_id', 'like', "%{$search}%");
                });
            })
            ->when($transactionType, fn ($q, $type) => $q->where('transaction_type', $type))
            ->with(['creator'])
            ->latest('transaction_date')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        $supplier = Supplier::where('code', 'MG')->first();
        $balance = $supplier ? SupplierBalance::where('supplier_id', $supplier->id)->first() : null;

        return Inertia::render('Finance/Hotels/Mg/Index', [
            'supplier' => $supplier,
            'balance' => $balance,
            'transactions' => $transactions,
            'filters' => [
                'search' => $search,
                'transaction_type' => $transactionType,
            ],
        ]);
    }

    /**
     * create
     */
    public function create(): Response
    {
        $supplier = Supplier::where('code', 'MG')->first();
        $balance = $supplier ? SupplierBalance::where('supplier_id', $supplier->id)->first() : null;

        return Inertia::render('Finance/Hotels/Mg/Create', [
            'supplier' => $supplier,
            'balance' => $balance,
        ]);
    }

    /**
     * store
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'transaction_type' => ['required', 'string'],
            'reference_type' => ['required', 'string'],
            'amount' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
        ]);

        $supplier = Supplier::query()->where('code', ModelConstant::ORDER_SUPPLIER_RESOURCE_MG)->first();
        if ($supplier) {
            FinanceSupplierController::balance($supplier, $validated);

            return redirect()
                ->route('finance.hotels.mg.index')
                ->with('success', 'Transaction payload received successfully!');
        } else {
            return redirect()
                ->route('finance.flights.via.index')
                ->with('error', 'Payload failed to be received because the resource provider could not be found!');
        }
    }
}
