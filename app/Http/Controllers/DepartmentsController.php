<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

use App\Models\Departments;


class DepartmentsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function showDepartments()
    {
        $user = Auth::user();
        $perPage = request()->get('per_page', 10);

        $departments = Departments::where('user_id', $user->id)->paginate($perPage);

        return response()->json([
            'message' => 'Departments retrieved successfully',
            'data' => $departments->items(),
            'meta' => [
                'current_page' => $departments->currentPage(),
                'last_page' => $departments->lastPage(),
                'per_page' => $departments->perPage(),
                'total' => $departments->total(),
            ]
        ],200);
    }

    public function createDepartment(Request $request)
    {
        $user = Auth::user();
        $departments = Departments::where('user_id', $user->id)->get();

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department = Departments::create([
            'name' => $request->input('name'),
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'Department created successfully', 
            'department' => $department
            ], 201);
    }

    public function updateDepartment(Request $request, $id)
    {
        $user = Auth::user();
        $departments = Departments::where('id', $id)
                    ->where('user_id', $user->id)->get()
                    ->first();

        if (!$departments) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department = Departments::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $data = [];

        if ($request->filled('name')) {
            $data['name'] = $request->input('name');
        } 

        $department->update($data);

        return response()->json([
            'message' => 'Department updated successfully',
            'department' => $department
        ], 200);
    }

    public function deleteDepartment($id)
    {
        $user = Auth::user();
        $departments = Departments::where('user_id', $user->id)->get();

        $department = Departments::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $department->delete();

        return response()->json(['message' => 'Department deleted successfully'], 200);
    }
}
