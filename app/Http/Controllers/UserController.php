<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
  public function index(Request $request)
  {
    $this->authorize('viewAny', User::class);

    $users = User::when($request->search, function ($q) use ($request) {
        $search = '%' . strtolower($request->search) . '%';
        $q->where(function ($q) use ($search) {
          $q->whereRaw('LOWER(firstname) LIKE ?', $search)
            ->orWhereRaw('LOWER(lastname) LIKE ?', $search)
            ->orWhereRaw('LOWER(email) LIKE ?', $search)
            ->orWhereRaw('LOWER(phone) LIKE ?', $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.street'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.city'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.province'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.postal_code'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.country'))) LIKE ?", $search);
        });
      })
      ->when($request->sort_by && $request->sort_order, function ($q) use ($request) {
        if ($request->sort_by === 'full_name') {
          $q->orderBy('firstname', $request->sort_order)->orderBy('lastname', $request->sort_order);
        } elseif ($request->sort_by === 'formatted_address') {
          $q->orderByRaw("JSON_UNQUOTE(JSON_EXTRACT(address, '$.street')) " . ($request->sort_order === 'asc' ? 'ASC' : 'DESC'));
        } else {
          $q->orderBy($request->sort_by, $request->sort_order);
        }
      }, function ($q) {
        $q->orderBy('firstname', 'asc')->orderBy('lastname', 'asc');
      })
      ->paginate($request->per_page ?? 20)->withQueryString();

    return inertia('Users/UsersIndex', [
      'users' => $users
    ]);
  }

  public function destroy(User $user)
  {
    $this->authorize('delete', $user);

    $user->delete();

    return response()->json([
      'message' => 'User deleted successfully.'
    ]);
  }
}
