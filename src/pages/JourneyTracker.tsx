import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation, Map, StopCircle, IndianRupee, Car, Zap, Siren, Fuel, MapPin } from 'lucide-react';
import { getBookingById, getLastBookingId } from '../utils/bookings';
import { vehicles } from '../data/vehicles';
import Button from '../components/ui/Button';
import { stations } from '../data/stations';

interface JourneyVehicle {
  id: string;
  name: string;
  brand: string;
  image: string;
  category: string;
  pricePerKm: number;
  lat: number;
  lng: number;
  location: string;
}

const JourneyTracker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showStations, setShowStations] = useState(false);
  
  const [isActive, setIsActive] = useState(false);
  const [distance, setDistance] = useState(0);
  const [timer, setTimer] = useState(0);
  
  const [vehicle, setVehicle] = useState<JourneyVehicle | null>(null);

  useEffect(() => {
    if (id) {
      const booking = getBookingById(id);
      if (booking) {
        const foundVehicle = vehicles.find(v => v.name === booking.vehicle);
        if (foundVehicle) {
          setVehicle(foundVehicle as unknown as JourneyVehicle);
        } else {
          setVehicle({
            id: booking.id,
            name: booking.vehicle,
            brand: booking.brand,
            image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
            category: 'car',
            pricePerKm: 15,
            lat: 19.0760,
            lng: 72.8777,
            location: booking.city
          });
        }
      }
    } else {
      const lastId = getLastBookingId();
      if (lastId) {
        const booking = getBookingById(lastId);
        if (booking) {
          const foundVehicle = vehicles.find(v => v.name === booking.vehicle);
          if (foundVehicle) {
            setVehicle(foundVehicle as unknown as JourneyVehicle);
          } else {
            setVehicle({
              id: booking.id,
              name: booking.vehicle,
              brand: booking.brand,
              image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
              category: 'car',
              pricePerKm: 15,
              lat: 19.0760,
              lng: 72.8777,
              location: booking.city
            });
          }
        }
      }
    }
  }, [id]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
        setDistance(d => d + 0.05);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalFare = vehicle ? Math.floor(distance * vehicle.pricePerKm) : 0;

  const handleStopJourney = () => {
    setIsActive(false);
    alert(`Journey Ended! Total Distance: ${distance.toFixed(1)} km, Final Fare: ₹${totalFare}`);
    navigate('/dashboard');
  };

  const fuelStations = stations.filter(s => s.type === 'fuel').slice(0, 5);
  const electricStations = stations.filter(s => s.type === 'electric').slice(0, 5);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-2">No Active Journey</h2>
          <p className="text-slate-500 mb-4">Book a vehicle first to start your journey</p>
          <Button onClick={() => navigate('/search')}>Browse Vehicles</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <Navigation className="h-8 w-8 text-primary-600 animate-pulse" />
            Live Journey Tracker
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Tracking your trip in real-time</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={vehicle.image} alt={vehicle.name} className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
              <div>
                <h2 className="font-bold text-xl">{vehicle.name}</h2>
                <p className="text-slate-400 text-sm flex items-center gap-1">
                  {vehicle.category === 'electric' ? <Zap className="w-3 h-3 text-emerald-400" /> : <Car className="w-3 h-3 text-primary-400" />}
                  {vehicle.category.toUpperCase()} • ₹{vehicle.pricePerKm}/km
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ACTIVE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-sm font-bold">
                  PAUSED
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Navigation className="w-32 h-32" />
                </div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 z-10">Distance Traveled</span>
                <div className="flex items-baseline gap-2 z-10">
                  <span className="font-black text-6xl text-slate-900 tracking-tighter">{distance.toFixed(2)}</span>
                  <span className="font-bold text-xl text-slate-500">km</span>
                </div>
                <span className="text-sm font-medium text-slate-400 mt-2 z-10">Time: {formatTime(timer)}</span>
              </div>

              <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <IndianRupee className="w-32 h-32" />
                </div>
                <span className="text-sm font-bold text-primary-700 uppercase tracking-widest mb-2 z-10">Current Fare</span>
                <div className="flex items-baseline gap-2 z-10">
                  <span className="font-black text-6xl text-primary-700 tracking-tighter">₹{totalFare}</span>
                </div>
                <span className="text-sm font-medium text-primary-600/70 mt-2 z-10">Base Rate: ₹{vehicle.pricePerKm}/km</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {!isActive ? (
                <Button 
                  onClick={() => setIsActive(true)} 
                  className="flex-1 h-14 text-lg rounded-xl shadow-primary-200"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  {distance === 0 ? 'Start Trip' : 'Resume Trip'}
                </Button>
              ) : (
                <Button 
                  onClick={handleStopJourney} 
                  className="flex-1 h-14 text-lg rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-red-200 border-none"
                >
                  <StopCircle className="w-5 h-5 mr-2" />
                  End Trip & Pay
                </Button>
              )}

              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${vehicle.lat},${vehicle.lng}`}
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center flex-1 h-14 text-lg rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all"
              >
                <Map className="w-5 h-5 mr-2" />
                Navigate
              </a>
            </div>

            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => setShowStations(!showStations)}
                className="flex-1 flex items-center justify-center h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all"
              >
                <Fuel className="w-5 h-5 mr-2" />
                Fuel Stations
              </button>
              <a 
                href="tel:100"
                className="flex-1 flex items-center justify-center h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              >
                <Siren className="w-5 h-5 mr-2" />
                Police (100)
              </a>
              <a 
                href="tel:102"
                className="flex-1 flex items-center justify-center h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
              >
                <Siren className="w-5 h-5 mr-2" />
                Ambulance (102)
              </a>
            </div>

            {showStations && (
              <div className="mt-4 bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <h3 className="font-bold text-lg text-amber-800 mb-3 flex items-center gap-2">
                  <Fuel className="w-5 h-5" /> Nearby Fuel Stations
                </h3>
                <div className="space-y-2">
                  {fuelStations.map(station => (
                    <a 
                      key={station.id}
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 transition-all"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{station.name}</p>
                        <p className="text-xs text-slate-500">{station.address}</p>
                      </div>
                      <MapPin className="w-4 h-4 text-amber-500" />
                    </a>
                  ))}
                </div>
                <h3 className="font-bold text-lg text-emerald-800 mt-4 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" /> EV Charging Stations
                </h3>
                <div className="space-y-2">
                  {electricStations.map(station => (
                    <a 
                      key={station.id}
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 transition-all"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{station.name}</p>
                        <p className="text-xs text-slate-500">{station.address}</p>
                      </div>
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default JourneyTracker;