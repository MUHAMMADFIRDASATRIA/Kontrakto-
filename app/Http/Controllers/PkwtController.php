<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

use App\Models\Pkwt;

class PkwtController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function showPkwt()
    {
        $user = Auth::user();
        $pkwts = Pkwt::with('employee')->where('user_id', $user->id)->get();

        return response()->json([
            'message' => 'PKWT contracts retrieved successfully',
            'pkwts' => $pkwts
        ], 200);
    }

    public function createPkwt(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'employee_id'    => 'required|integer|exists:employees,id',
            'tglMulaiRaw'    => 'required|date',
            'tglBerakhirRaw' => 'required|date|after_or_equal:tglMulaiRaw',
        ]);

        $end  = new \DateTime($request->input('tglBerakhirRaw'));
        $now  = new \DateTime('today');
        $diff = (int) $now->diff($end)->days;
        $sisa = $end >= $now ? $diff : -$diff;

        if ($sisa < 0)       $status = 'expired';
        elseif ($sisa <= 30) $status = 'near-expired';
        else                 $status = 'active';

        $pkwt = Pkwt::create([
            'user_id'         => $user->id,
            'employee_id'     => $request->input('employee_id'),
            'contract_number' => 'PKWT-' . time(),
            'start_date'      => $request->input('tglMulaiRaw'),
            'end_date'        => $request->input('tglBerakhirRaw'),
            'status'          => $status,
        ]);

        return response()->json([
            'message' => 'PKWT contract created successfully',
            'pkwt' => $pkwt
        ], 201);
    }

    public function editPkwt(Request $request, $id)
    {
        $user = Auth::user();
        $pkwt = Pkwt::where('id', $id)
                    ->where('user_id', $user->id)
                    ->first();

        if (!$pkwt) {
            return response()->json(['message' => 'PKWT contract not found'], 404);
        }

        $request->validate([
            'employee_id'    => 'required|integer|exists:employees,id',
            'tglMulaiRaw'    => 'required|date',
            'tglBerakhirRaw' => 'required|date|after_or_equal:tglMulaiRaw',
        ]);

        $end  = new \DateTime($request->input('tglBerakhirRaw'));
        $now  = new \DateTime('today');
        $diff = (int) $now->diff($end)->days;
        $sisa = $end >= $now ? $diff : -$diff;

        if ($sisa < 0)       $status = 'expired';
        elseif ($sisa <= 30) $status = 'near-expired';
        else                 $status = 'active';

        $pkwt->update([
            'employee_id' => $request->input('employee_id'),
            'start_date'  => $request->input('tglMulaiRaw'),
            'end_date'    => $request->input('tglBerakhirRaw'),
            'status'      => $status,
        ]);

        return response()->json([
            'message' => 'PKWT contract updated successfully',
            'pkwt' => $pkwt
        ], 200);
    }

    public function deletePkwt($id)
    {
        $user = Auth::user();
        $pkwt = Pkwt::where('id', $id)
                    ->where('user_id', $user->id)
                    ->first();

        if (!$pkwt) {
            return response()->json(['message' => 'PKWT contract not found'], 404);
        }

        $pkwt->delete();

        return response()->json(['message' => 'PKWT contract deleted successfully'], 200);
    }
}