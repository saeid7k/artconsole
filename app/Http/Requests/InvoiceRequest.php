<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InvoiceRequest extends FormRequest
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
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    $galleryId = $this->invoice ? $this->invoice->gallery_id : $this->input('gallery_id');

    return [
      'contact_id' => 'required|exists:contacts,id',
      'number' => ['required', 'string', 'max:100', Rule::unique('invoices')->ignore($this->invoice)->where('gallery_id', $galleryId)],
      'date' => 'required|date',
      'due_date' => 'sometimes|nullable|date|after_or_equal:date',
      'items' => 'required|array|min:1',
      'tax_id' => 'sometimes|nullable|exists:taxes,id',
      'tax_rate' => 'sometimes|nullable|numeric',
      'subtotal' => 'required|decimal:0,2|max:9999999999.99',
      'available_extra_costs' => 'sometimes|nullable|array',
      'available_extra_costs.shipping' => 'sometimes|boolean',
      'available_extra_costs.discount' => 'sometimes|boolean',
      'shipping_cost' => 'sometimes|nullable|decimal:0,2|max:9999999999.99',
      'shipping_taxable' => 'sometimes|boolean',
      'discount_type' => 'sometimes|nullable|string|in:percentage,fixed',
      'discount_rate' => 'sometimes|nullable|decimal:0,2|max:9999999999.99',
      'discount_amount' => 'sometimes|nullable|decimal:0,2|max:9999999999.99',
      'tax_amount' => 'sometimes|nullable|decimal:0,2|max:9999999999.99',
      'total' => 'required|decimal:0,2|max:9999999999.99',
      'notes' => 'sometimes|nullable|string|max:500',
    ];
  }

  public function messages(): array
  {
    return [
      'contact_id.required' => 'Select customer for the invoice.',
      'contact_id.exists' => 'The selected contact is invalid.',
      'number.required' => 'The invoice number is required.',
      'number.unique' => 'The invoice number must be unique within the gallery.',
      'date.required' => 'The invoice date is required.',
      'date.date' => 'The invoice date must be a valid date.',
      'due_date.date' => 'The due date must be a valid date.',
      'due_date.after_or_equal' => 'The due date must be after or equal to the invoice date.',
      'items.required' => 'At least one invoice item is required.',
      'items.array' => 'Items are not in the correct format.',
      'items.min' => 'At least one invoice item is required.',
      'notes.max' => 'Notes cannot exceed 500 characters.',
    ];
  }
}
