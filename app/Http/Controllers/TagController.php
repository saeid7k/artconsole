<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    //
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    //
  }

  /**
   * Display the specified resource.
   */
  public function show(Tag $tag)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Tag $tag)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Tag $tag)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Tag $tag)
  {
    //
  }

  public function getGroupedTags()
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();
    $tags = $gallery->tags->groupBy('type')->map(function ($group) {
      return $group->map(function ($tag) {
        return $tag->value;
      })->values();
    });

    return response()->json($tags);
  }
}
