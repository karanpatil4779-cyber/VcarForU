import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, CreditCard, Building2, Wallet } from 'lucide-react';
import Button from '../components/ui/Button';

const PayMock: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const vehicle = state?.vehicle;

  // Protect route if accessed without vehicle data
  useEffect(() => {
    if (!vehicle) {
      navigate('/search');
    }
  }, [vehicle, navigate]);

  if (!vehicle) return null;

  const handlePayment = () => {
    setLoading(true);

    const bookingData = {
      id: `VCU${Math.floor(Math.random() * 90000) + 10000}`,
      vehicle: vehicle.name,
      price: vehicle.pricePerDay * 3 + vehicle.deposit + 749, // Mock total
      city: vehicle.city || vehicle.location,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    };

    // Save to local storage
    localStorage.setItem('recentBooking', JSON.stringify(bookingData));

    setTimeout(() => {
      navigate('/payment-success', { state: { booking: bookingData } });
    }, 2500);
  };

  const totalAmount = vehicle.pricePerDay * 3 + vehicle.deposit + 749;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Payment Details */}
        <div className="flex-1 space-y-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Vehicle
          </button>
          
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight mb-2">Secure Checkout</h1>
            <p className="text-slate-500 font-body text-sm flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Powered by PayU
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-heading font-semibold text-lg text-slate-900">Select Payment Method</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { id: 'UPI', label: 'UPI / QR Code', icon: <span className="font-black text-xs text-primary-600">UPI</span> },
                { id: 'CARD', label: 'Credit / Debit Card', icon: <CreditCard className="h-5 w-5 text-slate-600" /> },
                { id: 'NETBANKING', label: 'Net Banking', icon: <Building2 className="h-5 w-5 text-slate-600" /> },
                { id: 'WALLET', label: 'Wallets', icon: <Wallet className="h-5 w-5 text-slate-600" /> }
              ].map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedMethod === method.id 
                      ? 'border-primary-500 bg-primary-50/50' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200">
                      {method.icon}
                    </div>
                    <span className="font-heading font-semibold text-slate-900">{method.label}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id ? 'border-primary-500' : 'border-slate-300'
                  }`}>
                    {selectedMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-fade-in" />}
                  </div>
                </div>
              ))}
            </div>

            {selectedMethod === 'UPI' && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 text-center animate-slide-up">
                <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
                  <div className="text-center text-slate-400 font-body text-sm">
                     <p className="mb-2">Mock QR Code</p>
                     <p>(Scan to test)</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-600">Scan with any UPI app to pay</p>
                <div className="flex items-center justify-center gap-2 mt-4 opacity-50">
                  <span className="text-xs font-bold text-slate-500">GPay</span>
                  <span className="text-xs font-bold text-slate-500">PhonePe</span>
                  <span className="text-xs font-bold text-slate-500">Paytm</span>
                </div>
              </div>
            )}
            
            <div className="p-6 border-t border-slate-100">
              <Button 
                onClick={handlePayment} 
                className="w-full text-lg shadow-primary-200 h-14 relative"
                isLoading={loading}
              >
                {!loading && (
                  <>
                    Pay ₹{totalAmount.toLocaleString('en-IN')}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-60 mix-blend-screen">
                      <span className="text-[10px] font-black uppercase tracking-widest">via</span>  
                      <span className="text-sm font-black font-heading tracking-tight">PayU</span>
                    </div>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="md:w-96">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-heading font-semibold text-lg text-slate-900">Order Summary</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-slate-700 font-black text-xl tracking-tighter transform -rotate-12 line-clamp-1 truncate px-2 mix-blend-screen">
                    {vehicle.brand.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-slate-900 tracking-tight">{vehicle.name}</h3>
                  <p className="text-xs text-slate-500 font-body mt-1">3 Days • {vehicle.location}</p>
                </div>
              </div>

              <div className="space-y-3 font-body text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Rental Fare (3 days)</span>
                  <span className="font-medium text-slate-900">₹{(vehicle.pricePerDay * 3).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refundable Deposit</span>
                  <span className="font-medium text-slate-900">₹{vehicle.deposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees (GST 18%)</span>
                  <span className="font-medium text-slate-900">₹749</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-heading font-bold text-slate-900">Total Amount</span>
                <span className="text-2xl font-heading font-bold text-primary-600">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PayMock;
