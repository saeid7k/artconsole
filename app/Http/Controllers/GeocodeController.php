<?php

namespace App\Http\Controllers;

use App\Helpers\AddressHelper;
use Illuminate\Http\Request;

class GeocodeController extends Controller
{
  public function getCoordinates(Request $request)
  {
    $address = $request->input('address');
    $result = AddressHelper::addressToGeocode($address);

    if (!$result) {
      return response()->json(['error' => 'Address not found'], 404);
    }

    return response()->json($result);
  }
}
