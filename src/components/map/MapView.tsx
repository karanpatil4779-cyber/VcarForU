import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import type { Vehicle, City } from '../../types/vehicle';
import { Star, MapPin, Navigation, IndianRupee, LocateFixed, Fuel, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { stations } from '../../data/stations';

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

// Custom SVG icons for professional look
const createVehicleIcon = (price: number, isBike: boolean) => {
  const color = isBike ? '#8b5cf6' : '#2563eb';
  const bgColor = isBike ? '#ede9fe' : '#dbeafe';
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        background: ${bgColor};
        border: 2px solid ${color};
        border-radius: 12px;
        padding: 4px 10px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 12px;
        color: ${color};
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <span style="font-size: 10px;">₹</span>${price.toLocaleString('en-IN')}
      </div>
      <div style="
        width: 8px;
        height: 8px;
        background: ${color};
        transform: rotate(45deg);
        margin: -5px auto 0;
        border-radius: 0 0 2px 0;
      "></div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 40],
    popupAnchor: [0, -35],
  });
};

const createCityIcon = (name: string, count: number) => {
  return L.divIcon({
    className: 'custom-city-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #f97316, #ea580c);
        border: 3px solid white;
        border-radius: 16px;
        padding: 6px 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 13px;
        color: white;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
      ">
        <span style="font-size: 10px; opacity: 0.85;">📍</span>
        ${name}
        <span style="
          background: rgba(255,255,255,0.25);
          padding: 1px 6px;
          border-radius: 8px;
          font-size: 10px;
        ">${count}</span>
      </div>
      <div style="
        width: 10px;
        height: 10px;
        background: #ea580c;
        transform: rotate(45deg);
        margin: -6px auto 0;
        border-radius: 0 0 2px 0;
        box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      "></div>
    `,
    iconSize: [120, 46],
    iconAnchor: [60, 46],
    popupAnchor: [0, -40],
  });
};

const createStationIcon = (type: string) => {
  const isElectric = type === 'electric';
  const color = isElectric ? '#10b981' : '#f59e0b';
  const bgColor = isElectric ? '#ecfdf5' : '#fffbeb';
  const emoji = isElectric ? '⚡' : '⛽';
  return L.divIcon({
    className: 'custom-station-marker',
    html: `
      <div style="
        background: ${bgColor};
        border: 2px solid ${color};
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        font-size: 14px;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Component to fly map to new center/zoom
const FlyToHandler: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

interface MapViewProps {
  vehicles: Vehicle[];
  cities?: City[];
  center?: [number, number];
  zoom?: number;
  onCitySelect?: (cityName: string) => void;
}

const isBikeCategory = (category: string) =>
  ['commuter-bike', 'sports-bike', 'touring-bike', 'scooter', 'electric'].includes(category);

const MapView: React.FC<MapViewProps> = ({ 
  vehicles, 
  cities = [],
  center = [20.5937, 78.9629],
  zoom = 5,
  onCitySelect,
}) => {
  const mapRef = React.useRef<L.Map | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      if (mapRef.current) {
        mapRef.current.flyTo([latitude, longitude], 13, { duration: 1.5 });
      }
    });
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
        ref={(ref) => { if (ref) mapRef.current = ref; }}
      >
        {/* Smooth fly-to on city change */}
        <FlyToHandler center={center} zoom={zoom} />

        {/* Premium map tiles — CartoDB Voyager */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Render Cities as hub badges */}
        {cities.map((city) => (
          <Marker 
            key={city.name} 
            position={[city.lat, city.lng]}
            icon={createCityIcon(city.name, city.vehicleCount)}
          >
            <Popup className="custom-popup">
              <div className="w-56 p-1">
                <img src={city.image} alt={city.name} className="w-full h-28 object-cover rounded-xl mb-3" />
                <h3 className="font-heading font-bold text-lg text-slate-900 tracking-tight mb-0.5">{city.name}</h3>
                <p className="font-body text-[13px] text-slate-500 tracking-wide mb-2">{city.state}</p>
                
                {onCitySelect && (
                  <Button 
                    size="sm" 
                    className="w-full mt-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none"
                    onClick={() => onCitySelect(city.name)}
                  >
                    View {city.vehicleCount} Vehicles
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Vehicles as price pills */}
        {vehicles.map((vehicle) => (
          <Marker 
            key={vehicle.id} 
            position={[vehicle.lat, vehicle.lng]}
            icon={createVehicleIcon(vehicle.pricePerKm, isBikeCategory(vehicle.category))}
          >
            <Popup className="custom-popup">
              <div className="w-72 p-1">
                {/* Vehicle header */}
                <div className="h-36 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                  <span className="text-white/5 font-black text-4xl tracking-tighter transform -rotate-6">{vehicle.brand.toUpperCase()}</span>
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                      {vehicle.category.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[11px] font-bold">{vehicle.rating}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-heading font-semibold text-sm tracking-tight text-slate-900 line-clamp-1">{vehicle.name}</h3>
                    <p className="font-body text-[11px] text-slate-500">{vehicle.agency}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-heading font-bold text-primary-600 text-sm">₹{vehicle.pricePerKm}</p>
                    <p className="font-body text-[9px] text-slate-400 tracking-wide">/km</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-body mb-3">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>{vehicle.location}, {vehicle.city}</span>
                </div>

                {/* Specs row */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  <div className="bg-slate-50 rounded-lg p-1.5 text-center border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-medium">{isBikeCategory(vehicle.category) ? 'Type' : 'Trans.'}</p>
                    <p className="text-[11px] font-bold text-slate-700">{vehicle.transmission}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-1.5 text-center border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-medium">Fuel</p>
                    <p className="text-[11px] font-bold text-slate-700">{vehicle.fuel}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-1.5 text-center border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-medium">Mileage</p>
                    <p className="text-[11px] font-bold text-slate-700">{vehicle.mileage}</p>
                  </div>
                </div>

                <Link to={`/vehicle/${vehicle.id}`}>
                  <Button size="sm" className="w-full shadow-primary-200">
                    <Navigation className="mr-1.5 h-3.5 w-3.5" /> View & Book
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Stations */}
        {stations.map((station) => (
          <Marker 
            key={station.id} 
            position={[station.lat, station.lng]}
            icon={createStationIcon(station.type)}
          >
            <Popup className="custom-popup">
              <div className="w-48 p-2 text-center">
                <div className="mb-2">
                   {station.type === 'electric' ? <Zap className="h-6 w-6 mx-auto text-emerald-500" /> : <Fuel className="h-6 w-6 mx-auto text-amber-500" />}
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">{station.name}</h3>
                <p className="font-body text-[11px] text-slate-500">{station.address}</p>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`} target="_blank" rel="noreferrer" className="mt-3 w-full bg-slate-900 text-white py-1.5 rounded-lg text-xs font-bold inline-block">
                  Navigate
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button 
          onClick={handleLocate}
          className="glass p-3 rounded-xl shadow-lg border border-white/50 text-slate-700 hover:text-primary-600 transition-all active:scale-90"
          title="Find my location"
        >
          <LocateFixed className="h-5 w-5" />
        </button>
      </div>

      {/* Vehicle Count Floating Badge */}
      <div className="absolute top-4 left-4 z-[1000] glass px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-2">
        <IndianRupee className="h-4 w-4 text-primary-600" />
        <span className="font-heading font-bold text-sm text-slate-900">{vehicles.length}</span>
        <span className="font-body text-[11px] text-slate-500 tracking-wide">vehicles on map</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] glass p-4 rounded-xl shadow-xl border border-white/50 hidden md:block">
        <h4 className="font-heading font-semibold text-[13px] mb-3 text-slate-900 tracking-tight">Map Legend</h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-[11px] font-body font-medium text-slate-700">
            <div className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md text-[9px] font-bold">City</div>
            <span>Popular Rental Hubs</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-body font-medium text-slate-700">
            <div className="px-2 py-0.5 bg-primary-100 text-primary-700 border border-primary-300 rounded-md text-[9px] font-bold">₹</div>
            <span>Cars (price/km)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-body font-medium text-slate-700">
            <div className="px-2 py-0.5 bg-violet-100 text-violet-700 border border-violet-300 rounded-md text-[9px] font-bold">₹</div>
            <span>Bikes & Scooters</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-body font-medium text-slate-700">
            <div className="w-5 h-5 flex items-center justify-center bg-amber-50 border border-amber-500 rounded-full text-[10px]">⛽</div>
            <span>Fuel / EV Charging</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
