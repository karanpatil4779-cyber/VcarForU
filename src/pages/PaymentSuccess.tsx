import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Copy, MapPin, Calendar, Car } from 'lucide-react';
import Button from '../components/ui/Button';

const PaymentSuccess: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Use state data if available, otherwise fallback to localStorage
  const booking = state?.booking || JSON.parse(localStorage.getItem('recentBooking') || 'null');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!booking) {
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-slide-up border border-slate-100">
        <div className="bg-emerald-500 p-8 text-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-fade-in relative">
               <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-50" />
               <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Payment Successful!</h1>
            <p className="text-emerald-50 font-medium">Your ride is confirmed and ready.</p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <span className="text-slate-500 font-medium text-sm">Booking ID</span>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-slate-900">{booking.id}</span>
                <button onClick={handleCopy} className="text-slate-400 hover:text-primary-600 transition-colors">
                  {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-start gap-4 pt-2">
               <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600 mt-1">
                 <Car className="h-5 w-5" />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Vehicle</p>
                 <p className="font-heading font-semibold text-slate-900">{booking.vehicle}</p>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600 mt-1">
                 <MapPin className="h-5 w-5" />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pickup City</p>
                 <p className="font-heading font-semibold text-slate-900">{booking.city}</p>
               </div>
            </div>

            <div className="flex items-start gap-4 pb-2">
               <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600 mt-1">
                 <Calendar className="h-5 w-5" />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                 <p className="font-heading font-semibold text-slate-900">{booking.date}</p>
               </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-100/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
               <span className="text-slate-600 font-medium">Total Paid</span>
               <span className="font-heading font-bold text-xl text-slate-900">₹{booking.price.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/dashboard">
               <Button className="w-full shadow-primary-200 h-12 text-base">View on Dashboard</Button>
            </Link>
            <Link to="/">
               <Button variant="outline" className="w-full text-slate-600 border-slate-200 h-12 text-base">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
