<?php

namespace App\Observers;

use App\Models\Contact;

class ContactObserver
{
  public function creating(Contact $contact): void
  {
    $user = auth()->user();

    // assign creator if not set
    if (!$contact->user_id) {
      $contact->creator()->associate($user);
    }
  }
}
