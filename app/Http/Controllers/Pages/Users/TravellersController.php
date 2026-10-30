<?php

namespace App\Http\Controllers\Pages\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\TravellerRequest;
use App\Models\Traveller;
use App\Models\User;
use App\Services\Systems\TriadIdMask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TravellersController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        return Inertia::render('User/Travellers/Index');
    }

    /**
     * createTraveller
     *
     * @return void
     */
    public function create()
    {
        return Inertia::render('User/Travellers/Create');
    }

    /**
     * Search customers by name or email for the traveller customer picker.
     */
    public function searchCustomers(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));

        if (mb_strlen($search) < 3) {
            return response()->json([]);
        }

        $customers = User::query()
            ->select(['id', 'full_name', 'email'])
            ->where(function ($query) use ($search) {
                $query->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('full_name')
            ->limit(10)
            ->get()
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
            ]);

        return response()->json($customers);
    }

    /**
     * Store a newly created traveller for the selected customer.
     */
    public function store(TravellerRequest $request): RedirectResponse
    {
        Traveller::create($request->travellerAttributes());

        return redirect()
            ->route('user.travellers.index')
            ->with('success', 'Traveller created successfully.');
    }

    /**
     * Show the form for editing the specified traveller.
     */
    public function edit(string|int $id): Response
    {
        $traveller = $this->findTraveller($id);
        $traveller->load('user:id,full_name,email');

        return Inertia::render('User/Travellers/Edit', [
            'traveller' => $traveller,
        ]);
    }

    /**
     * Update the specified traveller in storage.
     */
    public function update(TravellerRequest $request, string|int $id): RedirectResponse
    {
        $traveller = $this->findTraveller($id);
        $traveller->update($request->travellerAttributes());

        return redirect()
            ->route('user.travellers.index')
            ->with('success', 'Traveller updated successfully.');
    }

    /**
     * Remove the specified traveller from storage.
     */
    public function destroy(string|int $id): JsonResponse|RedirectResponse
    {
        $traveller = $this->findTraveller($id);
        $traveller->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'message' => 'Traveller deleted successfully.',
            ]);
        }

        return redirect()
            ->route('user.travellers.index')
            ->with('success', 'Traveller deleted successfully.');
    }

    /**
     * Resolve a traveller by numeric ID or TriadIdMask encoded index.
     */
    private function findTraveller(string|int $id): Traveller
    {
        if (is_numeric($id)) {
            return Traveller::findOrFail((int) $id);
        }

        try {
            $decoded = TriadIdMask::decode((string) $id);

            return Traveller::findOrFail($decoded);
        } catch (\Throwable) {
            return Traveller::findOrFail($id);
        }
    }

    /**
     * retrieveData
     *
     * @param  mixed  $request
     * @return void
     */
    public function retrieveData(Request $request)
    {
        $search = $request->search;
        $userId = $request->query('user_id', $request->query('customer_id'));

        $travellers = Traveller::query()
            ->when($userId, function ($q) use ($userId) {
                if (is_numeric($userId)) {
                    $q->where('user_id', (int) $userId);
                } else {
                    try {
                        $decoded = TriadIdMask::decode((string) $userId);
                        $q->where('user_id', $decoded);
                    } catch (\Throwable) {
                        $q->where('user_id', $userId);
                    }
                }
            })
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('first_name', 'like', "%{$search}%");
                    $qq->orWhere('last_name', 'like', "%{$search}%");
                });
            })
            ->with('user:id,full_name,email')
            ->orderBy('id', 'asc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($travellers);
    }
}
