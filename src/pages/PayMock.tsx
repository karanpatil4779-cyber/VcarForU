import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Smartphone, Building2, Wallet, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import { findVehicleById } from '../utils/auth';
import { useAuth } from '../context/AuthContext';
import { addBooking } from '../utils/bookings';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

const PayMock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = id ? findVehicleById(id) : null;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useAuth();

  if (!user) {
    navigate('/customer-login');
    return null;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Vehicle Not Found</h2>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const rental = vehicle.pricePerDay;
  const deposit = vehicle.deposit;
  const gst = Math.floor(rental * 0.18);
  const total = rental + deposit + gst;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success && user) {
        const bookingId = 'VCU' + Math.floor(100000 + Math.random() * 900000);
        const bookingRecord = {
          id: bookingId,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          vehicle: vehicle.name,
          brand: vehicle.brand,
          city: vehicle.city,
          date: new Date().toLocaleDateString('en-IN'),
          amount: total,
          paymentMethod: selectedMethod,
          status: 'Confirmed' as const,
          createdAt: new Date().toISOString(),
        };
        addBooking(bookingRecord);
        localStorage.setItem('last_booking_id', bookingId);
        navigate('/payment-success');
      } else {
        navigate('/payment-failure');
      }
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* PayU Header */}
        <div className="bg-primary-600 text-white rounded-t-3xl px-8 py-6 flex justify-between items-center">
          <div>
            <p className="font-body text-primary-200 text-[13px] tracking-wide uppercase">Secure Checkout</p>
            <h1 className="font-heading text-2xl font-bold tracking-tight">PayU Payment Gateway</h1>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-2 rounded-xl">
            <Lock className="h-4 w-4" />
            <span className="font-body text-[11px] font-medium tracking-wide">256-bit SSL</span>
          </div>
        </div>

        <div className="bg-white rounded-b-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-b-3xl">
              <svg className="animate-spin h-12 w-12 text-primary-600 mb-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="font-heading text-xl font-bold text-slate-900 mb-1">Processing payment...</p>
              <p className="font-body text-[13px] text-slate-500 tracking-wide">Secured by PayU</p>
            </div>
          )}

          {/* Order Summary */}
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="font-heading text-lg font-semibold text-slate-900 tracking-tight mb-4">Order Summary</h2>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-heading font-semibold text-slate-900 tracking-tight">{vehicle.name}</p>
                  <p className="font-body text-[13px] text-slate-500 tracking-wide">{vehicle.brand} &bull; {vehicle.category.replace('-', ' ')}</p>
                </div>
                <span className="font-body text-[10px] font-medium tracking-wide text-primary-600 bg-primary-50 px-2 py-1 rounded-md border border-primary-100 uppercase">1 Day</span>
              </div>

              <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-body text-slate-500">Vehicle Rental (1 day)</span>
                  <span className="font-body font-semibold text-slate-900">&Rs;{rental.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-slate-500">Refundable Deposit</span>
                  <span className="font-body font-semibold text-slate-900">&Rs;{deposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-slate-500">GST (18%)</span>
                  <span className="font-body font-semibold text-slate-900">&Rs;{gst.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                <span className="font-heading font-bold text-slate-900">Total Payable</span>
                <span className="font-heading text-2xl font-bold text-primary-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="font-heading text-lg font-semibold text-slate-900 tracking-tight mb-4">Payment Method</h2>
            <div className="grid grid-cols-4 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <method.icon className="h-6 w-6" />
                  <span className="font-body text-[11px] font-medium tracking-wide">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Method-specific UI */}
          <div className="px-8 py-6 border-b border-slate-100">
            {selectedMethod === 'upi' && (
              <div className="space-y-4">
                <div>
                  <label className="font-body text-[13px] font-medium text-slate-700 block mb-2">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-body text-sm text-slate-900 outline-none focus:border-primary-500"
                  />
                </div>
                <div className="text-center py-4">
                  <div className="w-32 h-32 mx-auto bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-2">
                    <Smartphone className="h-10 w-10 text-slate-300" />
                  </div>
                  <p className="font-body text-[13px] text-slate-400 tracking-wide">Or scan QR to pay</p>
                </div>
              </div>
            )}
            {selectedMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="font-body text-[13px] font-medium text-slate-700 block mb-2">Card Number</label>
                  <input type="text" placeholder="4111 1111 1111 1111" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-body text-sm text-slate-900 outline-none focus:border-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-[13px] font-medium text-slate-700 block mb-2">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-body text-sm text-slate-900 outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="font-body text-[13px] font-medium text-slate-700 block mb-2">CVV</label>
                    <input type="password" placeholder="•••" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-body text-sm text-slate-900 outline-none focus:border-primary-500" />
                  </div>
                </div>
              </div>
            )}
            {selectedMethod === 'netbanking' && (
              <div>
                <label className="font-body text-[13px] font-medium text-slate-700 block mb-2">Select Bank</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-body text-sm text-slate-900 outline-none focus:border-primary-500">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}
            {selectedMethod === 'wallet' && (
              <div className="grid grid-cols-3 gap-3">
                {['Paytm', 'PhonePe', 'Amazon Pay'].map((w) => (
                  <button key={w} className="p-4 rounded-2xl border border-slate-200 hover:border-primary-500 text-center transition-all">
                    <p className="font-heading font-semibold text-sm text-slate-900">{w}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pay Button */}
          <div className="px-8 py-6">
            <Button
              size="lg"
              className="w-full rounded-2xl shadow-primary-200 h-14 text-lg"
              onClick={handlePayment}
              disabled={isProcessing}
              isLoading={isProcessing}
            >
              Pay ₹{total.toLocaleString('en-IN')}
            </Button>
            <div className="flex items-center justify-center gap-2 mt-4">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="font-body text-[11px] text-slate-400 tracking-wide">100% Secure Payment &bull; Powered by PayU</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayMock;
