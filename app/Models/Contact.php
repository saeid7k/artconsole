<?php

namespace App\Models;

use App\Helpers\AddressHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
  use HasFactory;

  protected $casts = [
    'address' => 'object',
    'business' => 'object',
    'birthday' => 'date',
  ];

  // Appends

  protected $appends = ['full_name', 'formatted_address'];

  public function getFullNameAttribute(): string
  {
    return trim($this->firstname . ' ' . $this->lastname);
  }

  public function getFormattedAddressAttribute(): string
  {
    $address = $this->address->unit ? $this->address->street . ' - ' . $this->address->unit : $this->address->street;
    $address .= $this->address->city ? ', ' . $this->address->city : '';
    $address .= $this->address->province ? ', ' . $this->address->province : '';
    $address .= $this->address->postal_code ? ' ' . AddressHelper::formatPostalCode($this->address->postal_code) : '';
    $address .= $this->address->country ? ', ' . $this->address->country : '';

    return $address;
  }

  // Relationships

  public function owner()
  {
    return $this->belongsTo(User::class, 'user_id');
  }
}
