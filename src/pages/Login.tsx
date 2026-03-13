import { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState<'customer' | 'agency'>('customer');

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 pb-0">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 mb-8 font-medium">Log into your vCarU account</p>
            
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
              <button 
                onClick={() => setRole('customer')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'customer' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => setRole('agency')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'agency' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Agency Partner
              </button>
            </div>
          </div>

          <form className="p-8 pt-0 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 outline-none font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Password</label>
                <button className="text-[10px] font-black text-primary-600 hover:underline tracking-widest uppercase">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 outline-none font-medium transition-all"
                />
              </div>
            </div>

            {role === 'agency' && (
               <div className="space-y-1 animate-fade-in">
                 <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Agency ID Code</label>
                 </div>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="optional for existing sessions" 
                     className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 outline-none font-medium transition-all"
                   />
                 </div>
               </div>
            )}

            <Button className="w-full py-4 rounded-2xl text-lg mt-4 shadow-primary-200 h-14">
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {role === 'customer' && (
            <div className="px-8 pb-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-[10px] font-black tracking-widest uppercase"><span className="bg-white px-4 text-slate-400">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm text-slate-700">
                  <Chrome className="h-5 w-5" />
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm text-slate-700">
                  <Github className="h-5 w-5" />
                  GitHub
                </button>
              </div>
            </div>
          )}

          <div className="px-8 pb-8 mt-4">
             <p className="text-center text-sm text-slate-500 font-medium">
               Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Create one</Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
