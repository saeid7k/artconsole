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

  protected $appends = ['abilities', 'full_name', 'formatted_address'];

  public function getAbilitiesAttribute(): array
  {
    return [
      'delete' => auth()->user()->can('delete', $this),
    ];
  }

  public function getFullNameAttribute(): string
  {
    return trim($this->firstname . ' ' . $this->lastname);
  }

  public function getFormattedAddressAttribute(): string
  {
    return AddressHelper::formatAddress($this->address);
  }

  // Relationships

  public function gallery()
  {
    return $this->belongsTo(Gallery::class, 'gallery_id');
  }

  public function owner()
  {
    return User::find($this->gallery->user_id);
  }
}
