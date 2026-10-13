<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdoptionRequest;
use App\Models\Animal;

class AdoptionRequestController extends Controller
{
    /**
     * Display a listing of all adoption requests with pet details.
     */
    public function index()
    {
        return response()->json(
            AdoptionRequest::with('animal')->orderByDesc('id')->get()
        );
    }

    /**
     * Store a newly created adoption request from the website form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'applicant_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string',
            'housing_type' => 'required|string|max:100',
            'pet_experience' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['status'] = 'Pending';

        $adoptionRequest = AdoptionRequest::create($validated);

        return response()->json($adoptionRequest->load('animal'), 201);
    }

    /**
     * Display the specified adoption request.
     */
    public function show($id)
    {
        $request = AdoptionRequest::with('animal')->findOrFail($id);
        return response()->json($request);
    }

    /**
     * Update the status or details of the adoption request.
     */
    public function update(Request $request, $id)
    {
        $adoptionRequest = AdoptionRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|required|string|in:Pending,Approved,Rejected',
            'notes' => 'nullable|string',
        ]);

        $adoptionRequest->update($validated);

        return response()->json($adoptionRequest->load('animal'));
    }

    /**
     * Remove the specified adoption request.
     */
    public function destroy($id)
    {
        $adoptionRequest = AdoptionRequest::findOrFail($id);
        $adoptionRequest->delete();

        return response()->json(null, 204);
    }
}
