<?php

namespace App\Http\Requests;

use App\Enums\ArtworkCategory;
use App\Enums\ArtworkEdition;
use App\Enums\ArtworkStatus;
use App\Helpers\FormatHelper;
use Illuminate\Foundation\Http\FormRequest;

class ArtworkStoreUpdateRequest extends FormRequest
{
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'artist_data' => ['nullable', 'array'],
      'sku' => ['nullable', 'string', 'max:100'],
      'category' => ['required', 'string', 'in:' . ArtworkCategory::stringifyAll()],
      'edition' => ['nullable', 'array'],
      'edition.type' => ['nullable', 'string', 'in:' . ArtworkEdition::stringifyAll()],
      'edition.number' => ['nullable', 'integer', 'min:1'],
      'edition.size' => ['nullable', 'integer', 'min:1'],
      'title' => ['required', 'string', 'max:255'],
      'subject' => ['nullable', 'string', 'max:100'],
      'description' => ['nullable', 'string'],
      'year' => ['nullable', 'string', 'max:100'],
      'dimensions' => ['nullable', 'array'],
      'dimensions.width' => ['nullable', 'numeric', 'min:0'],
      'dimensions.height' => ['nullable', 'numeric', 'min:0'],
      'dimensions.depth' => ['nullable', 'numeric', 'min:0'],
      'dimensions.unit' => ['nullable', 'string', 'in:cm,inches'],
      'price' => ['nullable', 'numeric', 'decimal:0,2'],
      'medium' => ['nullable', 'string', 'max:100'],
      'styles' => ['nullable', 'array'],
      'styles.*' => ['string', 'max:100'],
      'collections' => ['nullable', 'array'],
      'collections.*' => ['string', 'max:100'],
      'ownership' => ['nullable', 'string', 'in:owned,consigned'],
      'owner_contact_id' => ['nullable', 'integer', 'exists:contacts,id'],
      'status' => ['nullable', 'string', 'in:' . ArtworkStatus::stringifyAll()],
      'details' => ['nullable', 'array'],
      'notes' => ['nullable', 'string'],
    ];
  }

  public function messages(): array
  {
    return [
      'price.decimal' => 'The price must be a valid monetary amount with up to two decimal places.',
    ];
  }

  public function prepareForValidation()
  {
    $newPrice = FormatHelper::toFloat($this->input('price'));
    $this->merge([
      'price' => $newPrice,
    ]);
  }
}
