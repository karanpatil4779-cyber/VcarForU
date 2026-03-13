import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Zap, Bike, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import VehicleCard from '../components/ui/VehicleCard';
import { vehicles } from '../data/vehicles';
import { cities } from '../data/cities';
import { agencies } from '../data/agencies';
import type { Vehicle } from '../types/vehicle';

const Home = () => {
  // Get 3 random popular vehicles for Featured section
  const featuredVehicles = vehicles.filter((v: Vehicle) => v.rating >= 4.7).slice(0, 3);
  const featuredAgencies = agencies.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1519003300449-424ad0405076?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero Background - Indian Highway"
        />
        
        <div className="relative z-20 text-center max-w-4xl px-4 animate-fade-in mt-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 border border-primary-400/30 text-primary-200 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            India's Premium Rental Marketplace
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-xl tracking-tight">
            Rent Cars & Bikes from <span className="text-primary-400">Trusted Agencies</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-slate-100 max-w-2xl mx-auto font-medium shadow-sm">
            From quick city scoots to Himalayan road trips. Find the perfect ride at the best price.
          </p>
          
          <div className="glass p-4 rounded-3xl flex flex-col md:flex-row gap-4 max-w-4xl mx-auto shadow-2xl">
            <div className="flex-1 text-slate-900 text-left bg-white/50 rounded-2xl p-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-3">City</label>
              <select className="w-full bg-transparent p-2 outline-none text-lg font-bold text-slate-900 cursor-pointer appearance-none">
                <option value="">Where are you going?</option>
                {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex-1 text-slate-900 text-left bg-white/50 rounded-2xl p-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-3">Pickup Date</label>
              <input 
                type="date" 
                className="w-full bg-transparent p-2 outline-none text-lg font-bold text-slate-900 cursor-pointer"
              />
            </div>
            <Link to="/search" className="md:w-48">
              <Button size="lg" className="w-full h-full rounded-2xl shadow-primary-200 text-lg">
                <Search className="mr-2 h-5 w-5" />
                Find Rides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black mb-3 tracking-tight">Top Rated Vehicles</h2>
            <p className="text-slate-500 text-lg font-medium">The most loved rides across India this week</p>
          </div>
          <Link to="/search" className="text-primary-600 font-bold hover:underline flex items-center transition-all hover:translate-x-1">
            Browse all 100+ rides <Search className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredVehicles.map((vehicle: Vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-24 bg-white w-full border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-3 tracking-tight">Popular Hubs</h2>
            <p className="text-slate-500 text-lg font-medium">Rent a vehicle in top Indian cities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cities.map(city => (
              <Link to={`/search?city=${city.name}`} key={city.name} className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-black text-white mb-1">{city.name}</h3>
                  <p className="text-primary-300 font-bold text-sm bg-slate-900/50 inline-block px-3 py-1 rounded-lg backdrop-blur">{city.vehicleCount}+ Vehicles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Agencies */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-3 tracking-tight">Trusted Partner Agencies</h2>
          <p className="text-slate-500 text-lg font-medium">We aggregate inventory from the best local rental companies</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAgencies.map(agency => (
            <div key={agency.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-primary-500 hover:shadow-xl transition-all text-center">
              <img src={agency.image} alt={agency.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-slate-50 shadow-sm" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">{agency.name}</h3>
              <p className="text-slate-500 text-sm font-medium mb-3">{agency.city}</p>
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {agency.rating}
                </div>
                <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md">
                  {agency.fleetSize} Vehicles
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold tracking-widest uppercase mb-6">
            The vCarU Advantage
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-20 tracking-tight">Why Book With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-3xl bg-slate-800 border border-slate-700 hover:border-primary-500 transition-all group">
              <div className="w-20 h-20 bg-primary-600/20 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Zap className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black mb-4">Zero Deposit Option</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Book selected vehicles with zero security deposit via Adhaar card linking and CIBIL score checks.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-800 border border-slate-700 hover:border-primary-500 transition-all group">
              <div className="w-20 h-20 bg-primary-600/20 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Bike className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black mb-4">Largest 2-Wheeler Fleet</h3>
              <p className="text-slate-400 font-medium leading-relaxed">From Activa to Royal Enfield Himalayas. Explore India's top cities on the best two-wheelers.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-800 border border-slate-700 hover:border-primary-500 transition-all group">
              <div className="w-20 h-20 bg-primary-600/20 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black mb-4">Verified Agencies Only</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Every rental agency on our platform is strictly vetted for maintenance quality and fair pricing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
