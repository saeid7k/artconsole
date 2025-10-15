<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
  public function index(Request $request)
  {
    $users = User::paginate($request->per_page ?? 20)->withQueryString();
    return inertia('Users/UsersIndex', [
      'users' => $users
    ]);
  }
}
