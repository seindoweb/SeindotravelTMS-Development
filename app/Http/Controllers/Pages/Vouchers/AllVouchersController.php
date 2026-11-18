<?php

namespace App\Http\Controllers\Pages\Vouchers;

use App\Http\Controllers\Controller;
use App\Models\ProductAttribute;
use App\Models\Voucher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AllVouchersController extends Controller
{
    /**
     * indexFlight
     */
    public function indexFlight(): Response
    {
        return $this->index('flight', 'Flight Vouchers');
    }

    /**
     * indexHotel
     */
    public function indexHotel(): Response
    {
        return $this->index('hotel', 'Hotel Vouchers');
    }

    /**
     * indexTour
     */
    public function indexTour(): Response
    {
        return $this->index('tour', 'Tour Vouchers');
    }

    /**
     * createFlight
     */
    public function createFlight(): Response
    {
        return $this->create('flight', 'Flight Vouchers');
    }

    /**
     * createHotel
     */
    public function createHotel(): Response
    {
        return $this->create('hotel', 'Hotel Vouchers');
    }

    /**
     * createTour
     */
    public function createTour(): Response
    {
        return $this->create('tour', 'Tour Vouchers');
    }

    /**
     * create
     */
    public function create(string $product_attribute, string $title): Response
    {
        $att = ProductAttribute::where('attribute', $product_attribute)->first();

        return Inertia::render('Voucher/AllVouchers/Create', [
            'product_attribute' => $product_attribute,
            'productAttributeModel' => $att,
            'title' => $title,
        ]);
    }

    /**
     * index
     */
    public function index(string $product_attribute, string $title): Response
    {
        $att = ProductAttribute::where('attribute', $product_attribute)->first();

        $search = request()->input('search');
        $status = request()->input('status');
        $discountType = request()->input('discount_type');
        $voucherType = request()->input('voucher_type');

        $vouchers = Voucher::query()
            ->when($att, fn ($q) => $q->where('product_attribute_id', $att->id))
            ->when($search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('id', 'like', "%{$search}%")
                        ->orWhere('discount_value', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($q, $status) => $q->where('status', $status))
            ->when($discountType, fn ($q, $type) => $q->where('discount_type', $type))
            ->when($voucherType, fn ($q, $type) => $q->where('voucher_type', $type))
            ->with(['productAttribute', 'creator', 'voucherTranslations', 'voucherCodes'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Voucher/AllVouchers/Index', [
            'product_attribute' => $product_attribute,
            'productAttributeModel' => $att,
            'title' => $title,
            'vouchers' => $vouchers,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'discount_type' => $discountType,
                'voucher_type' => $voucherType,
            ],
        ]);
    }

    /**
     * store
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_attribute' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date'],
            'voucher_type' => ['required', 'in:general,signup'],
            'distribution_type' => ['required', 'in:public,personal'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'usage_per_user' => ['nullable', 'integer', 'min:1'],
            'platform' => ['required', 'in:0,1,2'],
        ]);

        $att = ProductAttribute::where('attribute', $validated['product_attribute'])->firstOrFail();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('vouchers', 'public');
            $imagePath = Storage::url($path);
        }

        Voucher::create([
            'product_attribute_id' => $att->id,
            'image_path' => $imagePath,
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'max_discount' => $validated['discount_type'] === 'percentage' ? ($validated['max_discount'] ?? null) : null,
            'min_order_amount' => $validated['min_order_amount'] ?? 0,
            'start_at' => $validated['start_at'] ?? null,
            'end_at' => $validated['end_at'] ?? null,
            'voucher_type' => $validated['voucher_type'],
            'distribution_type' => $validated['distribution_type'],
            'usage_limit' => $validated['usage_limit'] ?? null,
            'usage_per_user' => $validated['usage_per_user'] ?? 1,
            'used_count' => 0,
            'platform' => (int) $validated['platform'],
            'status' => 'draft', // Selalu draft saat awal pembuatan
        ]);

        $routeMap = [
            'flight' => 'voucher.indexFlight',
            'hotel' => 'voucher.indexHotel',
            'tour' => 'voucher.indexTour',
        ];
        $targetRoute = $routeMap[$validated['product_attribute']] ?? 'voucher.indexHotel';

        return redirect()->route($targetRoute)->with('success', 'Voucher created successfully as Draft!');
    }

    /**
     * edit
     */
    public function edit(Voucher $voucher): Response
    {
        $voucher->load('productAttribute');

        $product_attribute = $voucher->productAttribute?->attribute ?? 'hotel';
        $title = ucfirst($product_attribute).' Vouchers';

        return Inertia::render('Voucher/AllVouchers/Edit', [
            'voucher' => $voucher,
            'product_attribute' => $product_attribute,
            'title' => $title,
        ]);
    }

    /**
     * update
     */
    public function update(Request $request, Voucher $voucher): RedirectResponse
    {
        $validated = $request->validate([
            'product_attribute' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'delete_image' => ['nullable', 'boolean'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date'],
            'voucher_type' => ['required', 'in:general,signup'],
            'distribution_type' => ['required', 'in:public,personal'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'usage_per_user' => ['nullable', 'integer', 'min:1'],
            'platform' => ['required', 'in:0,1,2'],
        ]);

        $updateData = [
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'max_discount' => $validated['discount_type'] === 'percentage' ? ($validated['max_discount'] ?? null) : null,
            'min_order_amount' => $validated['min_order_amount'] ?? 0,
            'start_at' => $validated['start_at'] ?? null,
            'end_at' => $validated['end_at'] ?? null,
            'voucher_type' => $validated['voucher_type'],
            'distribution_type' => $validated['distribution_type'],
            'usage_limit' => $validated['usage_limit'] ?? null,
            'usage_per_user' => $validated['usage_per_user'] ?? 1,
            'platform' => (int) $validated['platform'],
        ];

        if ($request->hasFile('image')) {
            if ($voucher->image_path) {
                $oldPath = ltrim(str_replace('/storage/', '', $voucher->image_path), '/');
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('vouchers', 'public');
            $updateData['image_path'] = Storage::url($path);
        } elseif ($request->boolean('delete_image')) {
            if ($voucher->image_path) {
                $oldPath = ltrim(str_replace('/storage/', '', $voucher->image_path), '/');
                Storage::disk('public')->delete($oldPath);
            }
            $updateData['image_path'] = null;
        }

        $voucher->update($updateData);

        $routeMap = [
            'flight' => 'voucher.indexFlight',
            'hotel' => 'voucher.indexHotel',
            'tour' => 'voucher.indexTour',
        ];
        $targetRoute = $routeMap[$validated['product_attribute']] ?? 'voucher.indexHotel';

        return redirect()->route($targetRoute)->with('success', 'Voucher updated successfully!');
    }

    /**
     * destroy
     */
    public function destroy(Voucher $voucher): RedirectResponse
    {
        if ($voucher->image_path) {
            $path = ltrim(str_replace('/storage/', '', $voucher->image_path), '/');
            Storage::disk('public')->delete($path);
        }

        $voucher->delete();

        return redirect()->back()->with('success', 'Voucher deleted successfully!');
    }

    /**
     * toggleStatus
     */
    public function toggleStatus(Voucher $voucher): RedirectResponse
    {
        $newStatus = $voucher->status === 'active' ? 'draft' : 'active';

        if ($newStatus === 'active' && $voucher->voucherTranslations()->count() === 0) {
            return redirect()->back()->with('error', 'Cannot activate voucher! Please add at least one translation (Indonesian or English) first.');
        }

        $voucher->update([
            'status' => $newStatus,
        ]);

        $statusLabel = $newStatus === 'active' ? 'activated' : 'set to draft';

        return redirect()->back()->with('success', "Voucher has been {$statusLabel} successfully!");
    }

    /**
     * saveTranslation
     */
    public function saveTranslation(Request $request, Voucher $voucher): RedirectResponse
    {
        $validated = $request->validate([
            'locale' => ['required', 'in:id,en'],
            'description' => ['nullable', 'string'],
        ]);

        $description = $validated['description'];
        if ($description) {
            // Strip any style attributes (e.g. Tailwind CSS variables --tw-...)
            $description = preg_replace('/\s*style="[^"]*"/i', '', $description);
            // Unwrap empty spans
            $description = preg_replace('/<span\s*>([\s\S]*?)<\/span>/i', '$1', $description);
            // Remove empty formatting tags
            $description = preg_replace('/<(b|i|u|strong|em)\s*><\/\1>/i', '', $description);
            $description = trim($description);
        }

        $voucher->voucherTranslations()->updateOrCreate(
            ['locale' => $validated['locale']],
            ['description' => $description]
        );

        return redirect()->back()->with('success', 'Voucher translation saved successfully!');
    }

    /**
     * deleteTranslation
     */
    public function deleteTranslation(Voucher $voucher, string $locale): RedirectResponse
    {
        if (! in_array($locale, ['id', 'en'])) {
            return redirect()->back()->with('error', 'Invalid locale provided.');
        }

        $voucher->voucherTranslations()->where('locale', $locale)->delete();

        if ($voucher->status === 'active' && $voucher->voucherTranslations()->count() === 0) {
            $voucher->update(['status' => 'draft']);
        }

        return redirect()->back()->with('success', 'Voucher translation deleted successfully!');
    }
}
