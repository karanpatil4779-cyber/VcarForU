import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle, City } from '../../types/vehicle';
import { Car, Bike, Star, MapPin } from 'lucide-react';
import Button from '../ui/Button';

// Fix for default marker icons in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Icon for Cities
const cityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  vehicles: Vehicle[];
  cities?: City[];
  center?: [number, number];
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ 
  vehicles, 
  cities = [],
  center = [20.5937, 78.9629], // Default to India center
  zoom = 5 
}) => {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render Cities */}
        {cities.map((city) => (
          <Marker 
            key={city.name} 
            position={[city.lat, city.lng]}
            icon={cityIcon}
          >
            <Popup className="custom-popup">
              <div className="w-48 text-center p-2">
                <img src={city.image} alt={city.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                <h3 className="font-black text-lg text-slate-900">{city.name}</h3>
                <p className="text-primary-600 font-bold text-sm">{city.vehicleCount} Vehicles Available</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Vehicles */}
        {vehicles.map((vehicle) => (
          <Marker 
            key={vehicle.id} 
            position={[vehicle.lat, vehicle.lng]}
          >
            <Popup className="custom-popup">
              <div className="w-64 p-2">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-sm line-clamp-1" title={vehicle.name}>{vehicle.name}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">{vehicle.agency}</p>
                  </div>
                  <span className="bg-primary-50 text-primary-700 text-xs font-black px-2 py-1 border border-primary-100 rounded">
                    ₹{vehicle.pricePerDay}/day
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-3 font-medium">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{vehicle.rating} ({vehicle.reviews})</span>
                  <span className="mx-1">•</span>
                  <MapPin className="h-3 w-3" />
                  <span>{vehicle.city}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-slate-50 rounded p-1 text-[10px] text-slate-600 font-bold">
                    {['electric', 'scooter', 'commuter-bike', 'sports-bike', 'touring-bike'].includes(vehicle.category) ? <Bike className="h-3 w-3" /> : <Car className="h-3 w-3" />}
                    {vehicle.transmission}
                  </div>
                  <div className="bg-slate-50 rounded p-1 text-[10px] text-slate-600 font-bold text-center">
                    {vehicle.fuel}
                  </div>
                </div>
                <Button size="sm" className="w-full shadow-primary-200">Book Now</Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend / Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] glass p-4 rounded-xl shadow-xl border border-white/50 hidden md:block">
        <h4 className="font-bold text-sm mb-3">Map Legend</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
            <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm" />
            <span>Popular Hubs</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm" />
            <span>Available Vehicles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
