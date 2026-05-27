<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class BlockedEmailDomains implements ValidationRule
{
  public function __construct(protected array $blockedDomains = [])
  {
    $this->blockedDomains = empty($blockedDomains)
      ? ['artconsole.io', 'artconsole.ai']
      : $blockedDomains;
  }

  /**
   * Run the validation rule.
   *
   * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
   */
  public function validate(string $attribute, mixed $value, Closure $fail): void
  {
    $domain = substr(strrchr($value, "@"), 1);

    if (in_array(strtolower($domain), $this->blockedDomains)) {
      $fail('The :attribute belongs to a restricted domain and cannot be used.');
    }
  }
}
