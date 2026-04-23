import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Vehicle } from '../types/vehicle';
import Button from '../components/ui/Button';
import type { BookingRecord } from '../utils/bookings';
import { MessageSquare, Bell, Trophy, TrendingUp, AlertTriangle, Wrench, BarChart3, Zap, Shield, Phone, Mail, Send, X, LogOut } from 'lucide-react';

const AgencyDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [fleetCount, setFleetCount] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  void fleetCount; void vehicles;
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [chatMessages, setChatMessages] = useState<{from: 'agency'|'customer'; text: string; time: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1);
  const [fraudAlerts, setFraudAlerts] = useState<{id: string; message: string; severity: 'low'|'medium'|'high'}[]>([]);
  const [notifications, setNotifications] = useState<{id: string; text: string; type: 'sms'|'email'; time: string; read: boolean}[]>([]);
  const [form, setForm] = useState({
    name: '', brand: '', category: 'sedan', type: 'Sedan', fuel: 'Petrol', transmission: 'Manual',
    seats: '4', mileage: '20 kmpl', pricePerKm: '20', deposit: '5000', city: 'Mumbai',
    location: 'Lower Parel', image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
  });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const vRes = await fetch(`/api/vehicles?agencyId=${user.id}`);
        if (vRes.ok) {
          const vData = await vRes.json();
          setVehicles(vData);
          setFleetCount(vData.length || 0);
        }
        const bRes = await fetch(`/api/bookings?agencyId=${user.id}`);
        if (bRes.ok) setBookings(await bRes.json());
      } catch (err) { console.error('Fetch error:', err); }
    };
    fetchData();
    
    setFraudAlerts([
      { id: '1', message: 'Suspicious booking from new user in Mumbai area', severity: 'medium' },
      { id: '2', message: 'Multiple failed payment attempts detected', severity: 'low' },
    ]);
    
    setNotifications([
      { id: '1', text: 'New booking: Aarav Singh booked Hyundai Creta', type: 'sms', time: '2 min ago', read: false },
      { id: '2', text: 'Payment received: ₹3,600 from Jiya Patel', type: 'email', time: '15 min ago', read: false },
      { id: '3', text: 'Maintenance reminder: Maruti Swift due for service', type: 'sms', time: '1 hour ago', read: true },
    ]);
    
    setChatMessages([
      { from: 'customer', text: 'Hi, is the Hyundai Creta available for tomorrow?', time: '10:30 AM' },
      { from: 'agency', text: 'Yes, it is available. Would you like to proceed with booking?', time: '10:32 AM' },
    ]);
  }, [user]);

  if (!user || user.role !== 'agency') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-100">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="mt-2 text-slate-600">Agency login required.</p>
          <div className="mt-4"><Button onClick={() => navigate('/agency-login')}>Agency Login</Button></div>
        </div>
      </div>
    );
  }

  const totalEarnings = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const activeRentals = bookings.filter((b) => b.status === 'Confirmed').length;
  const uniqueCustomers = new Set(bookings.map((b) => b.userId)).size;
  const rating = 4.8;
  
  const mockLeaderboard = [
    { rank: 1, name: 'Mumbai Car Rentals', earnings: 245000, rating: 4.9 },
    { rank: 2, name: 'Pune Wheels', earnings: 198000, rating: 4.8 },
    { rank: 3, name: user.name, earnings: totalEarnings || 125000, rating },
    { rank: 4, name: 'Nashik Motors', earnings: 89000, rating: 4.5 },
    { rank: 5, name: 'Nagpur Drive', earnings: 67000, rating: 4.3 },
  ].sort((a, b) => b.earnings - a.earnings).map((l, i) => ({ ...l, rank: i + 1 }));

  const competitors = [
    { name: 'Competitor A', price: 22, trend: 'up' },
    { name: 'Competitor B', price: 18, trend: 'down' },
    { name: 'You', price: Number(form.pricePerKm) || 20, trend: 'stable' },
  ];

  const maintenanceSchedule = [
    { vehicle: 'Maruti Swift', due: '2026-04-25', daysLeft: 2, type: 'Oil Change' },
    { vehicle: 'Hyundai Creta', due: '2026-05-10', daysLeft: 17, type: 'Tire Rotation' },
    { vehicle: 'Toyota Innova', due: '2026-04-28', daysLeft: 5, type: 'Full Service' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    if (!form.name.trim() || !form.brand.trim()) { setStatus('Fill required fields.'); return; }
    setIsSaving(true);
    const newVehicle = {
      id: `v-${Date.now()}`, name: form.name.trim(), brand: form.brand.trim(), category: form.category,
      type: form.type, fuel: form.fuel, transmission: form.transmission, seats: Number(form.seats),
      mileage: form.mileage, pricePerKm: Number(form.pricePerKm), deposit: Number(form.deposit),
      location: form.location, city: form.city, image: form.image, agency: user.name, agencyId: user.id,
      rating: 4.7, reviews: 0,
    };
    try {
      const res = await fetch('/api/vehicles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newVehicle) });
      const data = await res.json();
      if (data.success) { setVehicles((prev) => { setFleetCount(prev.length + 1); return [newVehicle as unknown as Vehicle, ...prev]; }); setStatus('Vehicle added!'); }
      else setStatus(data.error || 'Failed');
    } catch { setStatus('Server error.'); }
    finally { setIsSaving(false); }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: 'agency', text: chatInput, time: new Date().toLocaleTimeString() }]);
    setChatInput('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'chat', label: 'Customer Chat', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'surge', label: 'Surge Pricing', icon: Zap },
    { id: 'competitors', label: 'Competitors', icon: TrendingUp },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'fraud', label: 'Fraud Detection', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Agency Dashboard</h1>
            <p className="text-slate-500">Welcome, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowChat(true)} className="bg-blue-600"><MessageSquare className="w-4 h-4 mr-1" /> Chat</Button>
            <Button onClick={() => setShowNotifications(true)} className="bg-purple-600 relative">
              <Bell className="w-4 h-4 mr-1" /> Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{notifications.filter(n => !n.read).length}</span>
              )}
            </Button>
            <Button onClick={logout} variant="secondary"><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4"><p className="text-xs uppercase text-slate-500">Earnings</p><p className="text-2xl font-black text-slate-900">₹{totalEarnings.toLocaleString('en-IN')}</p></div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"><p className="text-xs uppercase text-emerald-600">Active Rentals</p><p className="text-2xl font-black text-emerald-700">{activeRentals}</p></div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4"><p className="text-xs uppercase text-blue-600">Customers</p><p className="text-2xl font-black text-blue-700">{uniqueCustomers}</p></div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4"><p className="text-xs uppercase text-amber-600">Rating</p><p className="text-2xl font-black text-amber-700">{rating.toFixed(1)}</p></div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">Recent Bookings</h3>
                {bookings.length === 0 ? <p className="text-slate-500 mt-2">No bookings yet.</p> : (
                  <div className="mt-2 space-y-2">
                    {bookings.slice(-5).reverse().map(b => (
                      <div key={b.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div><p className="font-semibold">{b.vehicle}</p><p className="text-xs text-slate-500">{b.userName} • {b.userEmail}</p></div>
                        <div className="text-right"><p className="font-bold text-primary-600">₹{b.amount}</p><span className={`text-[10px] px-2 py-0.5 rounded-full ${b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{b.status}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-4">
                <h3 className="font-bold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button onClick={() => setActiveTab('chat')} className="w-full justify-start"><MessageSquare className="w-4 h-4 mr-2" /> Chat with Customers</Button>
                  <Button onClick={() => setActiveTab('surge')} className="w-full justify-start"><Zap className="w-4 h-4 mr-2" /> Set Surge Pricing</Button>
                  <Button onClick={() => setActiveTab('maintenance')} className="w-full justify-start"><Wrench className="w-4 h-4 mr-2" /> Maintenance Alerts</Button>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-4">
                <h3 className="font-bold mb-3">Add Vehicle</h3>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2"><input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-2 border rounded-lg text-sm" /><input placeholder="Brand" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="p-2 border rounded-lg text-sm" /></div>
                  <div className="grid grid-cols-2 gap-2"><input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="p-2 border rounded-lg text-sm" /><input type="number" placeholder="₹/km" value={form.pricePerKm} onChange={e => setForm({...form, pricePerKm: e.target.value})} className="p-2 border rounded-lg text-sm" /></div>
                  {status && <p className="text-sm text-red-600">{status}</p>}
                  <Button type="submit" disabled={isSaving} className="w-full">{isSaving ? 'Saving...' : 'Add Vehicle'}</Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-blue-600" /> Customer Interactions</h2>
            {bookings.length === 0 ? <p className="text-slate-500">No customer bookings to chat with.</p> : (
              <div className="space-y-4">
                {bookings.filter(b => b.status === 'Confirmed').slice(-5).reverse().map(b => (
                  <div key={b.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <div><p className="font-bold">{b.userName}</p><p className="text-xs text-slate-500">{b.userEmail}</p></div>
                      <div className="flex gap-1">
                        <a href={`tel:${b.userId}`} className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200"><Phone className="w-4 h-4" /></a>
                        <a href={`mailto:${b.userEmail}`} className="p-2 bg-green-100 rounded-lg text-green-600 hover:bg-green-200"><Mail className="w-4 h-4" /></a>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
                      <p>Vehicle: {b.vehicle} | Amount: ₹{b.amount} | Status: {b.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell className="w-6 h-6 text-purple-600" /> Notification System (SMS + Email)</h2>
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className={`flex items-center gap-3 p-4 rounded-xl border ${n.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-200'}`}>
                  {n.type === 'sms' ? <Phone className="w-5 h-5 text-green-600" /> : <Mail className="w-5 h-5 text-blue-600" />}
                  <div className="flex-1"><p className="font-semibold text-sm">{n.text}</p><p className="text-xs text-slate-500">{n.time}</p></div>
                  <Button size="sm" onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? {...x, read: true} : x))}>Mark Read</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-500" /> Top Performing Agencies</h2>
            <div className="space-y-3">
              {mockLeaderboard.map(agency => (
                <div key={agency.rank} className={`flex items-center gap-4 p-4 rounded-xl border ${agency.rank <= 3 ? (agency.rank === 1 ? 'bg-amber-50 border-amber-300' : agency.rank === 2 ? 'bg-slate-100 border-slate-300' : 'bg-orange-50 border-orange-200') : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${agency.rank === 1 ? 'bg-amber-500' : agency.rank === 2 ? 'bg-slate-400' : agency.rank === 3 ? 'bg-orange-400' : 'bg-slate-300'}`}>{agency.rank}</span>
                  <div className="flex-1"><p className="font-bold">{agency.name}</p><p className="text-xs text-slate-500">Rating: {agency.rating}</p></div>
                  <div className="text-right"><p className="font-black text-lg">₹{agency.earnings.toLocaleString('en-IN')}</p><p className="text-xs text-slate-500">earnings</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'surge' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap className="w-6 h-6 text-orange-500" /> Dynamic Surge Pricing (Like Uber)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-2">Current Surge Multiplier</p>
                <div className="text-6xl font-black text-orange-500">{surgeMultiplier.toFixed(1)}x</div>
                <input type="range" min="1" max="3" step="0.1" value={surgeMultiplier} onChange={e => setSurgeMultiplier(Number(e.target.value))} className="w-full mt-4" />
                <div className="flex justify-between text-xs text-slate-500"><span>1x (Normal)</span><span>3x (Max)</span></div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold mb-3">Pricing Calculator</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Base Price</span><span>₹{form.pricePerKm}/km</span></div>
                  <div className="flex justify-between"><span>Surge</span><span className="text-orange-600 font-bold">+{((surgeMultiplier - 1) * 100).toFixed(0)}%</span></div>
                  <div className="flex justify-between border-t pt-2 font-bold"><span>Final Price</span><span>₹{Math.floor(Number(form.pricePerKm) * surgeMultiplier)}/km</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-blue-600" /> Real-time Competitor Price Comparison</h2>
            <div className="space-y-3">
              {competitors.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="w-2 h-10 rounded-full bg-blue-500"></div>
                  <div className="flex-1"><p className="font-bold">{c.name}</p></div>
                  <div className="text-right">
                    <p className="text-xl font-black">₹{c.price}/km</p>
                    {c.trend === 'up' && <span className="text-xs text-red-500">↑ Higher</span>}
                    {c.trend === 'down' && <span className="text-xs text-green-500">↓ Lower</span>}
                    {c.trend === 'stable' && <span className="text-xs text-blue-500">You</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Wrench className="w-6 h-6 text-red-600" /> Auto-Maintenance Reminders</h2>
            <div className="space-y-3">
              {maintenanceSchedule.map((m, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${m.daysLeft <= 3 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <Wrench className={`w-8 h-8 p-2 rounded-full ${m.daysLeft <= 3 ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`} />
                  <div className="flex-1">
                    <p className="font-bold">{m.vehicle}</p>
                    <p className="text-xs text-slate-500">{m.type} • Due: {m.due}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${m.daysLeft <= 3 ? 'text-red-600' : 'text-slate-700'}`}>{m.daysLeft} days</p>
                    <p className="text-xs text-slate-500">remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fraud' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield className="w-6 h-6 text-red-600" /> AI Fraud Detection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold mb-3">Active Alerts</h3>
                <div className="space-y-2">
                  {fraudAlerts.map(alert => (
                    <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-xl border ${alert.severity === 'high' ? 'bg-red-50 border-red-300' : alert.severity === 'medium' ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-300'}`}>
                      <AlertTriangle className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-amber-600' : 'text-slate-600'}`} />
                      <p className="text-sm font-medium">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold mb-3">Detection Patterns</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> Payment validation</div>
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> Email verification check</div>
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> Booking velocity monitor</div>
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> Duplicate detection</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg h-[600px] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" /> Live Chat</h3>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'agency' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.from === 'agency' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] ${msg.from === 'agency' ? 'text-blue-200' : 'text-slate-400'} mt-1`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendChat()} placeholder="Type a message..." className="flex-1 p-3 border rounded-xl" />
              <Button onClick={sendChat}><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><Bell className="w-5 h-5 text-purple-600" /> Notifications (SMS + Email)</h3>
              <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 rounded-xl border ${n.read ? 'bg-slate-50' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex gap-2 mb-2">
                    {n.type === 'sms' ? <Phone className="w-4 h-4 text-green-600" /> : <Mail className="w-4 h-4 text-blue-600" />}
                    <span className="text-xs font-bold text-slate-500 uppercase">{n.type}</span>
                  </div>
                  <p className="text-sm font-medium">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyDashboard;