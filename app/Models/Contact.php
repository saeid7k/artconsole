<?php

namespace App\Models;

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

  protected $appends = ['full_name'];

  public function getFullNameAttribute(): string
  {
    return trim($this->firstname . ' ' . $this->lastname);
  }

  public function owner()
  {
    return $this->belongsTo(User::class, 'user_id');
  }
}
