<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Phone implements ValidationRule
{
  /**
   * Run the validation rule.
   *
   * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
   */
  public function validate(string $attribute, mixed $value, Closure $fail): void {

    // must be string or number
    if (!is_string($value) && !is_numeric($value)) {
      $fail('The :attribute must be a valid text.');
      return;
    }

    // Remove non-digit characters
    $digits = preg_replace('/\D+/', '', $value);

    // Check if the number of digits is between 10 and 20
    if (strlen($digits) < 10 || strlen($digits) > 20) {
      $fail('The :attribute must contain between 10 and 20 digits.');
    }
  }
}
