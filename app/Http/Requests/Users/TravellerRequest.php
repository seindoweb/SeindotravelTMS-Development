<?php

namespace App\Http\Requests\Users;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TravellerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'userId' => ['required', 'integer', Rule::exists('users', 'id')],
            'title' => ['required', 'string', Rule::in(['Mr.', 'Mrs.', 'Ms.'])],
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'dateOfBirth' => ['required', 'date', 'before:today'],
            'nationality' => ['required', 'string', 'max:8'],
            'documentType' => ['required', 'string', 'max:88'],
            'documentNumber' => ['required', 'string', 'max:100'],
            'issuingCountry' => ['required', 'string', 'size:2'],
            'documentIssueDate' => ['nullable', 'date'],
            'documentExpiryDate' => ['nullable', 'date', 'after_or_equal:documentIssueDate'],
            'passportNumber' => ['required', 'string', 'max:100'],
            'passportIssuingCountry' => ['nullable', 'string', 'size:2'],
            'passportIssueDate' => ['nullable', 'date'],
            'passportExpiryDate' => ['nullable', 'date', 'after_or_equal:passportIssueDate'],
        ];
    }

    /**
     * Get the validated data mapped to the travellers table columns.
     *
     * @return array<string, mixed>
     */
    public function travellerAttributes(): array
    {
        $validated = $this->validated();

        return [
            'user_id' => $validated['userId'],
            'title' => $validated['title'],
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
            'date_of_birth' => $validated['dateOfBirth'],
            'nationality' => strtoupper($validated['nationality']),
            'document_type' => $validated['documentType'],
            'document_number' => $validated['documentNumber'],
            'issuing_country' => strtoupper($validated['issuingCountry']),
            'document_issue_date' => $validated['documentIssueDate'] ?? null,
            'document_expiry_date' => $validated['documentExpiryDate'] ?? null,
            'passport_number' => $validated['passportNumber'],
            'passport_issuing_country' => isset($validated['passportIssuingCountry'])
                ? strtoupper($validated['passportIssuingCountry'])
                : null,
            'passport_issue_date' => $validated['passportIssueDate'] ?? null,
            'passport_expiry_date' => $validated['passportExpiryDate'] ?? null,
        ];
    }
}
