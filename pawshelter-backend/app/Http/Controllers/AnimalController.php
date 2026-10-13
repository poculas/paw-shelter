<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Animal;
use Illuminate\Support\Facades\Storage;

class AnimalController extends Controller
{
    public function index()
    {
        return response()->json(Animal::orderByDesc('id')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'breed' => 'required|string|max:255',
            'weight' => 'required|numeric',
            'age' => 'nullable|numeric',
            'gender' => 'nullable|string|max:50',
            'description' => 'required|string',
            'personality' => 'nullable|string',
            'category' => 'required|string|max:50',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $cloudUrl = config('cloudinary.cloud_url');
            if ($cloudUrl && !str_contains($cloudUrl, 'your_api_secret_here')) {
                try {
                    $uploadedFile = $request->file('image');
                    $uploadResult = cloudinary()->uploadApi()->upload($uploadedFile->getRealPath(), [
                        'folder' => 'paw-shelter',
                    ]);
                    $validated['image'] = $uploadResult['secure_url'];
                } catch (\Throwable $e) {
                    // Log the error for debugging
                    \Log::error('Cloudinary upload failed: ' . $e->getMessage());
                    // Fallback to local storage if Cloudinary upload encounters an issue
                    $stored = $request->file('image')->store('animals', 'public');
                    $validated['image'] = Storage::disk('public')->url($stored);
                }
            } else {
                $stored = $request->file('image')->store('animals', 'public');
                $validated['image'] = Storage::disk('public')->url($stored);
            }
        }

        $animal = Animal::create($validated);

        return response()->json($animal, 201);
    }

    public function show($id)
    {
        return response()->json(Animal::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $animal = Animal::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'breed' => 'sometimes|required|string|max:255',
            'weight' => 'sometimes|required|numeric',
            'age' => 'sometimes|nullable|numeric',
            'gender' => 'sometimes|nullable|string|max:50',
            'description' => 'nullable|string',
            'personality' => 'nullable|string',
            'image' => 'nullable',
            'category' => 'nullable|string|max:50',
        ]);

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $cloudUrl = config('cloudinary.cloud_url');
            if ($cloudUrl && !str_contains($cloudUrl, 'your_api_secret_here')) {
                try {
                    $uploadedFile = $request->file('image');
                    $uploadResult = cloudinary()->uploadApi()->upload($uploadedFile->getRealPath(), [
                        'folder' => 'paw-shelter',
                    ]);
                    $validated['image'] = $uploadResult['secure_url'];
                } catch (\Throwable $e) {
                    \Log::error('Cloudinary upload failed (update): ' . $e->getMessage());
                    $stored = $request->file('image')->store('animals', 'public');
                    $validated['image'] = Storage::disk('public')->url($stored);
                }
            } else {
                $stored = $request->file('image')->store('animals', 'public');
                $validated['image'] = Storage::disk('public')->url($stored);
            }
        } elseif ($request->has('image')) {
            $candidate = $request->string('image')->toString();
            $validated['image'] = ($candidate && !str_ends_with($candidate, '/')) ? $candidate : null;
        }

        $animal->update($validated);

        return response()->json($animal->refresh());
    }

    public function destroy($id)
    {
        $animal = Animal::findOrFail($id);

        if ($animal->image && !str_contains($animal->image, '://')) {
            $publicPath = ltrim(str_replace('/storage/', '', $animal->image), '/');
            Storage::disk('public')->delete($publicPath);
        }

        $animal->delete();

        return response()->json(null, 204);
    }
}
