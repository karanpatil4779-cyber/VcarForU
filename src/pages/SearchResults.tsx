import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, Map as MapIcon, SlidersHorizontal, Search as SearchIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import MapView from '../components/map/MapView';
import Filters from '../components/ui/Filters';
import type { FilterState } from '../components/ui/Filters';
import VehicleCard from '../components/ui/VehicleCard';
import { vehicles } from '../data/vehicles';
import { cities } from '../data/cities';
import { getAllAgencyVehicles } from '../utils/auth';
import type { Vehicle } from '../types/vehicle';

const SearchResults = () => {
  const [view, setView] = useState<'grid' | 'map'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'all';
  
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    fuel: 'all',
    transmission: 'all',
    budget: 'all',
    city: initialCity,
  });

  const cityNames = cities.map(c => c.name);

  const allVehicles = useMemo(() => {
    const localVehicles = getAllAgencyVehicles();
    return [...vehicles, ...localVehicles];
  }, []);

  // Filter Logic
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter((v: Vehicle) => {
      // Search
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      // City
      const matchesCity = filters.city === 'all' || v.city === filters.city;

      // Type
      const matchesType = filters.type === 'all' || v.category === filters.type;

      // Fuel
      const matchesFuel = filters.fuel === 'all' || v.fuel === filters.fuel;

      // Transmission
      const matchesTrans = filters.transmission === 'all' || v.transmission === filters.transmission;

      // Budget
      let matchesBudget = true;
      if (filters.budget !== 'all') {
        const p = v.pricePerDay;
        if (filters.budget === '0-500') matchesBudget = p <= 500;
        else if (filters.budget === '500-1500') matchesBudget = p > 500 && p <= 1500;
        else if (filters.budget === '1500-3000') matchesBudget = p > 1500 && p <= 3000;
        else if (filters.budget === '3000+') matchesBudget = p > 3000;
      }

      return matchesSearch && matchesCity && matchesType && matchesFuel && matchesTrans && matchesBudget;
    });
  }, [searchQuery, filters, allVehicles]);

  // Map Center logic based on city selection
  const mapCenter = useMemo((): [number, number] => {
    if (filters.city !== 'all') {
      const cityData = cities.find(c => c.name === filters.city);
      if (cityData) return [cityData.lat, cityData.lng];
    }
    return [20.5937, 78.9629]; // India center
  }, [filters.city]);

  const mapZoom = filters.city === 'all' ? 5 : 11;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by brand or model (e.g. Swift, Royal Enfield)..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium text-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setView('grid')}
              className={`p-2.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Grid View"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setView('map')}
              className={`p-2.5 rounded-lg transition-all ${view === 'map' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Map View"
            >
              <MapIcon className="h-5 w-5" />
            </button>
          </div>
          <Button 
            variant="outline" 
            className="lg:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Filters */}
        <Filters filters={filters} setFilters={setFilters} cities={cityNames} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative bg-slate-50/50">
          {view === 'grid' ? (
            <div className="p-6">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Available Vehicles</h2>
                  <p className="text-slate-500 font-medium">Showing {filteredVehicles.length} rides matching your criteria</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle: Vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>

              {filteredVehicles.length === 0 && (
                <div className="py-32 text-center max-w-md mx-auto">
                  <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-200">
                    <SearchIcon className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-slate-900">No vehicles found</h3>
                  <p className="text-slate-500 font-medium mb-8">We couldn't find any overrides matching your exact filters. Try tweaking your budget, fuel type, or city.</p>
                  <Button onClick={() => setFilters({ type: 'all', fuel: 'all', transmission: 'all', budget: 'all', city: 'all' })}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full w-full p-4">
              <MapView 
                vehicles={filteredVehicles} 
                cities={filters.city === 'all' ? cities : []} 
                center={mapCenter}
                zoom={mapZoom}
                onCitySelect={(cityName) => setFilters(prev => ({ ...prev, city: cityName }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
