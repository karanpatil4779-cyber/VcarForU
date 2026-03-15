import { Link } from 'react-router-dom';
import { Car, User, Building2 } from 'lucide-react';

const RoleSelection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 text-white p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Welcome to VCarForU</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Choose Your Role</h1>
          <p className="mt-2 text-slate-200 max-w-2xl mx-auto text-sm">Sign up or log in before booking. Customers rent vehicles, and agencies list vehicles.</p>
        </div>

        <div className="p-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700"><User className="h-5 w-5" /></span>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">For Travelers</p>
                <h2 className="text-xl font-bold">Customer</h2>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-4">Book cars and bikes quickly from trusted local agencies. Manage trip bookings, payments, and history.</p>
            <div className="flex gap-2 flex-wrap">
              <Link to="/customer-login" className="px-4 py-2 rounded-xl text-sm bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Login</Link>
              <Link to="/customer-signup" className="px-4 py-2 rounded-xl text-sm bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 transition">Sign up</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700"><Building2 className="h-5 w-5" /></span>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">For Fleet Owners</p>
                <h2 className="text-xl font-bold">Agency Partner</h2>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-4">Register your agency, add vehicles, and accept bookings from customers across your city.</p>
            <div className="flex gap-2 flex-wrap">
              <Link to="/agency-login" className="px-4 py-2 rounded-xl text-sm bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">Login</Link>
              <Link to="/agency-signup" className="px-4 py-2 rounded-xl text-sm bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 transition">Sign up</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 text-center">
          <div className="inline-flex items-center gap-2 text-slate-600 text-sm">
            <Car className="h-4 w-4 text-blue-500" />
            <Link to="/home" className="font-semibold text-blue-600 hover:underline">Browse as guest</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
