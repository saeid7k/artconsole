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
      'title' => ['required', 'string', 'max:255'],
      'year' => ['nullable', 'string', 'max:100'],
      'price' => ['nullable', 'numeric', 'decimal:0,2'],
      'edition' => ['nullable', 'array'],
      'edition.type' => ['nullable', 'string', 'in:' . ArtworkEdition::stringifyAll()],
      'edition.number' => ['nullable', 'integer', 'min:1'],
      'edition.size' => ['nullable', 'integer', 'min:1'],
      'signed' => ['nullable', 'boolean'],
      'signature_note' => ['nullable', 'string', 'max:1000'],
      'description' => ['nullable', 'string', 'max:20000'],

      'category' => ['required', 'string', 'in:' . ArtworkCategory::stringifyAll()],
      'subjects' => ['nullable', 'array'],
      'subjects.*' => ['string', 'max:100'],
      'mediums' => ['nullable', 'array'],
      'mediums.*' => ['string', 'max:100'],
      'styles' => ['nullable', 'array'],
      'styles.*' => ['string', 'max:100'],
      'dimensions' => ['nullable', 'array'],
      'dimensions.width' => ['nullable', 'numeric', 'min:0'],
      'dimensions.height' => ['nullable', 'numeric', 'min:0'],
      'dimensions.depth' => ['nullable', 'numeric', 'min:0'],
      'dimensions.unit' => ['nullable', 'string', 'in:cm,inches'],

      'ownership' => ['nullable', 'string', 'in:owned,consigned'],
      'owner_contact_id' => ['nullable', 'integer', 'exists:contacts,id'],
      'consignment_terms' => ['nullable', 'string', 'max:20000'],
      'provenance' => ['nullable', 'string', 'max:20000'],

      'details' => ['nullable', 'array'],
      'status' => ['nullable', 'string', 'in:' . ArtworkStatus::stringifyAll()],

      'images' => ['nullable', 'array'],
      'images.*' => ['file', 'mimetypes:image/*', 'max:10240'],
    ];
  }

  public function messages(): array
  {
    return [
      'price.decimal' => 'The price must be a valid monetary amount with up to two decimal places.',
      'images.*.mimetypes' => 'Only image files are allowed.',
      'images.*.max' => 'Each image must not exceed 10 MB in size.',
    ];
  }

  public function prepareForValidation()
  {
    $newPrice = FormatHelper::toFloat($this->input('price'));
    $this->merge([
      'price' => $newPrice,
      'category' => $this->input('category') ?? ArtworkCategory::default()->value,
    ]);
  }
}
