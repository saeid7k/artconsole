<?php

namespace App\Http\Requests;

use App\Rules\Phone;
use Illuminate\Foundation\Http\FormRequest;

class ContactUpdateRequest extends FormRequest
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
      'email' => ['nullable', 'string', 'email', 'max:255'],
      'phone' => ['nullable', new Phone()],
      'relationship' => ['nullable', 'array'],
      // 'address' => ['nullable'],
      'address.unit' => ['nullable', 'string', 'max:255'],
      'address.street' => ['nullable', 'string', 'max:255'],
      'address.city' => ['nullable', 'string', 'max:255'],
      'address.province' => ['nullable', 'string', 'max:255'],
      'address.postal_code' => ['nullable', 'string', 'max:20'],
      'address.country' => ['nullable', 'string', 'max:50'],
      // 'business' => ['nullable'],
      'business.name' => ['nullable', 'string', 'max:255'],
      'business.title' => ['nullable', 'string', 'max:255'],
      'business.phone' => ['nullable', new Phone()],
      'business.email' => ['nullable', 'string', 'email', 'max:255'],
      'business.website' => ['nullable', 'string', 'max:255'],
      // date format: Y-m-d
      'birthday' => ['nullable', 'date', 'date_format:Y-m-d'],
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

      'email.email' => 'Please provide a valid email address.',
      'email.max' => 'Email may not be greater than 255 characters.',

      'phone.string' => 'Phone must be a valid text.',
      'phone.max' => 'Phone may not be greater than 20 characters.',

      'birthday.date' => 'Birthday must be a valid date.',
      'birthday.date_format' => 'Birthday format is not valid.',
    ];
  }

  public function prepareForValidation()
  {
    $this->merge([
      'birthday' => $this->birthday ? date('Y-m-d', strtotime($this->birthday)) : null,
    ]);
  }
}
