import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Star, Settings2, Fuel, Users, Gauge, ArrowLeft, Building2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { findVehicleById } from '../utils/auth';

const VehicleDetails = () => {
  const { id } = useParams();
  const vehicle = id ? findVehicleById(id) : null;

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-2">Vehicle Not Found</h2>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] pb-24">
      {/* Header Image */}
      <div className="w-full h-[40vh] relative bg-slate-900 border-b border-white/10">
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 opacity-80 flex items-center justify-center overflow-hidden">
          <span className="text-white/5 font-black text-9xl tracking-tighter transform -rotate-6 whitespace-nowrap">
            {vehicle.brand.toUpperCase()}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <Link to="/search" className="absolute top-6 left-6 md:left-12 bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition-all border border-white/20">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block py-1 px-3 rounded-md bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-black tracking-widest uppercase mb-3">
                    {vehicle.category.replace('-', ' ')}
                  </span>
                  <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{vehicle.name}</h1>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500 mt-6">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-slate-900">{vehicle.rating}</span>
                  <span className="text-slate-400">({vehicle.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  <span className="text-slate-900">{vehicle.location}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Building2 className="h-4 w-4 text-primary-500" />
                  <span className="text-slate-900">{vehicle.agency}</span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-black mb-6 tracking-tight">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <Gauge className="h-6 w-6 text-primary-500 mb-2" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mileage</p>
                  <p className="font-black text-slate-900">{vehicle.mileage}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <Settings2 className="h-6 w-6 text-primary-500 mb-2" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transmission</p>
                  <p className="font-black text-slate-900">{vehicle.transmission}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <Fuel className="h-6 w-6 text-primary-500 mb-2" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fuel Type</p>
                  <p className="font-black text-slate-900">{vehicle.fuel}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <Users className="h-6 w-6 text-primary-500 mb-2" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Seats</p>
                  <p className="font-black text-slate-900">{vehicle.seats}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-black mb-6 tracking-tight">Key Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {vehicle.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                    <span className="font-semibold text-slate-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Indian Legal conditions */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-sm border border-slate-800">
              <h2 className="text-xl font-black mb-6 text-primary-400 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6" /> Rental Conditions
              </h2>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-primary-400 font-bold mt-0.5">•</span>
                  Valid original Driving License required at pickup. Digilocker copies accepted.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400 font-bold mt-0.5">•</span>
                  Minimum age to rent is 21 years old.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400 font-bold mt-0.5">•</span>
                  Fuel policy is Same-to-Same. You must return the vehicle with the same fuel level as received.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400 font-bold mt-0.5">•</span>
                  Late returns will be charged at ₹300/hour plus standard usage fees.
                </li>
              </ul>
            </div>
          </div>

          {/* Booking / Checkout Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 sticky top-24">
              <div className="pb-6 border-b border-slate-100 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</p>
                  <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-slate-900">₹{vehicle.pricePerKm}</span>
                  <span className="font-body text-sm text-slate-500">/km</span>
                  </div>
                </div>
              </div>

              <div className="py-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Pickup & Drop Date</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-primary-500" />
                    <input type="date" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Driving License Number</label>
                  <input type="text" placeholder="DL-1420110012345" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-semibold uppercase text-slate-900 outline-none focus:border-primary-500" />
                </div>
              </div>

              <div className="py-6 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Estimated Per Km</span>
                  <span className="font-bold text-slate-900">₹{vehicle.pricePerKm}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Refundable Deposit</span>
                  <span className="font-bold text-slate-900">₹{vehicle.deposit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Taxes & Fees (18% GST)</span>
                  <span className="font-bold text-slate-900">₹{Math.floor(vehicle.pricePerKm * 0.18)}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-heading text-lg font-bold text-slate-900">Total Due Today</span>
                  <span className="font-heading text-2xl font-bold text-primary-600">
                    ₹{vehicle.pricePerKm + vehicle.deposit + Math.floor(vehicle.pricePerKm * 0.18)}
                  </span>
                </div>
                <p className="text-[10px] text-right text-emerald-600 font-bold uppercase tracking-wider">Fully Refundable Deposit Included</p>
              </div>

              <Link to={`/journey/${vehicle.id}`}>
                <Button size="lg" className="w-full rounded-2xl shadow-primary-200 h-14 text-lg">
                  Start Journey Meter
                </Button>
              </Link>
              <div className="mt-4 flex justify-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">WE ACCEPT:</span>
                <span className="text-xs font-bold text-slate-600">UPI</span>
                <span className="text-xs font-bold text-slate-600">Cards</span>
                <span className="text-xs font-bold text-slate-600">Net Banking</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
