import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookingsByUser, getFeedbackByUser, getBookingsByAgency } from '../utils/bookings';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agencyTab, setAgencyTab] = useState<'overview'|'fleet'|'bookings'|'analytics'|'customers'>('overview');
  const [customerTab, setCustomerTab] = useState<'overview'|'history'|'feedback'|'analytics'>('overview');

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
      <div className="min-h-screen bg-slate-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-4">
          <aside className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-[0.2em] font-black text-primary-600">Agency Portal</p>
            <h1 className="mt-2 text-2xl font-black text-slate-900">{user.name}</h1>
            <p className="mt-1 text-slate-500 text-sm">Fleet performance, revenue, and customer insights.</p>
            <div className="mt-4 space-y-2">
              {([['Overview','overview'], ['My Fleet','fleet'], ['Reservations','bookings'], ['Analytics','analytics'], ['Customers','customers']] as const).map(([label, tab]) => (
                <button key={label} onClick={() => setAgencyTab(tab)} className={`w-full text-left px-3 py-2 rounded-xl border ${agencyTab === tab ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'} font-semibold text-sm`}>{label}</button>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Quick links</p>
              <button onClick={() => navigate('/agency-dashboard')} className="mt-1 text-primary-600 font-semibold hover:underline">Add Vehicle & Manage Fleet</button>
            </div>
          </aside>

          <main className="xl:col-span-9 bg-white rounded-3xl border border-slate-200 p-4">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-500">Agency Overview</p>
                <h2 className="text-3xl font-black text-slate-900">Welcome back, {user.name}</h2>
                <p className="text-slate-500 mt-1">Review your fleet, bookings, and revenue all in one place.</p>
              </div>
              <Button onClick={() => navigate('/agency-dashboard')}>Manage Fleet</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-xs uppercase text-slate-500">Earnings</p><p className="text-2xl font-black text-slate-900">₹{earnings.toLocaleString('en-IN')}</p></div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-xs uppercase text-slate-500">Active Rentals</p><p className="text-2xl font-black text-slate-900">{active}</p></div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-xs uppercase text-slate-500">Pending</p><p className="text-2xl font-black text-slate-900">{pending}</p></div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-xs uppercase text-slate-500">Rating</p><p className="text-2xl font-black text-slate-900">{rating.toFixed(1)} </p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-sm text-slate-600">Maintenance + Fuel</p><p className="font-black text-slate-900">₹{maintenance.toLocaleString('en-IN')}</p></div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-sm text-slate-600">Unique Customers</p><p className="font-black text-slate-900">{uniqueCustomers}</p></div>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <div className="flex justify-between items-center mb-2"><h3 className="font-semibold">Reservation Tracker</h3><span className="text-xs text-slate-500">Latest bookings</span></div>
              {upcoming.length === 0 ? <p className="text-sm text-slate-500">No reservations yet.</p> : upcoming.map((b) => (
                <div key={b.id} className="border-t border-slate-200 py-2 first:pt-0">
                  <div className="flex justify-between"><span className="font-semibold text-slate-800">{b.vehicle}</span><span className="text-xs text-slate-500">{b.status}</span></div>
                  <div className="text-xs text-slate-500">{b.userName} • ₹{b.amount.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <div className="flex justify-between items-center"><h3 className="font-semibold">Revenue Analytics</h3><span className="text-xs text-slate-500">Monthly</span></div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white rounded-xl border border-slate-200 p-2"><p className="text-xs uppercase text-slate-500">Total</p><p className="font-bold">₹{earnings.toLocaleString('en-IN')}</p></div>
                <div className="bg-white rounded-xl border border-slate-200 p-2"><p className="text-xs uppercase text-slate-500">Bookings</p><p className="font-bold">{bookings.length}</p></div>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <div className="flex flex-wrap gap-2 mb-2 text-xs text-slate-500">
                {['overview','fleet','bookings','analytics','customers'].map((tab) => (
                  <button key={tab} onClick={() => setAgencyTab(tab as typeof agencyTab)} className={`px-3 py-1 rounded-full border ${agencyTab === tab ? 'border-primary-500 bg-primary-100 text-primary-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {agencyTab === 'overview' && <p className="text-sm text-slate-600">Overview: Keep your fleet utilization high and respond to confirmed bookings quickly.</p>}
              {agencyTab === 'fleet' && (
                <div className="space-y-2 text-sm text-slate-600">
                  {agencyFleet.map((v) => <div key={v.id} className="flex justify-between"><span>{v.model} ({v.city})</span><span className={`text-xs px-2 rounded-full ${v.status === 'Booked' ? 'bg-amber-100 text-amber-700' : v.status === 'Service' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{v.status}</span></div>)}
                </div>
              )}
              {agencyTab === 'bookings' && (
                <div className="mt-2 max-h-44 overflow-y-auto text-xs border border-slate-200 rounded-lg p-2 bg-white">
                  {displayBookings.slice(0,6).map((b) => <div key={b.id} className="flex justify-between py-1 border-b border-slate-100"><span>{b.userName} • {b.vehicle}</span><span className="font-semibold">₹{b.amount}</span></div>)}
                </div>
              )}
              {agencyTab === 'analytics' && (
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="border border-slate-200 rounded-xl p-2 bg-white"><p className="text-slate-500">Conversion</p><p className="font-bold text-slate-800">18%</p></div>
                  <div className="border border-slate-200 rounded-xl p-2 bg-white"><p className="text-slate-500">Growth</p><p className="font-bold text-slate-800">+12%</p></div>
                </div>
              )}
              {agencyTab === 'customers' && (
                <div className="mt-2 text-xs text-slate-600">
                  {agencyCustomers.map((c) => <div key={c.id} className="flex justify-between border-b border-slate-100 py-1"><span>{c.name} ({c.city})</span><span>{c.rides} rides</span></div>)}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const bookings = getBookingsByUser(user.id);
  const feedbacks = getFeedbackByUser(user.id);
  const mockCustomerRides = [
    { id: 'C-5001', vehicle: 'Hyundai Creta', city: 'Mumbai', date: '16 Mar 2026', amount: 3600, status: 'Confirmed' },
    { id: 'C-5002', vehicle: 'Maruti Swift', city: 'Pune', date: '15 Mar 2026', amount: 2500, status: 'Completed' },
    { id: 'C-5003', vehicle: 'Toyota Innova', city: 'Nashik', date: '14 Mar 2026', amount: 5600, status: 'Completed' },
    { id: 'C-5004', vehicle: 'Kia Seltos', city: 'Mumbai', date: '13 Mar 2026', amount: 4200, status: 'Confirmed' },
    { id: 'C-5005', vehicle: 'Honda City', city: 'Pune', date: '12 Mar 2026', amount: 3100, status: 'Cancelled' },
  ];
  const displayBookings = bookings.length ? bookings : mockCustomerRides;
  const totalSpend = displayBookings.reduce((acc, b) => acc + b.amount, 0);
  const canceled = displayBookings.filter((b) => b.status === 'Cancelled').length;
  const cityCounts = displayBookings.reduce<Record<string, number>>((acc, b) => { acc[b.city] = (acc[b.city] || 0) + 1; return acc; }, {});
  const completed = displayBookings.filter((b) => b.status === 'Confirmed').length;
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-4">
        <aside className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-[0.2em] font-black text-primary-600">Customer Panel</p>
          <h1 className="mt-2 text-2xl font-black text-slate-900">{user.name}</h1>
          <p className="mt-1 text-slate-500 text-sm">Quick actions and ride controls.</p>
          <div className="mt-4 space-y-2">
            {[['Overview','overview'], ['Ride History','history'], ['Feedback','feedback'], ['Analytics','analytics']].map(([label, tab]) => (
              <button key={label} onClick={() => setCustomerTab(tab as typeof customerTab)} className={`w-full text-left px-3 py-2 rounded-xl border ${customerTab === tab ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'} font-semibold text-sm`}>{label}</button>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Monthly progress</p>
            <div className="h-2 bg-slate-200 rounded-full mt-2"><div className="h-2 w-3/4 bg-primary-600 rounded-full"></div></div>
            <p className="mt-1">75% goal complete</p>
          </div>
        </aside>

        <main className="xl:col-span-9 bg-white rounded-3xl border border-slate-200 p-5">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-500">Customer Dashboard</p>
              <h2 className="text-3xl font-black text-slate-900">Hello, {user.name}</h2>
              <p className="text-slate-500 mt-1">Ride history, spending and analytics at a glance.</p>
            </div>
            <Button onClick={() => navigate('/search')}>Browse as Guest</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-xs uppercase text-slate-500">Trips</p><p className="text-2xl font-black">{bookings.length}</p></div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-xs uppercase text-slate-500">Spent</p><p className="text-2xl font-black">₹{totalSpend.toLocaleString('en-IN')}</p></div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-xs uppercase text-slate-500">Confirmed</p><p className="text-2xl font-black">{completed}</p></div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3"><p className="text-xs uppercase text-slate-500">Cancelled</p><p className="text-2xl font-black">{canceled}</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <div className="flex justify-between items-center"><h3 className="font-semibold">Recent Rides</h3><span className="text-xs text-slate-500">Last 5</span></div>
              {displayBookings.length === 0 ? <p className="text-slate-500 mt-2">No rides yet.</p> : displayBookings.slice(-5).reverse().map((b) => (
                <div key={b.id} className="mt-2 border-t border-slate-200 pt-2">
                  <div className="flex justify-between"><p className="font-semibold">{b.vehicle}</p><p className="text-xs text-slate-500">₹{b.amount}</p></div>
                  <p className="text-xs text-slate-500">{b.city} • {b.date}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <h3 className="font-semibold">Ride Insights</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white border border-slate-200 rounded-xl p-2"><p className="text-xs uppercase text-slate-500">Top City</p><p className="font-semibold">{topCity}</p></div>
                <div className="bg-white border border-slate-200 rounded-xl p-2"><p className="text-xs uppercase text-slate-500">Feedback</p><p className="font-semibold">{feedbacks.length}</p></div>
              </div>
              <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-2 bg-white"><p className="text-xs text-slate-500">Tip: Leave feedback in Payment Success to keep your rider score high.</p></div>
            </div>
          </div>

          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
            {customerTab === 'overview' && <p className="text-sm text-slate-600">Welcome to your personalized ride panel. Track spending, saved routes, and recent travel trends as you book.</p>}
            {customerTab === 'history' && (
              <div>
                <h3 className="font-semibold text-slate-800">Ride history</h3>
                {displayBookings.map((r) => <div key={r.id} className="mt-2 border-t border-slate-200 pt-2"><p className="font-semibold">{r.vehicle} • ₹{r.amount}</p><p className="text-xs text-slate-500">{r.city} • {r.date} • {r.status}</p></div>)}
              </div>
            )}
            {customerTab === 'feedback' && <p className="text-sm text-slate-600">You have {feedbacks.length} feedback entries. Keep rating drivers for better service recommendations.</p>}
            {customerTab === 'analytics' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="border border-slate-200 rounded-xl p-2 bg-white"><p className="text-slate-500">Average ride</p><p className="font-bold">₹{(totalSpend / Math.max(1, displayBookings.length)).toFixed(0)}</p></div>
                <div className="border border-slate-200 rounded-xl p-2 bg-white"><p className="text-slate-500">Top city</p><p className="font-bold">{topCity}</p></div>
              </div>
            )}
          </div>

          <div className="mt-3 text-right"><Button onClick={() => navigate('/search')}>Continue Booking</Button></div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
