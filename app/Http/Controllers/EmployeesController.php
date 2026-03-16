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

    public function showEmployees()
    {
        $user = Auth::user();
        $depertments = Departments::where('user_id', $user->id)->get();
        $positions = Positions::whereIn('department_id', $depertments->pluck('id'))->get();
        $employees = Employees::with('position')->whereIn('position_id', $positions->pluck('id'))->get();

        return response()->json([
            'message' => 'Employees retrieved successfully',
            'employees' => $employees
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
            'position_id' => 'required|integer|exists:positions,id',
            'department_id' => 'required|integer|exists:departments,id',
        ]);

        $employee = Employees::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'position_id' => $request->input('position_id'),
            'department_id' => $request->input('department_id'),
        ]);

        $employee->load('position');

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
                    ->whereIn('position_id', $positions->pluck('id'))->get()
                    ->first();

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'position_id' => 'required|integer|exists:positions,id',
        ]);

        $data = [];

        if ($request->filled('name')) {
            $data['name'] = $request->input('name');
        }
        if ($request->filled('email')) {
            $data['email'] = $request->input('email');
        }
        if ($request->filled('phone')) {
            $data['phone'] = $request->input('phone');
        }
        if ($request->filled('address')) {
            $data['address'] = $request->input('address');
        }
        if ($request->filled('position_id')) {
            $data['position_id'] = $request->input('position_id');
        }

        $employee->update($data);
        $employee->load('position');

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