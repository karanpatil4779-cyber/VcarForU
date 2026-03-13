import React from 'react';
import { Filter } from 'lucide-react';
import Button from './Button';

export interface FilterState {
  type: string;
  fuel: string;
  transmission: string;
  budget: string;
  city: string;
}

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  cities: string[];
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, cities }) => {
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getBudgetLabel = (val: string) => {
    switch (val) {
      case '0-500': return '₹0 – ₹500';
      case '500-1500': return '₹500 – ₹1500';
      case '1500-3000': return '₹1500 – ₹3000';
      case '3000+': return '₹3000+';
      default: return 'All Budgets';
    }
  };

  const clearFilters = () => {
    setFilters({ type: 'all', fuel: 'all', transmission: 'all', budget: 'all', city: 'all' });
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 p-6 overflow-y-auto hidden lg:block shrink-0">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
          <Filter className="h-5 w-5 text-primary-600" />
          Filters
        </h3>
        <button 
          onClick={clearFilters}
          className="text-xs font-bold text-slate-400 hover:text-primary-600 uppercase tracking-wide transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-8">
        {/* City Filter */}
        <div>
          <label className="text-xs font-black text-slate-900 block mb-4 uppercase tracking-widest">City</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 outline-none"
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
          >
            <option value="all">Everywhere</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Budget Filter */}
        <div>
          <label className="text-xs font-black text-slate-900 block mb-4 uppercase tracking-widest">Daily Budget</label>
          <div className="space-y-2">
            {['all', '0-500', '500-1500', '1500-3000', '3000+'].map((budget) => (
              <label key={budget} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="budget"
                  checked={filters.budget === budget}
                  onChange={() => updateFilter('budget', budget)}
                  className="rounded-full border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 bg-slate-50" 
                />
                <span className={`text-sm font-medium transition-colors ${filters.budget === budget ? 'text-primary-700 font-bold' : 'text-slate-600 group-hover:text-primary-600'}`}>
                  {getBudgetLabel(budget)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Vehicle Type Filter */}
        <div>
          <label className="text-xs font-black text-slate-900 block mb-4 uppercase tracking-widest">Category</label>
          <div className="space-y-2">
            {[
              { id: 'all', label: 'All Vehicles' },
              { id: 'hatchback', label: 'Hatchback (Budget)' },
              { id: 'sedan', label: 'Sedans' },
              { id: 'suv', label: 'SUVs' },
              { id: 'luxury', label: 'Luxury Cars' },
              { id: 'commuter-bike', label: 'Commuter Bikes' },
              { id: 'sports-bike', label: 'Sports Bikes' },
              { id: 'touring-bike', label: 'Touring Bikes' },
              { id: 'scooter', label: 'Scooters' },
              { id: 'electric', label: 'Electric Vehicles' },
            ].map((type) => (
              <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="type"
                  checked={filters.type === type.id}
                  onChange={() => updateFilter('type', type.id)}
                  className="rounded-full border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 bg-slate-50" 
                />
                <span className={`text-sm font-medium transition-colors ${filters.type === type.id ? 'text-primary-700 font-bold' : 'text-slate-600 group-hover:text-primary-600'}`}>
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Fuel Filter */}
        <div>
          <label className="text-xs font-black text-slate-900 block mb-4 uppercase tracking-widest">Fuel Type</label>
          <div className="flex flex-wrap gap-2">
            {['all', 'Petrol', 'Diesel', 'CNG', 'Electric', 'Petrol/CNG'].map((fuel) => (
              <button
                key={fuel}
                onClick={() => updateFilter('fuel', fuel)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  filters.fuel === fuel 
                    ? 'bg-primary-50 border-primary-200 text-primary-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {fuel === 'all' ? 'Any' : fuel}
              </button>
            ))}
          </div>
        </div>

        {/* Transmission Filter */}
        <div>
          <label className="text-xs font-black text-slate-900 block mb-4 uppercase tracking-widest">Transmission</label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateFilter('transmission', filters.transmission === 'Automatic' ? 'all' : 'Automatic')}
              className={`${filters.transmission === 'Automatic' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'text-slate-600'}`}
            >
              Automatic
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateFilter('transmission', filters.transmission === 'Manual' ? 'all' : 'Manual')}
              className={`${filters.transmission === 'Manual' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'text-slate-600'}`}
            >
              Manual
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
