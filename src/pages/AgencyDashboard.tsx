import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addAgencyVehicle, getAgencyVehicles } from '../utils/auth';
import type { Vehicle } from '../types/vehicle';
import Button from '../components/ui/Button';

const AgencyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: 'sedan',
    type: 'Sedan',
    fuel: 'Petrol',
    transmission: 'Manual',
    seats: '4',
    mileage: '20 kmpl',
    pricePerDay: '1200',
    deposit: '5000',
    city: 'Mumbai',
    location: 'Lower Parel',
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80'
  });

  useEffect(() => {
    if (!user) return;
    const agencyVehicles = getAgencyVehicles(user.id);
    setVehicles(agencyVehicles);
  }, [user]);

  if (!user || user.role !== 'agency') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <h1 className="text-xl font-bold text-slate-900">Access Denied</h1>
          <p className="mt-2 text-slate-600">This area is only for agency users. Please log in as an agency.</p>
          <div className="mt-4">
            <Button onClick={() => navigate('/agency-login')}>Go to Agency Login</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    if (!form.name.trim() || !form.brand.trim() || !form.city.trim() || !form.location.trim()) {
      setStatus('Please fill all required fields.');
      return;
    }

    setIsSaving(true);
    const newVehicle: Vehicle = {
      id: `local-${Date.now()}`,
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category as Vehicle['category'],
      type: form.type,
      fuel: form.fuel as Vehicle['fuel'],
      transmission: form.transmission as Vehicle['transmission'],
      seats: Number(form.seats),
      mileage: form.mileage,
      pricePerDay: Number(form.pricePerDay),
      deposit: Number(form.deposit),
      location: form.location,
      city: form.city,
      image: form.image,
      agency: user.name,
      agencyId: user.id,
      rating: 4.8,
      reviews: 5,
      lat: 19.076, 
      lng: 72.8777,
      features: ['Free pickup', 'Flexible returns', '24/7 support']
    };

    const result = addAgencyVehicle(newVehicle);
    if (!result.success) {
      setStatus(result.message);
      setIsSaving(false);
      return;
    }

    setStatus('Vehicle added successfully.');
    setVehicles((prev) => [newVehicle, ...prev]);
    setIsSaving(false);
    setForm({
      name: '',
      brand: '',
      category: 'sedan',
      type: 'Sedan',
      fuel: 'Petrol',
      transmission: 'Manual',
      seats: '4',
      mileage: '20 kmpl',
      pricePerDay: '1200',
      deposit: '5000',
      city: 'Mumbai',
      location: 'Lower Parel',
      image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-500">Agency Dashboard</p>
              <h1 className="text-3xl font-black text-slate-900 mt-1">Manage Your Vehicles</h1>
              <p className="text-slate-600 mt-1">Add vehicles to your agency fleet and list them for rental.</p>
            </div>
            <Button onClick={() => navigate('/search')} className="w-full md:w-auto">Browse Active Rentals</Button>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-lg">Add New Vehicle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input placeholder="Vehicle Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded-md" required />
                <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="p-2 border rounded-md" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="p-2 border rounded-md" required />
                <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="p-2 border rounded-md" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input type="number" placeholder="Price Per Day" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} className="p-2 border rounded-md" required />
                <input type="number" placeholder="Deposit" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} className="p-2 border rounded-md" required />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="p-2 border rounded-md">
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="luxury">Luxury</option>
                </select>
                <select value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className="p-2 border rounded-md">
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
                <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="p-2 border rounded-md">
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                </select>
                <input type="number" placeholder="Seats" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="p-2 border rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input placeholder="Mileage" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} className="p-2 border rounded-md" />
                <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="p-2 border rounded-md" />
              </div>
              {status && <p className="text-sm text-red-600">{status}</p>}
              <Button type="submit" disabled={isSaving} className="w-full">{isSaving ? 'Saving...' : 'Add Vehicle'}</Button>
            </form>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h2 className="font-bold text-lg mb-3">Your Listed Vehicles ({vehicles.length})</h2>
              <div className="space-y-2">
                {vehicles.length === 0 ? (
                  <p className="text-sm text-slate-500">No vehicles added yet. Add one to start receiving bookings.</p>
                ) : (
                  vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="font-bold text-slate-900">{vehicle.name}</p>
                          <p className="text-xs text-slate-500">{vehicle.brand} - {vehicle.city}</p>
                        </div>
                        <span className="text-sm font-bold text-primary-600">₹{vehicle.pricePerDay}/day</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;
