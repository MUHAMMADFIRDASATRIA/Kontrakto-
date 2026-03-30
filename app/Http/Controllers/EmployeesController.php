<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

use App\Models\Employees;
use App\Models\Departments;
use App\Models\Positions;


class EmployeesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function showEmployees(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->get('per_page', 10);

        $query = Employees::with('position.department')
                    ->whereHas('position.department', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    });
        
        if ($request->search){
            $search = strtolower($request->search);
            $query->where(function($q) use ($search){
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"]);
            }); 
        }

        if ($request->department_id) {
            $query->whereHas('position', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        if ($request->sort === 'nama-asc') {
            $query->orderBy('name', 'asc');
        } elseif ($request->sort === 'nama-desc') {
            $query->orderBy('name', 'desc');
        } elseif ($request->sort === 'dept') {
            $query->join('positions', 'employees.position_id', '=', 'positions.id')
                  ->join('departments', 'positions.department_id', '=', 'departments.id')
                  ->orderBy('departments.name', 'asc');
        }

        $employees = $query->paginate($perPage);

        return response()->json([
            'message' => 'Employees retrieved successfully',
            'data' => $employees->items(),
            'meta' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
            ]
        ], 200);
    }
    public function createEmployee(Request $request)
    {
        $user = Auth::user();
        $depertments = Departments::where('user_id', $user->id)->get();
        $positions = Positions::whereIn('department_id', $depertments->pluck('id'))->get();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female',
            'location_of_birth' => 'nullable|string|max:255',
            'agama' => 'nullable|string|max:50',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'date_of_birth' => 'nullable|date',
            'education' => 'nullable|string|max:100',
            'position_id' => 'required|integer|exists:positions,id',
            'department_id' => 'required|integer|exists:departments,id',
        ]);

        $employee = Employees::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'gender' => $request->input('gender'),
            'location_of_birth' => $request->input('location_of_birth'),
            'agama' => $request->input('agama'),
            'marital_status' => $request->input('marital_status'),
            'date_of_birth' => $request->input('date_of_birth'),
            'education' => $request->input('education'),
            'position_id' => $request->input('position_id'),
            'department_id' => $request->input('department_id'),
        ]);

        $employee->load('position.department');

        return response()->json([
            'message' => 'Employee created successfully',
            'employee' => $employee
        ], 201);
    }

    public function updateEmployee(Request $request, $id)
    {
        $user = Auth::user();
        $depertments = Departments::where('user_id', $user->id)->get();
        $positions = Positions::whereIn('department_id', $depertments->pluck('id'))->get();
        $employee = Employees::where('id', $id)
                    ->whereIn('position_id', $positions->pluck('id'))
                    ->first();

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female',
            'location_of_birth' => 'nullable|string|max:255',
            'agama' => 'nullable|string|max:50',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'date_of_birth' => 'nullable|date',
            'education' => 'nullable|string|max:100',
            'position_id' => 'required|integer|exists:positions,id',
            'department_id' => 'required|integer|exists:departments,id',
        ]);

        $data = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'gender' => $request->input('gender'),
            'location_of_birth' => $request->input('location_of_birth'),
            'agama' => $request->input('agama'),
            'marital_status' => $request->input('marital_status'),
            'date_of_birth' => $request->input('date_of_birth'),
            'education' => $request->input('education'),
            'position_id' => $request->input('position_id'),
            'department_id' => $request->input('department_id'),
        ];

        $employee->update($data);
        $employee->load('position.department   ');

        return response()->json([
            'message' => 'Employee updated successfully',
            'employee' => $employee
        ], 200);
    }

    public function deleteEmployee($id)
    {
        $user = Auth::user();
        $depertments = Departments::where('user_id', $user->id)->get();
        $positions = Positions::whereIn('department_id', $depertments->pluck('id'))->get();
        $employee = Employees::where('id', $id)
                    ->whereIn('position_id', $positions->pluck('id'))
                    ->first();

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $employee->delete();

        return response()->json([
            'message' => 'Employee deleted successfully'
        ], 200);
    }
}