import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation, Map, StopCircle, IndianRupee, Car, Zap, Siren } from 'lucide-react';
import { findVehicleById } from '../utils/auth';
import Button from '../components/ui/Button';

const JourneyTracker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = id ? findVehicleById(id) : null;
  
  const [isActive, setIsActive] = useState(false);
  const [distance, setDistance] = useState(0); // in km
  const [timer, setTimer] = useState(0); // in seconds
  
  // Simulation: Increase distance when active
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
        // Simulate driving at roughly 60km/h (1km per minute => 0.016 km per second)
        setDistance(d => d + 0.05); 
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-black mb-2">Vehicle Not Found</h2>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalFare = Math.floor(distance * vehicle.pricePerKm);

  const handleStopJourney = () => {
    setIsActive(false);
    alert(`Journey Ended! Total Distance: ${distance.toFixed(1)} km, Final Fare: ₹${totalFare}`);
    navigate('/dashboard');
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <Navigation className="h-8 w-8 text-primary-600 animate-pulse" />
            Live Journey Tracker
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Tracking your trip in real-time</p>
        </div>

        {/* Main Meter Card */}
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
              {/* Distance Meter */}
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

              {/* Fare Meter */}
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

            {/* Controls */}
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
                Navigate via Google Maps
              </a>
            </div>

            {/* Emergency Buttons */}
            <div className="mt-4 flex gap-3">
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
          </div>
        </div>

      </div>
    </div>
  );
};

export default JourneyTracker;
