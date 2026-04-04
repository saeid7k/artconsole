<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\Phone;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
      return [
        'firstname' => ['required', 'string', 'max:255'],
        'lastname' => ['nullable', 'string', 'max:255'],
        'email' => [
          'required',
          'string',
          'email',
          'max:255',
          Rule::unique(User::class)->ignore($this->user()->id),
        ],
        'country_code' => ['nullable', 'string', 'max:10'],
        'phone' => ['nullable', new Phone()],
        'website' => ['nullable', 'string', 'max:255'],
        // 'address' => ['nullable'],
        'address.unit' => ['nullable', 'string', 'max:255'],
        'address.street' => ['nullable', 'string', 'max:255'],
        'address.city' => ['nullable', 'string', 'max:255'],
        'address.province' => ['nullable', 'string', 'max:255'],
        'address.postal_code' => ['nullable', 'string', 'max:20'],
        'address.country' => ['nullable', 'string', 'max:50'],
        'bio' => ['nullable', 'string', 'max:1000'],
      ];
    }

    public function messages(): array
    {
      return [
        'firstname.required' => 'First name is required.',
        'firstname.string' => 'First name must be a valid text.',
        'firstname.max' => 'First name may not be greater than 255 characters.',

        'lastname.string' => 'Last name must be a valid text.',
        'lastname.max' => 'Last name may not be greater than 255 characters.',

        'country_code.max' => 'Country code may not be greater than 10 characters.',

        'email.required' => 'Email address is required.',
        'email.email' => 'Please provide a valid email address.',
        'email.max' => 'Email may not be greater than 255 characters.',
        'email.unique' => 'This email address is already in use.',

        'phone.string' => 'Phone must be a valid text.',
        'phone.max' => 'Phone may not be greater than 20 characters.',

        'website.string' => 'Website must be a valid text.',
        'website.max' => 'Website may not be greater than 255 characters.',

        'address.unit.string' => 'Unit must be a valid text.',
        'address.unit.max' => 'Unit may not be greater than 255 characters.',
        'address.street.string' => 'Street must be a valid text.',
        'address.street.max' => 'Street may not be greater than 255 characters.',
        'address.city.string' => 'City must be a valid text.',
        'address.city.max' => 'City may not be greater than 255 characters.',
        'address.province.string' => 'Province must be a valid text.',
        'address.province.max' => 'Province may not be greater than 255 characters.',
        'address.postal_code.string' => 'Postal code must be a valid text.',
        'address.postal_code.max' => 'Postal code may not be greater than 20 characters.',
        'address.country.string' => 'Country must be a valid text.',
        'address.country.max' => 'Country may not be greater than 255 characters.',

        'bio.string' => 'Bio must be a valid text.',
        'bio.max' => 'Bio may not be greater than 1000 characters.',
      ];
    }

    /**
     * Prepare the data for validation.
     *
     */
    protected function prepareForValidation(): void
    {
      if ($this->has('phone')) {
        $phone = $this->input('phone');
        if (is_string($phone) && $phone !== '') {
          $cleanPhone = preg_replace('/\D+/', '', $phone);
          $this->merge(['phone' => $cleanPhone]);
        }
      }
    }
}
