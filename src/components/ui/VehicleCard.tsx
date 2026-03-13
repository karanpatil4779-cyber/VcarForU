import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Fuel, Settings2, Gauge } from 'lucide-react';
import type { Vehicle } from '../../types/vehicle';
import Button from './Button';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Image & Badges */}
      <div className="relative h-56 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 group-hover:scale-110 transition-transform duration-700 flex items-center justify-center">
          <span className="text-white/10 font-black text-4xl tracking-tighter transform -rotate-12 line-clamp-1 truncate px-4">
            {vehicle.brand}
          </span>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-wider">
            {vehicle.category.replace('-', ' ')}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold">{vehicle.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header: Name, Agency, Price */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 line-clamp-1" title={vehicle.name}>{vehicle.name}</h3>
            <p className="text-sm text-slate-500 font-medium">{vehicle.agency}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-xl font-black text-primary-600">₹{vehicle.pricePerDay}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ day</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-4">
          <MapPin className="h-3 w-3 text-slate-400" />
          {vehicle.location}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 text-slate-600 border border-slate-100">
            <Gauge className="h-4 w-4 text-primary-500" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Mileage</p>
              <p className="text-xs font-bold leading-none">{vehicle.mileage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 text-slate-600 border border-slate-100">
            <Settings2 className="h-4 w-4 text-primary-500" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Trans.</p>
              <p className="text-xs font-bold leading-none">{vehicle.transmission}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 text-slate-600 border border-slate-100">
            <Fuel className="h-4 w-4 text-primary-500" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Fuel</p>
              <p className="text-xs font-bold leading-none">{vehicle.fuel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 text-slate-600 border border-slate-100">
            <Users className="h-4 w-4 text-primary-500" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Seats</p>
              <p className="text-xs font-bold leading-none">{vehicle.seats} Seats</p>
            </div>
          </div>
        </div>

        {/* Features Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {vehicle.features.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-1 rounded-md border border-primary-100">
              {feature}
            </span>
          ))}
          {vehicle.features.length > 3 && (
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
              +{vehicle.features.length - 3} more
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium space-y-0.5">
            <p>Deposit: <span className="font-bold text-slate-900">₹{vehicle.deposit}</span></p>
            {vehicle.pricePerHour && (
              <p>Hourly: <span className="font-bold text-slate-900">₹{vehicle.pricePerHour}/hr</span></p>
            )}
          </div>
          <Link to={`/vehicle/${vehicle.id}`}>
            <Button size="sm" className="shadow-primary-200">Book Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
