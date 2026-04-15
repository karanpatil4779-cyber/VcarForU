import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookingsByUser, getFeedbackByUser, getBookingsByAgency, cancelBooking } from '../utils/bookings';
import type { BookingRecord } from '../utils/bookings';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [agencyTab, setAgencyTab] = useState<'overview'|'fleet'|'bookings'|'analytics'|'customers'>('overview');
  const [customerTab, setCustomerTab] = useState<'overview'|'active'|'history'|'feedback'|'analytics'>('overview');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'all'|'car'|'bike'>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<BookingRecord[]>([]);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'customer') {
      setUserBookings(getBookingsByUser(user.id));
    }
  }, [user]);

  const handleCancelRide = (id: string) => {
    cancelBooking(id);
    if (user) {
      setUserBookings(getBookingsByUser(user.id));
    }
    setSelectedRideId(null);
    setSuccessMessage('Ride successfully canceled!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-md text-center">
          <h1 className="text-2xl font-bold">Please log in to access your dashboard</h1>
          <p className="text-slate-500 mt-2">Use the role screen to continue.</p>
          <div className="mt-4"><Button onClick={() => navigate('/')}>Back to Home</Button></div>
        </div>
      </div>
    );
  }

  if (user.role === 'agency') {
    const bookings = getBookingsByAgency(user.id);
    const mockAgencyBookings = [
      { id: 'A-101', userId: 'C-1001', userName: 'Aarav Singh', userEmail: 'aarav@example.com', vehicle: 'Hyundai Creta', brand: 'Hyundai', city: 'Mumbai', date: '15 Mar 2026', amount: 3600, paymentMethod: 'UPI', status: 'Confirmed', agencyId: user.id, createdAt: '2026-03-15T08:00:00Z' },
      { id: 'A-102', userId: 'C-1002', userName: 'Jiya Patel', userEmail: 'jiya@example.com', vehicle: 'Maruti Swift', brand: 'Maruti', city: 'Pune', date: '14 Mar 2026', amount: 2600, paymentMethod: 'Card', status: 'Confirmed', agencyId: user.id, createdAt: '2026-03-14T11:00:00Z' },
      { id: 'A-103', userId: 'C-1003', userName: 'Rohit Yadav', userEmail: 'rohit@example.com', vehicle: 'Toyota Innova', brand: 'Toyota', city: 'Nashik', date: '13 Mar 2026', amount: 5600, paymentMethod: 'UPI', status: 'Completed', agencyId: user.id, createdAt: '2026-03-13T10:00:00Z' },
      { id: 'A-104', userId: 'C-1004', userName: 'Sana Khan', userEmail: 'sana@example.com', vehicle: 'Kia Seltos', brand: 'Kia', city: 'Mumbai', date: '12 Mar 2026', amount: 4200, paymentMethod: 'Wallet', status: 'Confirmed', agencyId: user.id, createdAt: '2026-03-12T09:00:00Z' },
      { id: 'A-105', userId: 'C-1005', userName: 'Ishaan Verma', userEmail: 'ishaan@example.com', vehicle: 'Honda City', brand: 'Honda', city: 'Pune', date: '11 Mar 2026', amount: 3100, paymentMethod: 'Card', status: 'Completed', agencyId: user.id, createdAt: '2026-03-11T15:00:00Z' },
      { id: 'A-106', userId: 'C-1006', userName: 'Nikhita Joshi', userEmail: 'nikhita@example.com', vehicle: 'Mahindra XUV', brand: 'Mahindra', city: 'Aurangabad', date: '10 Mar 2026', amount: 5100, paymentMethod: 'Net Banking', status: 'Confirmed', agencyId: user.id, createdAt: '2026-03-10T14:00:00Z' },
      { id: 'A-107', userId: 'C-1007', userName: 'Dev Sharma', userEmail: 'dev@example.com', vehicle: 'Renault Duster', brand: 'Renault', city: 'Mumbai', date: '09 Mar 2026', amount: 3600, paymentMethod: 'Card', status: 'Confirmed', agencyId: user.id, createdAt: '2026-03-09T13:00:00Z' },
      { id: 'A-108', userId: 'C-1008', userName: 'Ananya Rao', userEmail: 'ananya@example.com', vehicle: 'Hyundai i20', brand: 'Hyundai', city: 'Pune', date: '08 Mar 2026', amount: 2300, paymentMethod: 'UPI', status: 'Completed', agencyId: user.id, createdAt: '2026-03-08T12:00:00Z' },
      { id: 'A-109', userId: 'C-1009', userName: 'Vikram Singh', userEmail: 'vikram@example.com', vehicle: 'Maruti Dzire', brand: 'Maruti', city: 'Nashik', date: '07 Mar 2026', amount: 2800, paymentMethod: 'Wallet', status: 'Confirmed', agencyId: user.id, createdAt: '2026-03-07T11:00:00Z' },
      { id: 'A-110', userId: 'C-1010', userName: 'Mira Mehta', userEmail: 'mira@example.com', vehicle: 'Honda Amaze', brand: 'Honda', city: 'Mumbai', date: '06 Mar 2026', amount: 2900, paymentMethod: 'Card', status: 'Completed', agencyId: user.id, createdAt: '2026-03-06T10:00:00Z' },
    ];
    const displayBookings = bookings.length ? bookings : mockAgencyBookings;
    const earnings = displayBookings.reduce((sum, b) => sum + b.amount, 0);
    const active = displayBookings.filter((b) => b.status === 'Confirmed').length;
    // eslint-disable-next-line react-hooks/purity
    const pending = displayBookings.filter((b) => b.status === 'Confirmed' && new Date(b.createdAt) >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)).length;
    const uniqueCustomers = new Set(displayBookings.map((b) => b.userId)).size;
    const maintenance = 18000;
    const rating = 4.8;
    const upcoming = displayBookings.filter((b) => b.status === 'Confirmed').slice(-5).reverse();
    const agencyFleet = [
      { id: 'V-201', model: 'Hyundai Creta', status: 'Available', city: 'Mumbai' },
      { id: 'V-202', model: 'Maruti Swift', status: 'Booked', city: 'Pune' },
      { id: 'V-203', model: 'Toyota Innova', status: 'Available', city: 'Nashik' },
      { id: 'V-204', model: 'Kia Seltos', status: 'Service', city: 'Mumbai' },
    ];
    const agencyCustomers = [
      { id: 'C-1001', name: 'Aarav Singh', rides: 12, city: 'Mumbai' },
      { id: 'C-1002', name: 'Jiya Patel', rides: 8, city: 'Pune' },
      { id: 'C-1003', name: 'Rohit Yadav', rides: 15, city: 'Nashik' },
    ];

    return (
      <div className={`${darkMode ? 'dark min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-100'} p-4 md:p-6 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Agency Dashboard</div>
          <button onClick={() => setDarkMode((prev) => !prev)} className={`${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'} px-3 py-1 rounded-full border border-slate-300`}>{darkMode ? '☀ Light' : '🌙 Dark'}</button>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-4">
          <aside className={`${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'} xl:col-span-3 rounded-3xl border p-4 shadow-sm`}>
            <p className="text-xs uppercase tracking-[0.2em] font-black text-primary-600">Agency Portal</p>
            <h1 className={`mt-2 text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{user.name}</h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Fleet performance, revenue, and customer insights.</p>
            <div className="mt-4 space-y-2">
              {([['Overview','overview'], ['My Fleet','fleet'], ['Reservations','bookings'], ['Analytics','analytics'], ['Customers','customers']] as const).map(([label, tab]) => (
                <button 
                  key={label} 
                  onClick={() => setAgencyTab(tab)} 
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-all duration-200 ${
                    agencyTab === tab 
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                      : `${darkMode ? 'border-slate-800 bg-slate-800/50 text-slate-400 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`
                  } font-semibold text-sm`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className={`mt-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} pt-3 text-xs text-slate-500`}>
              <p className={`font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Quick links</p>
              <button onClick={() => navigate('/agency-dashboard')} className="mt-1 text-primary-600 font-semibold hover:underline">Add Vehicle & Manage Fleet</button>
            </div>
          </aside>

          <main className={`${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'} xl:col-span-9 rounded-3xl border p-4 shadow-sm`}>
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-500">Agency Overview</p>
                <h2 className={`text-3xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Welcome back, {user.name}</h2>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Review your fleet, bookings, and revenue all in one place.</p>
              </div>
              <Button onClick={() => navigate('/agency-dashboard')} variant={darkMode ? 'secondary' : 'primary'}>Manage Fleet</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
              <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
                <p className="text-xs uppercase text-slate-500">Earnings</p>
                <p className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>₹{earnings.toLocaleString('en-IN')}</p>
              </div>
              <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
                <p className="text-xs uppercase text-slate-500">Active Rentals</p>
                <p className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{active}</p>
              </div>
              <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
                <p className="text-xs uppercase text-slate-500">Pending</p>
                <p className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{pending}</p>
              </div>
              <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
                <p className="text-xs uppercase text-slate-500">Rating</p>
                <p className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{rating.toFixed(1)} </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Maintenance + Fuel</p>
                <p className={`font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>₹{maintenance.toLocaleString('en-IN')}</p>
              </div>
              <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Unique Customers</p>
                <p className={`font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{uniqueCustomers}</p>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} mt-4 border rounded-2xl p-3`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Reservation Tracker</h3>
                <span className="text-xs text-slate-500">Latest bookings</span>
              </div>
              {upcoming.length === 0 ? <p className="text-sm text-slate-500">No reservations yet.</p> : upcoming.map((b) => (
                <div key={b.id} className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} py-2 first:pt-0`}>
                  <div className="flex justify-between">
                    <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{b.vehicle}</span>
                    <span className="text-xs text-slate-500">{b.status}</span>
                  </div>
                  <div className="text-xs text-slate-500">{b.userName} • ₹{b.amount.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} mt-4 border rounded-2xl p-3`}>
              <div className="flex justify-between items-center">
                <h3 className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Revenue Analytics</h3>
                <span className="text-xs text-slate-500">Monthly</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-2`}>
                  <p className="text-xs uppercase text-slate-500">Total</p>
                  <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>₹{earnings.toLocaleString('en-IN')}</p>
                </div>
                <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-2`}>
                  <p className="text-xs uppercase text-slate-500">Bookings</p>
                  <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} mt-4 border rounded-2xl p-3`}>
              <div className="flex flex-wrap gap-2 mb-2 text-xs text-slate-500">
                {['overview','fleet','bookings','analytics','customers'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setAgencyTab(tab as typeof agencyTab)} 
                    className={`px-3 py-1 rounded-full border transition-all ${
                      agencyTab === tab 
                        ? 'border-primary-500 bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 dark:border-primary-800' 
                        : `${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {agencyTab === 'overview' && <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Overview: Keep your fleet utilization high and respond to confirmed bookings quickly.</p>}
              {agencyTab === 'fleet' && (
                <div className={`space-y-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {agencyFleet.map((v) => (
                    <div key={v.id} className="flex justify-between">
                      <span>{v.model} ({v.city})</span>
                      <span className={`text-xs px-2 rounded-full ${
                        v.status === 'Booked' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                        v.status === 'Service' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {agencyTab === 'bookings' && (
                <div className={`mt-2 max-h-44 overflow-y-auto text-xs border ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} rounded-lg p-2`}>
                  {displayBookings.slice(0,6).map((b) => (
                    <div key={b.id} className={`flex justify-between py-1 border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <span className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{b.userName} • {b.vehicle}</span>
                      <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>₹{b.amount}</span>
                    </div>
                  ))}
                </div>
              )}
              {agencyTab === 'analytics' && (
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-xl p-2`}>
                    <p className="text-slate-500">Conversion</p>
                    <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>18%</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-xl p-2`}>
                    <p className="text-slate-500">Growth</p>
                    <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>+12%</p>
                  </div>
                </div>
              )}
              {agencyTab === 'customers' && (
                <div className={`mt-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {agencyCustomers.map((c) => (
                    <div key={c.id} className={`flex justify-between border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'} py-1`}>
                      <span>{c.name} ({c.city})</span>
                      <span className="font-semibold">{c.rides} rides</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const feedbacks = getFeedbackByUser(user.id);
  const vehicleOptions = [
    { id: 'c1', name: 'Maruti Swift', type: 'Car', city: 'Mumbai', price: 1200, availability: 'Available' },
    { id: 'c2', name: 'Honda Shine', type: 'Bike', city: 'Mumbai', price: 350, availability: 'Available' },
    { id: 'c3', name: 'Toyota Innova', type: 'Car', city: 'Pune', price: 2200, availability: 'Booked' },
    { id: 'c4', name: 'Royal Enfield', type: 'Bike', city: 'Pune', price: 600, availability: 'Available' },
    { id: 'c5', name: 'Hyundai i20', type: 'Car', city: 'Nashik', price: 1400, availability: 'Available' },
  ];
  const filteredNearby = vehicleTypeFilter === 'all' ? vehicleOptions : vehicleOptions.filter((v) => v.type.toLowerCase() === vehicleTypeFilter);
  const mockCustomerRides = [
    { id: 'C-5001', userId: user.id, userName: user.name, userEmail: user.email, vehicle: 'Hyundai Creta', brand: 'Hyundai', city: 'Mumbai', date: '16 Mar 2026', amount: 3600, paymentMethod: 'UPI', status: 'Confirmed' as const, createdAt: '2026-03-16T08:00:00Z' },
    { id: 'C-5002', userId: user.id, userName: user.name, userEmail: user.email, vehicle: 'Maruti Swift', brand: 'Maruti', city: 'Pune', date: '15 Mar 2026', amount: 2500, paymentMethod: 'Card', status: 'Completed' as const, createdAt: '2026-03-15T08:00:00Z' },
    { id: 'C-5003', userId: user.id, userName: user.name, userEmail: user.email, vehicle: 'Toyota Innova', brand: 'Toyota', city: 'Nashik', date: '14 Mar 2026', amount: 5600, paymentMethod: 'UPI', status: 'Completed' as const, createdAt: '2026-03-14T08:00:00Z' },
    { id: 'C-5004', userId: user.id, userName: user.name, userEmail: user.email, vehicle: 'Kia Seltos', brand: 'Kia', city: 'Mumbai', date: '13 Mar 2026', amount: 4200, paymentMethod: 'Wallet', status: 'Confirmed' as const, createdAt: '2026-03-13T08:00:00Z' },
    { id: 'C-5005', userId: user.id, userName: user.name, userEmail: user.email, vehicle: 'Honda City', brand: 'Honda', city: 'Pune', date: '12 Mar 2026', amount: 3100, paymentMethod: 'Card', status: 'Cancelled' as const, createdAt: '2026-03-12T08:00:00Z' },
  ];
  const displayBookings = userBookings.length ? userBookings : mockCustomerRides;
  const activeRides = displayBookings.filter((b) => b.status === 'Confirmed');
  const totalSpend = displayBookings.reduce((acc, b) => acc + b.amount, 0);
  const canceled = displayBookings.filter((b) => b.status === 'Cancelled').length;
  const cityCounts = displayBookings.reduce<Record<string, number>>((acc, b) => { acc[b.city] = (acc[b.city] || 0) + 1; return acc; }, {});
  const completed = displayBookings.filter((b) => b.status === 'Confirmed').length;
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

  return (
    <div className={`${darkMode ? 'dark min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-100 text-slate-900'} p-4 md:p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-3">
        <h2 className={`text-sm tracking-[0.2em] uppercase ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}>Dashboard</h2>
        <button onClick={() => setDarkMode((prev) => !prev)} className={`${darkMode ? 'bg-slate-800 text-slate-100 border-slate-700' : 'bg-white text-slate-700 border-slate-300'} px-3 py-1 rounded-full border shadow-sm`}>{darkMode ? '☀ Light' : '🌙 Dark'}</button>
      </div>
      
      {successMessage && (
        <div className="max-w-7xl mx-auto mb-4 bg-emerald-100 border border-emerald-500 text-emerald-800 px-4 py-3 rounded-2xl font-semibold">
          ✅ {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-4">
        <aside className={`${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'} xl:col-span-3 rounded-3xl border p-4 shadow-sm`}>
          <p className="text-xs uppercase tracking-[0.2em] font-black text-primary-600">Customer Panel</p>
          <h1 className={`mt-2 text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{user.name}</h1>
          <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Quick actions and ride controls.</p>
          <div className="mt-4 space-y-2">
            {[
              ['Overview', 'overview'],
              ['Active Rides', 'active'],
              ['Ride History', 'history'],
              ['Feedback', 'feedback'],
              ['Analytics', 'analytics']
            ].map(([label, tab]) => (
              <button 
                key={label} 
                onClick={() => setCustomerTab(tab as typeof customerTab)} 
                className={`w-full text-left px-3 py-2 rounded-xl border transition-all duration-200 ${
                  customerTab === tab 
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                    : `${darkMode ? 'border-slate-800 bg-slate-800/50 text-slate-400 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`
                } font-semibold text-sm`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={`mt-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} pt-3 text-xs text-slate-500`}>
            <p className={`font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Monthly progress</p>
            <div className={`h-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full mt-2`}>
              <div className="h-2 w-3/4 bg-primary-600 rounded-full"></div>
            </div>
            <p className="mt-1">75% goal complete</p>
          </div>
        </aside>

        <main className={`${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'} xl:col-span-9 rounded-3xl border p-5 shadow-sm`}>
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-500">Customer Dashboard</p>
              <h2 className={`text-3xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Hello, {user.name}</h2>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Ride history, spending and analytics at a glance.</p>
            </div>
            <Button onClick={() => navigate('/search?step=vehicles')} variant={darkMode ? 'secondary' : 'primary'}>Continue Booking</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
              <p className="text-xs uppercase text-slate-500">Trips</p>
              <p className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{displayBookings.length}</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
              <p className="text-xs uppercase text-slate-500">Spent</p>
              <p className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>₹{totalSpend.toLocaleString('en-IN')}</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
              <p className="text-xs uppercase text-slate-500">Confirmed</p>
              <p className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{completed}</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
              <p className="text-xs uppercase text-slate-500">Cancelled</p>
              <p className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{canceled}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
              <div className="flex justify-between items-center">
                <h3 className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Recent Rides</h3>
                <span className="text-xs text-slate-500">Last 5</span>
              </div>
              {displayBookings.length === 0 ? <p className="text-slate-500 mt-2">No rides yet.</p> : displayBookings.slice(-5).reverse().map((b) => (
                <div key={b.id} className={`mt-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} pt-2`}>
                  <div className="flex justify-between">
                    <p className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{b.vehicle}</p>
                    <p className="text-xs text-slate-500">₹{b.amount}</p>
                  </div>
                  <p className="text-xs text-slate-500">{b.city} • {b.date}</p>
                </div>
              ))}
            </div>
            <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-3`}>
              <h3 className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Ride Insights</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-2`}>
                  <p className="text-xs uppercase text-slate-500">Top City</p>
                  <p className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{topCity}</p>
                </div>
                <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-2`}>
                  <p className="text-xs uppercase text-slate-500">Feedback</p>
                  <p className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{feedbacks.length}</p>
                </div>
              </div>
              <div className={`mt-3 rounded-xl border border-dashed ${darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-white'} p-2`}>
                <p className="text-xs text-slate-500">Tip: Leave feedback in Payment Success to keep your rider score high.</p>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} mt-4 rounded-2xl border p-3`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Nearby Vehicles (Car/Bike)</h3>
              <div className="flex gap-2 text-xs">
                {(['all','car','bike'] as const).map((type) => (
                  <button 
                    key={type} 
                    onClick={() => setVehicleTypeFilter(type)} 
                    className={`rounded-full px-3 py-1 border transition-all ${
                      vehicleTypeFilter === type 
                        ? 'bg-primary-600 text-white border-primary-600' 
                        : `${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`
                    }`}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {filteredNearby.map((v) => (
                <div key={v.id} className={`${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border border-slate-200 text-slate-900'} rounded-xl p-2 transition-all hover:shadow-md`}>
                  <div className="flex justify-between">
                    <span className="font-semibold">{v.name}</span>
                    <span className={`text-[10px] rounded-full px-2 py-0.5 ${
                      v.availability === 'Available' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {v.availability}
                    </span>
                  </div>
                  <p className={`text-[11px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{v.type} • {v.city}</p>
                  <p className="text-xs font-semibold mt-1">₹{v.price}/day</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-3 ${darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-4`}>
            {customerTab === 'overview' && (
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Welcome to your personalized ride panel. Track spending, saved routes, and recent travel trends as you book.
              </p>
            )}
            {customerTab === 'active' && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`font-semibold text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Active Rides</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    activeRides.length > 0 ? 'bg-emerald-100 text-emerald-700' : `${darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`
                  }`}>{activeRides.length} active</span>
                </div>
                {activeRides.length === 0 ? (
                  <div className={`text-center py-8 rounded-xl border border-dashed ${darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                    <p className="text-2xl mb-1">🚗</p>
                    <p className="text-sm font-medium">No active rides at the moment.</p>
                    <p className="text-xs mt-1">Book a vehicle to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeRides.map((r) => (
                      <div key={r.id} className={`rounded-xl border transition-all ${
                        selectedRideId === r.id
                          ? `${darkMode ? 'border-red-700 bg-red-950/30' : 'border-red-300 bg-red-50'}`
                          : `${darkMode ? 'border-slate-700 bg-slate-800/60' : 'border-slate-200 bg-white'}`
                      }`}>
                        <div className="flex justify-between items-center p-3">
                          <div>
                            <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{r.vehicle}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{r.city} • {r.date}</p>
                            <p className={`text-xs font-semibold mt-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>₹{r.amount.toLocaleString('en-IN')} • {r.paymentMethod}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Confirmed</span>
                            <button
                              onClick={() => setSelectedRideId(selectedRideId === r.id ? null : r.id)}
                              className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                                selectedRideId === r.id
                                  ? `${darkMode ? 'border-slate-600 bg-slate-700 text-slate-300' : 'border-slate-300 bg-slate-100 text-slate-600'}`
                                  : `${darkMode ? 'border-red-700 bg-red-900/40 text-red-400 hover:bg-red-900/70' : 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'}`
                              }`}
                            >
                              {selectedRideId === r.id ? 'Keep Ride' : 'Cancel Ride'}
                            </button>
                          </div>
                        </div>
                        {selectedRideId === r.id && (
                          <div className={`border-t px-3 py-3 flex justify-between items-center ${
                            darkMode ? 'border-red-800/50 bg-red-950/20' : 'border-red-200 bg-red-50'
                          }`}>
                            <p className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                              Are you sure you want to cancel this ride?
                            </p>
                            <button
                              onClick={() => handleCancelRide(r.id)}
                              className="ml-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                              Yes, Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {customerTab === 'history' && (
              <div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Ride History</h3>
                {displayBookings.map((r) => (
                  <div key={r.id} className={`mt-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} pt-2`}>
                    <div className="flex justify-between">
                      <p className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{r.vehicle} • ₹{r.amount}</p>
                      <span className={`text-[10px] uppercase font-black px-2 rounded-full ${
                        r.status === 'Completed' ? 'text-emerald-500' : 
                        r.status === 'Cancelled' ? 'text-rose-500' : 'text-primary-500'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{r.city} • {r.date}</p>
                  </div>
                ))}
              </div>
            )}
            {customerTab === 'feedback' && (
              <div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Feedback</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  You have {feedbacks.length} feedback entries. Keep rating drivers for better service recommendations.
                </p>
              </div>
            )}
            {customerTab === 'analytics' && (
              <div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Analytics</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-2`}>
                    <p className="text-slate-500">Average ride</p>
                    <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>₹{(totalSpend / Math.max(1, displayBookings.length)).toFixed(0)}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-2`}>
                    <p className="text-slate-500">Top city</p>
                    <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{topCity}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-right">
            <Button onClick={() => navigate('/search?step=vehicles')} variant="primary">
              Continue Booking
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
