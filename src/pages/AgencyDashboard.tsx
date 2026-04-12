import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addAgencyVehicle, getAgencyVehicles } from '../utils/auth';
import { getBookingsByAgency, type BookingRecord } from '../utils/bookings';
import type { Vehicle } from '../types/vehicle';
import Button from '../components/ui/Button';

const AgencyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
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
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
  });

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVehicles(getAgencyVehicles(user.id));
    setBookings(getBookingsByAgency(user.id));
  }, [user]);

  if (!user || user.role !== 'agency') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-100">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="mt-2 text-slate-600">This page is only for agency accounts. Please log in as an agency.</p>
          <div className="mt-4"><Button onClick={() => navigate('/agency-login')}>Agency Login</Button></div>
        </div>
      </div>
    );
  }

  const totalEarnings = bookings.reduce((sum, b) => sum + b.amount, 0);
  const activeRentals = bookings.filter((b) => b.status === 'Confirmed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'Confirmed').length;
  const uniqueCustomers = new Set(bookings.map((b) => b.userId)).size;
  const rating = 4.8;
  const maintenance = 23000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    if (!form.name.trim() || !form.brand.trim() || !form.city.trim() || !form.location.trim()) {
      setStatus('Please fill required fields.');
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
      rating: 4.7,
      reviews: 7,
      lat: 19.076,
      lng: 72.8777,
      features: ['Free pickup', 'Flexible returns', '24/7 support'],
    };

    const result = addAgencyVehicle(newVehicle);
    if (!result.success) {
      setStatus(result.message);
      setIsSaving(false);
      return;
    }

    setVehicles((prev) => [newVehicle, ...prev]);
    setStatus('Vehicle added successfully.');
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
      image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
    });
    setIsSaving(false);
  };

  const customers = Array.from(new Map(bookings.map((b) => [b.userId, b])).values());

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-4">
        <aside className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wider text-primary-600 font-bold">Agency Center</p>
          <h1 className="text-2xl font-black mt-2">Hello, {user.name}</h1>
          <p className="text-slate-500">Add vehicles and monitor bookings.</p>
          <div className="mt-4 grid gap-2">
            {['Overview', 'My Fleet', 'Bookings', 'Analytics', 'Customers'].map((item) => (
              <button key={item} className="text-left px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-sm">{item}</button>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Quick Actions</p>
            <button onClick={() => navigate('/search')} className="mt-1 text-primary-600 font-semibold hover:underline">Browse Rentals</button>
          </div>
        </aside>

        <main className="xl:col-span-9 bg-white rounded-3xl border border-slate-200 p-4">
          <div className="flex justify-between items-start gap-3 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary-500">Agency Dashboard</p>
              <h1 className="text-3xl font-black text-slate-900">Manage your fleet</h1>
              <p className="mt-1 text-slate-500">Track revenue, vehicle listings, and bookings.</p>
            </div>
            <Button onClick={() => navigate('/search')}>View Marketplace</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2"><p className="text-xs uppercase text-slate-500">Earnings</p><p className="font-bold text-slate-900">₹{totalEarnings.toLocaleString('en-IN')}</p></div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2"><p className="text-xs uppercase text-slate-500">Active Rentals</p><p className="font-bold text-slate-900">{activeRentals}</p></div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2"><p className="text-xs uppercase text-slate-500">Maintenance</p><p className="font-bold text-slate-900">₹{maintenance.toLocaleString('en-IN')}</p></div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2"><p className="text-xs uppercase text-slate-500">Rating</p><p className="font-bold text-slate-900">{rating.toFixed(1)} </p></div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex justify-between items-center"><h2 className="font-semibold">My Fleet ({vehicles.length})</h2><span className="text-xs text-slate-500">Listed vehicles</span></div>
              {vehicles.length === 0 ? <p className="text-slate-500 mt-2">No vehicles yet. Add one now.</p> : (
                <div className="mt-2 space-y-2 max-h-48 overflow-auto">
                  {vehicles.map((v) => (
                    <div key={v.id} className="border border-slate-200 rounded-xl p-2 bg-white">
                      <div className="flex justify-between text-sm"><span className="font-semibold">{v.name}</span><span className="font-semibold text-primary-600">₹{v.pricePerDay}/day</span></div>
                      <p className="text-xs text-slate-500">{v.brand}  {v.city}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <h2 className="font-semibold">Reservations</h2>
              <div className="mt-2 space-y-2">
                {bookings.length === 0 ? <p className="text-slate-500">No bookings yet.</p> : bookings.slice(-4).reverse().map((b) => (
                  <div key={b.id} className="border border-slate-200 rounded-xl p-2 bg-white text-xs">
                    <div className="flex justify-between"><p className="font-semibold">{b.vehicle}</p><span className="text-primary-600">{b.status}</span></div>
                    <p className="text-slate-500">{b.userName} • ₹{b.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex justify-between items-center"><h2 className="font-semibold">Customer Directory</h2><span className="text-xs text-slate-500">History</span></div>
            {customers.length === 0 ? <p className="text-slate-500 mt-2">No customer bookings yet.</p> : (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {customers.map((c) => (
                  <div key={c.userId} className="bg-white border border-slate-200 rounded-xl p-2 text-xs">
                    <div className="font-semibold">{c.userName}</div>
                    <div className="text-slate-500">{c.userEmail}</div>
                    <div className="text-slate-500">Trips: {bookings.filter((b) => b.userId === c.userId).length}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
            <form onSubmit={handleSubmit} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-semibold">Add New Vehicle</h3>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded-md" />
                <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="p-2 border rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="p-2 border rounded-md" />
                <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="p-2 border rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-2"><input type="number" placeholder="Price/day" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} className="p-2 border rounded-md" /><input type="number" placeholder="Deposit" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} className="p-2 border rounded-md" /></div>
              <div className="grid grid-cols-2 gap-2"><select value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className="p-2 border rounded-md"><option>Petrol</option><option>Diesel</option><option>Electric</option></select><select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="p-2 border rounded-md"><option>Manual</option><option>Automatic</option></select></div>
              <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="p-2 border rounded-md w-full" />
              {status && <p className="text-sm text-red-600">{status}</p>}
              <Button type="submit" disabled={isSaving} className="w-full">{isSaving ? 'Saving...' : 'Add Vehicle'}</Button>
            </form>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <h3 className="font-semibold">Analytics</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white border border-slate-200 rounded-lg p-2"><p className="text-slate-500">Total Fleet</p><p className="font-bold">{vehicles.length}</p></div>
                <div className="bg-white border border-slate-200 rounded-lg p-2"><p className="text-slate-500">Pending</p><p className="font-bold">{pendingBookings}</p></div>
                <div className="bg-white border border-slate-200 rounded-lg p-2"><p className="text-slate-500">Revenue</p><p className="font-bold">₹{totalEarnings.toLocaleString('en-IN')}</p></div>
                <div className="bg-white border border-slate-200 rounded-lg p-2"><p className="text-slate-500">Customers</p><p className="font-bold">{uniqueCustomers}</p></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgencyDashboard;
