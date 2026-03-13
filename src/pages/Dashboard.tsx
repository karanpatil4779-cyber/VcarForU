import { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  TrendingUp, 
  Plus, 
  MoreVertical,
  Settings,
  LogOut,
  IndianRupee,
  Users,
  X,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Star
} from 'lucide-react';
import Button from '../components/ui/Button';
import { vehicles } from '../data/vehicles';

// Mock Data
const MOCK_BOOKINGS = [
  { id: 'B-001', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.s@email.com', car: 'Mahindra Thar (Diesel)', status: 'Active', price: 11000, start: '2023-11-12', end: '2023-11-15', dl: 'DL-1420110012345', location: 'Airport Drop' },
  { id: 'B-002', name: 'Priya Patel', phone: '+91 91234 56789', email: 'priya.p@email.com', car: 'Maruti Suzuki Swift', status: 'Completed', price: 4500, start: '2023-11-08', end: '2023-11-10', dl: 'MH-0220110098765', location: 'Downtown Pickup' },
  { id: 'B-003', name: 'Amit Singh', phone: '+91 99887 76655', email: 'amit.singh@email.com', car: 'Royal Enfield Classic 350', status: 'Pending', price: 3000, start: '2023-11-20', end: '2023-11-22', dl: 'KA-0520110045678', location: 'Railway Station' },
  { id: 'B-004', name: 'Neha Gupta', phone: '+91 98765 12345', email: 'neha.g@email.com', car: 'Tata Nexon EV', status: 'Active', price: 13500, start: '2023-11-10', end: '2023-11-14', dl: 'UP-3220110034567', location: 'North City Hub' },
  { id: 'B-005', name: 'Vikram Reddy', phone: '+91 97654 32109', email: 'vikram.r@email.com', car: 'Honda City', status: 'Upcoming', price: 8400, start: '2023-11-25', end: '2023-11-28', dl: 'TS-0920110056789', location: 'Airport' }
];

const MOCK_FLEET = vehicles.slice(0, 15).map((v) => ({ ...v, status: Math.random() > 0.3 ? 'Available' : (Math.random() > 0.5 ? 'On Rent' : 'Maintenance') }));

type MockBooking = typeof MOCK_BOOKINGS[0];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedBooking, setSelectedBooking] = useState<MockBooking | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const TABS = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Car, label: 'My Fleet' },
    { icon: Calendar, label: 'Bookings' },
    { icon: TrendingUp, label: 'Analytics' },
    { icon: Users, label: 'Customers' },
    { icon: Settings, label: 'Settings' },
  ];

  const renderOverview = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Delhi NCR Region • 35 Vehicles Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Earnings (Mar)', value: '₹4,45,000', change: '+12.5%', icon: IndianRupee, color: 'bg-emerald-500' },
          { label: 'Active Rentals', value: '28', change: '+5', icon: Car, color: 'bg-blue-500' },
          { label: 'Pending Bookings', value: '12', change: '-2', icon: Calendar, color: 'bg-amber-500' },
          { label: 'Fleet Rating', value: '4.7', change: '+0.2', icon: TrendingUp, color: 'bg-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-sm`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-md ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-black text-xl text-slate-900">Recent Bookings</h2>
          <button onClick={() => setActiveTab('Bookings')} className="text-primary-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Earnings</th>
                <th className="px-6 py-4 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_BOOKINGS.slice(0, 4).map((booking, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => { setActiveTab('Bookings'); setSelectedBooking(booking); }}>
                  <td className="px-6 py-4 font-bold text-xs text-slate-500">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-600">
                        {booking.name.charAt(0)}
                      </div>
                      <span className="font-bold text-sm text-slate-900">{booking.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-slate-700">{booking.car}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${
                      booking.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>{booking.status}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-slate-900">₹{booking.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderFleet = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Fleet</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your active, rented, and maintenance vehicles</p>
        </div>
        <Button className="shadow-primary-200">
          <Plus className="mr-2 h-5 w-5" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_FLEET.map((vehicle, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedVehicle(vehicle)}
            className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:border-primary-500 hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                vehicle.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                vehicle.status === 'On Rent' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                'bg-rose-50 text-rose-600 border-rose-100'
              }`}>{vehicle.status}</span>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900">₹{vehicle.pricePerDay}</span>
                <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/day</span>
              </div>
            </div>
            <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
               <span className="text-slate-700 font-black text-3xl tracking-tighter transform -rotate-12 line-clamp-1 truncate px-2 mix-blend-screen opacity-50">
                 {vehicle.brand.toUpperCase()}
               </span>
               <div className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur px-2 py-1 rounded-md text-[10px] text-white font-bold">{vehicle.category.toUpperCase()}</div>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{vehicle.name}</h3>
            <p className="text-xs text-slate-500 font-medium mb-3">{vehicle.mileage} • {vehicle.transmission} • {vehicle.fuel}</p>
            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="uppercase tracking-widest text-[9px]">ID: {vehicle.id}</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span> {vehicle.rating} ({vehicle.reviews})
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderBookings = () => (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Management</h1>
          <p className="text-slate-500 font-medium mt-1">Track and manage all customer reservations</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4 border-b border-slate-200">ID</th>
                <th className="px-6 py-4 border-b border-slate-200">Customer</th>
                <th className="px-6 py-4 border-b border-slate-200">Vehicle</th>
                <th className="px-6 py-4 border-b border-slate-200">Dates</th>
                <th className="px-6 py-4 border-b border-slate-200">Status</th>
                <th className="px-6 py-4 border-b border-slate-200">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_BOOKINGS.map((booking, i) => (
                <tr 
                  key={i} 
                  onClick={() => setSelectedBooking(booking)}
                  className={`transition-colors cursor-pointer ${selectedBooking?.id === booking.id ? 'bg-primary-50' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-6 py-4 font-bold text-xs text-slate-500">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm text-slate-900">{booking.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{booking.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700">{booking.car}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-700">{booking.start}</div>
                    <div className="text-xs text-slate-400">to {booking.end}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${
                      booking.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      booking.status === 'Upcoming' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>{booking.status}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-slate-900">₹{booking.price.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics & Revenue</h1>
          <p className="text-slate-500 font-medium mt-1">Performance metrics for your fleet</p>
        </div>
        <select className="bg-white border border-slate-200 text-sm font-bold text-slate-700 px-4 py-2 rounded-xl outline-none focus:border-primary-500">
           <option>This Month</option>
           <option>Last Month</option>
           <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart mock */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
           <h3 className="font-black text-lg text-slate-900 mb-6">Revenue Overview</h3>
           <div className="flex items-end gap-2 h-48 border-b border-slate-100 pb-2">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-primary-100 rounded-t-sm relative group hover:bg-primary-500 transition-colors" style={{ height: `${h}%` }}>
                   <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap">
                     ₹{(h * 1200).toLocaleString('en-IN')}
                   </div>
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>

        {/* Top Vehicles */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
           <h3 className="font-black text-lg text-slate-900 mb-6">Top Earnings by Vehicle</h3>
           <div className="space-y-4">
              {[
                { name: 'Mahindra Thar (Diesel)', earn: 145000, pct: 85 },
                { name: 'Tata Nexon EV', earn: 82000, pct: 60 },
                { name: 'Honda City', earn: 64000, pct: 45 },
                { name: 'Hyundai Creta', earn: 54000, pct: 35 },
              ].map((v, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-slate-700">{v.name}</span>
                      <span className="font-black text-slate-900">₹{v.earn.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${v.pct}%` }} />
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Fleet Utilization</p>
            <p className="text-3xl font-black text-primary-600">78%</p>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg. Booking Duration</p>
            <p className="text-3xl font-black text-purple-600">3.4<span className="text-sm"> Days</span></p>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Cancellation Rate</p>
            <p className="text-3xl font-black text-rose-500">4.2%</p>
         </div>
      </div>
    </div>
  );

  const renderCustomers = () => {
    // Group bookings by email to simulate unique customers
    const customersMap: Record<string, any> = MOCK_BOOKINGS.reduce((acc: any, current) => {
      if (!acc[current.email]) {
        acc[current.email] = { ...current, bookings: 0, totalSpend: 0 };
      }
      acc[current.email].bookings += 1;
      acc[current.email].totalSpend += current.price;
      return acc;
    }, {});
    
    const customers = Object.values(customersMap);

    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
            <p className="text-slate-500 font-medium mt-1">Manage relationships with your {customers.length} verified renters</p>
          </div>
        </div>
  
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4 border-b border-slate-200">Customer</th>
                  <th className="px-6 py-4 border-b border-slate-200">Contact</th>
                  <th className="px-6 py-4 border-b border-slate-200">Total Bookings</th>
                  <th className="px-6 py-4 border-b border-slate-200">Total Spent</th>
                  <th className="px-6 py-4 border-b border-slate-200 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-black text-primary-700">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">{c.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.dl}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">{c.phone}</div>
                      <div className="text-xs text-slate-500 font-medium">{c.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700 inline-flex items-center justify-center bg-slate-100 h-6 w-6 rounded-full">{c.bookings}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-sm text-primary-600">
                      ₹{c.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="outline" size="sm">History</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="max-w-4xl mx-auto h-full space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agency Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Configure your profile, payouts, and notifications</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
             <LayoutDashboard className="h-5 w-5 text-primary-500" /> Agency Profile
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Agency Name</label>
              <input type="text" defaultValue="Delhi Ride Rentals" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">GSTIN / Registration</label>
              <input type="text" defaultValue="07AAAAA1234A1Z5" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-semibold text-slate-900 uppercase outline-none focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Public Description</label>
            <textarea rows={3} defaultValue="Premium vehicle rentals in Delhi NCR. Offering fully serviced cars, SUVs, and bikes for self-drive." className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-primary-500 resize-none"></textarea>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
             <IndianRupee className="h-5 w-5 text-emerald-500" /> Payout Configurations
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-emerald-500 bg-emerald-50 rounded-2xl relative cursor-pointer">
               <div className="absolute top-4 right-4 h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_0_4px_white_inset,0_0_0_5px_#10b981]" />
               <p className="font-bold text-slate-900 mb-1">UPI Setup</p>
               <p className="text-xs font-medium text-slate-500">delhirides@okaxis</p>
            </div>
            <div className="p-4 border border-slate-200 hover:border-slate-300 bg-transparent rounded-2xl relative cursor-pointer opacity-50">
               <div className="absolute top-4 right-4 h-4 w-4 rounded-full border border-slate-300" />
               <p className="font-bold text-slate-900 mb-1">Direct Bank Transfer</p>
               <p className="text-xs font-medium text-slate-500">HDFC Bank ending in 1234</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
         <Button variant="outline">Cancel</Button>
         <Button className="shadow-primary-200">Save Changes</Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-lg">
              DRR
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 line-clamp-1">Delhi Ride Rentals</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Agency Partner</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map((item) => (
            <button 
              key={item.label}
              onClick={() => { setActiveTab(item.label); setSelectedBooking(null); setSelectedVehicle(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.label ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${selectedBooking || selectedVehicle ? 'pr-[400px]' : ''}`}>
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'My Fleet' && renderFleet()}
          {activeTab === 'Bookings' && renderBookings()}
          {activeTab === 'Analytics' && renderAnalytics()}
          {activeTab === 'Customers' && renderCustomers()}
          {activeTab === 'Settings' && renderSettings()}
        </div>

        {/* Right Side Panel - Bookings */}
        {selectedBooking && activeTab === 'Bookings' && (
          <div className="absolute right-0 top-0 bottom-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-in-right z-30">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-lg text-slate-900">Booking {selectedBooking.id}</h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status & Price */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
                  <span className={`px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase border inline-block ${
                    selectedBooking.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    selectedBooking.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    selectedBooking.status === 'Upcoming' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>{selectedBooking.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Earnings</p>
                  <p className="text-3xl font-black text-primary-600 tracking-tight">₹{selectedBooking.price.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Vehicle Detail */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center gap-3 mb-4 text-slate-900 font-black">
                  <Car className="h-5 w-5 text-primary-500" />
                  Vehicle Reserved
                </div>
                <div className="font-bold text-lg text-slate-900 mb-1">{selectedBooking.car}</div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <MapPin className="h-4 w-4" /> {selectedBooking.location}
                </div>
              </div>

              {/* Timeframe */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">Rental Period</h4>
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <div className="flex gap-2 items-center"><Calendar className="h-4 w-4 text-slate-400" /> {selectedBooking.start}</div>
                  <div className="text-slate-300">→</div>
                  <div className="flex gap-2 items-center"><Calendar className="h-4 w-4 text-slate-400" /> {selectedBooking.end}</div>
                </div>
              </div>

              {/* Customer Detail */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">Customer Profile</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-black text-xl">
                      {selectedBooking.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900">{selectedBooking.name}</p>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Verified Renter</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <Phone className="h-4 w-4 text-slate-400" /> {selectedBooking.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <Mail className="h-4 w-4 text-slate-400" /> {selectedBooking.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-slate-700">
                      <ShieldCheck className="h-4 w-4 text-slate-400" /> DL: {selectedBooking.dl}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">Message</Button>
              <Button className="w-full shadow-primary-200">View Agreement</Button>
            </div>
          </div>
        )}

        {/* Right Side Panel - Vehicle Info */}
        {selectedVehicle && activeTab === 'My Fleet' && (
          <div className="absolute right-0 top-0 bottom-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-in-right z-30">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-lg text-slate-900">Vehicle {selectedVehicle.id}</h3>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Header Image */}
              <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner">
                 <span className="text-slate-700 font-black text-5xl tracking-tighter transform -rotate-12 line-clamp-1 truncate px-2 mix-blend-screen opacity-50">
                   {selectedVehicle.brand.toUpperCase()}
                 </span>
                 <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] bg-white/90 backdrop-blur font-black uppercase tracking-widest shadow-sm ${
                      selectedVehicle.status === 'Available' ? 'text-emerald-600' :
                      selectedVehicle.status === 'On Rent' ? 'text-blue-600' :
                      'text-rose-600'
                    }`}>{selectedVehicle.status}</span>
                 </div>
              </div>

              {/* Title & Price */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1 block">{selectedVehicle.category}</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedVehicle.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">₹{selectedVehicle.pricePerDay}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rate / Day</p>
                </div>
              </div>

              {/* Specs */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">Vehicle Specifications</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Transmission</p>
                    <p className="text-sm font-black text-slate-900">{selectedVehicle.transmission}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Fuel Type</p>
                    <p className="text-sm font-black text-slate-900">{selectedVehicle.fuel}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Mileage</p>
                    <p className="text-sm font-black text-slate-900">{selectedVehicle.mileage}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Seating</p>
                    <p className="text-sm font-black text-slate-900">{selectedVehicle.seats} Seats</p>
                  </div>
                </div>
              </div>

              {/* Base Location */}
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">Location & Metrics</h4>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <MapPin className="h-4 w-4 text-primary-500" /> {selectedVehicle.location}, {selectedVehicle.city}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                         <IndianRupee className="h-4 w-4 text-slate-400" /> Deposit: ₹{selectedVehicle.deposit}
                       </div>
                       <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                         <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {selectedVehicle.rating} ({selectedVehicle.reviews})
                       </div>
                    </div>
                 </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full text-slate-700 border-slate-300">Edit Details</Button>
              <Button className="w-full shadow-primary-200 bg-rose-500 hover:bg-rose-600 shadow-rose-200">Unlist Vehicle</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
