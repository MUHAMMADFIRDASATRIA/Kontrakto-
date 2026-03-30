<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

use App\Models\Departments;
use App\Models\Positions;

class PositionsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function showPositions(Request $request)
    {
        $user = Auth::user();
        // $departments = Departments::where('user_id', $user->id)->get();
        $perPage = $request->get('per_page', 10);
        $positions = Positions::with('department')
                    ->whereHas('department', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                    ->paginate($perPage);

        return response()->json([
            'message' => 'Positions retrieved successfully',
            'data' => $positions->items(),
            'meta' => [
                'current_page' => $positions->currentPage(),
                'last_page' => $positions->lastPage(),
                'per_page' => $positions->perPage(),
                'total' => $positions->total(),
            ]
        ], 200);
    }

    public function createPosition(Request $request)
    {
        $user = Auth::user();
        $departments = Departments::where('user_id', $user->id)->get();
        $positions = Positions::whereIn('department_id', $departments->pluck('id'))->get();

        $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'required|integer|exists:departments,id',
        ]);

            $position = Positions::create([
                'title' => $request->input('title'),
                'department_id' => $request->input('department_id'),
            ]);

            return response()->json([
                'message' => 'Position created successfully',
                'position' => $position
            ], 201);
    }

    public function updatePosition(Request $request, $id)
    {
        $user = Auth::user();
        $departments = Departments::where('user_id', $user->id)->get();
        $positions = Positions::whereIn('department_id', $departments->pluck('id'))
                    ->where('id', $id)
                    ->first();

        if (!$positions) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'required|integer|exists:departments,id',
        ]);

        $data = [];

        if ($request->filled('title')) {
            $data['title'] = $request->input('title');
        }
        if ($request->filled('department_id')) {
            $data['department_id'] = $request->input('department_id');
        }

        $position = Positions::findOrFail($id);
        $position->update($data);

        return response()->json([
            'message' => 'Position updated successfully',
            'position' => $position
        ], 200);
    }

    public function deletePosition($id)
    {
        $user = Auth::user();
        $departments = Departments::where('user_id', $user->id)->get();
        $positions = Positions::whereIn('department_id', $departments->pluck('id'))
                    ->where('id', $id)
                    ->first();

        if (!$positions) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        $positions->delete();

        return response()->json([
            'message' => 'Position deleted successfully'
        ], 200);
    }
}
