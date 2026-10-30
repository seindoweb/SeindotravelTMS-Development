<?php

use App\Models\Traveller;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('admin', 'web');

    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin);
});

/**
 * @return array<string, mixed>
 */
function validTravellerPayload(int $userId): array
{
    return [
        'userId' => $userId,
        'title' => 'Mr.',
        'firstName' => 'Budi',
        'lastName' => 'Santoso',
        'dateOfBirth' => '1990-05-10',
        'nationality' => 'id',
        'documentType' => 'KTP',
        'documentNumber' => '3171234567890001',
        'issuingCountry' => 'id',
        'documentIssueDate' => '2020-01-01',
        'documentExpiryDate' => '2030-01-01',
        'passportNumber' => 'A1234567',
        'passportIssuingCountry' => 'id',
        'passportIssueDate' => '2022-01-01',
        'passportExpiryDate' => '2027-01-01',
    ];
}

test('customers can be searched by name or email', function () {
    $budi = User::factory()->create(['full_name' => 'Budi Santoso', 'email' => 'budi@example.com']);
    $siti = User::factory()->create(['full_name' => 'Siti Aminah', 'email' => 'siti.santoso@example.com']);
    User::factory()->create(['full_name' => 'Andi Wijaya', 'email' => 'andi@example.com']);

    $response = $this->getJson(route('user.travellers.searchCustomers', ['search' => 'santoso']))
        ->assertOk()
        ->assertJsonCount(2);

    expect(collect($response->json())->pluck('id')->all())
        ->toEqualCanonicalizing([$budi->id, $siti->id]);
});

test('customer search requires at least three characters', function () {
    User::factory()->create(['full_name' => 'Budi Santoso']);

    $this->getJson(route('user.travellers.searchCustomers', ['search' => 'bu']))
        ->assertOk()
        ->assertExactJson([]);
});

test('customer search returns at most ten results', function () {
    User::factory()->count(15)->create(['full_name' => 'Customer Test']);

    $this->getJson(route('user.travellers.searchCustomers', ['search' => 'customer']))
        ->assertOk()
        ->assertJsonCount(10);
});

test('traveller can be stored for selected customer', function () {
    $customer = User::factory()->create();

    $this->post(route('user.travellers.store'), validTravellerPayload($customer->id))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user.travellers.index'));

    $traveller = Traveller::query()->sole();

    expect($traveller->user_id)->toBe($customer->id)
        ->and($traveller->first_name)->toBe('Budi')
        ->and($traveller->nationality)->toBe('ID')
        ->and($traveller->issuing_country)->toBe('ID')
        ->and($traveller->passport_number)->toBe('A1234567')
        ->and($traveller->created_by)->toBe(User::query()->whereHas('roles', fn ($query) => $query->where('name', 'admin'))->sole()->id);
});

test('traveller requires an existing customer', function () {
    $this->post(route('user.travellers.store'), validTravellerPayload(999999))
        ->assertSessionHasErrors('userId');

    expect(Traveller::count())->toBe(0);
});

test('traveller requires mandatory fields', function () {
    $this->post(route('user.travellers.store'), [])
        ->assertSessionHasErrors([
            'userId',
            'firstName',
            'lastName',
            'dateOfBirth',
            'nationality',
            'documentType',
            'documentNumber',
            'issuingCountry',
            'passportNumber',
        ]);
});

test('traveller edit page displays traveller data', function () {
    $customer = User::factory()->create(['full_name' => 'Owner Customer']);
    $traveller = Traveller::factory()->create([
        'user_id' => $customer->id,
        'first_name' => 'John',
        'last_name' => 'Doe',
    ]);

    $this->get(route('user.travellers.edit', $traveller->index))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('User/Travellers/Edit')
            ->has('traveller')
            ->where('traveller.first_name', 'John')
            ->where('traveller.user.full_name', 'Owner Customer'));
});

test('traveller can be updated', function () {
    $customer = User::factory()->create();
    $traveller = Traveller::factory()->create(['user_id' => $customer->id]);

    $payload = validTravellerPayload($customer->id);
    $payload['firstName'] = 'UpdatedFirstName';

    $this->put(route('user.travellers.update', $traveller->index), $payload)
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user.travellers.index'));

    $traveller->refresh();

    expect($traveller->first_name)->toBe('UpdatedFirstName');
});

test('traveller can be deleted via json api', function () {
    $traveller = Traveller::factory()->create();

    $this->deleteJson(route('user.travellers.destroy', $traveller->index))
        ->assertOk()
        ->assertJson(['message' => 'Traveller deleted successfully.']);

    expect(Traveller::where('id', $traveller->id)->exists())->toBeFalse();
});

test('traveller can be deleted with redirect', function () {
    $traveller = Traveller::factory()->create();

    $this->delete(route('user.travellers.destroy', $traveller->id))
        ->assertRedirect(route('user.travellers.index'));

    expect(Traveller::where('id', $traveller->id)->exists())->toBeFalse();
});

test('retrieve data includes associated customer', function () {
    $customer = User::factory()->create(['full_name' => 'Associated Owner']);
    Traveller::factory()->create([
        'user_id' => $customer->id,
        'first_name' => 'UniquePaxName',
    ]);

    $response = $this->getJson(route('user.travellers.retrieveData', ['search' => 'UniquePaxName']))
        ->assertOk();

    expect($response->json('data.0.user.full_name'))->toBe('Associated Owner');
});
