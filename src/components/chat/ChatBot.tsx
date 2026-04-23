import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Send, Sparkles, Navigation, ShieldCheck, Zap, Fuel, Siren, MapPin, Car, Home, Search, Phone, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vehicles as staticVehicles } from '../../data/vehicles';
import { mechanics } from '../../data/mechanics';
import { stations } from '../../data/stations';
import { useAuth } from '../../context/AuthContext';

type MessageOption = {
  label: string;
  action?: 'navigate' | 'call' | 'map' | 'send';
  value: string;
  icon?: LucideIcon;
};

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: MessageOption[];
  quickReplies?: string[];
  isUrgent?: boolean;
};

export default function ChatBot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const isFirstRender = useRef(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [vehicles, setVehicles] = useState(staticVehicles);

  const fuelStations = stations.filter(s => s.type === 'fuel').slice(0, 5);
  const electricStations = stations.filter(s => s.type === 'electric').slice(0, 5);

  const initWelcomeMessage = (): Message => ({
    id: 'welcome',
    text: `Welcome back ${user ? user.name.split(' ')[0] : 'traveler'}! 🚗💨\nI'm your AI Mobility Assistant. I can help you find cars, fuel stations, emergency help, or navigate the app. What do you need?`,
    sender: 'bot',
    timestamp: new Date(),
    quickReplies: ['🚗 Book a Car', '⛽ Fuel Stations', '🚨 Emergency Help', '📊 My Dashboard']
  });

  useEffect(() => {
    fetch('/api/vehicles').then(r => r.json()).then(data => {
      if (data && data.length > 0) setVehicles([...staticVehicles, ...data]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (isOpen) {
        setMessages([initWelcomeMessage()]);
      }
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (inputText: string): Partial<Message> => {
    const text = inputText.toLowerCase();
    
    // Emergency Mode
    if (text.includes('emergency') || text.includes('accident') || text.includes('help') || text.includes('urgent') || text.includes('police') || text.includes('ambulance')) {
      return {
        text: "🚨 EMERGENCY MODE 🚨\nI'm connecting you with emergency services.",
        isUrgent: true,
        options: [
          { label: 'Call Police (100)', value: '100', action: 'call', icon: Siren },
          { label: 'Call Ambulance (102)', value: '102', action: 'call', icon: Siren },
          { label: 'Call Roadside Assistance', value: '18001234567', action: 'call', icon: Phone }
        ],
        quickReplies: ['⛽ Find Fuel Station', '🔧 Find Mechanic']
      };
    }

    // Fuel Stations
    if (text.includes('fuel') || text.includes('petrol') || text.includes('gas') || text.includes('diesel') || text.includes('charging') || text.includes('ev')) {
      const stationOptions: MessageOption[] = [
        ...fuelStations.map(s => ({
          label: `${s.name} - ${s.city}`,
          value: `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`,
          action: 'map' as const,
          icon: Fuel
        })),
        ...electricStations.map(s => ({
          label: `${s.name} - ${s.city}`,
          value: `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`,
          action: 'map' as const,
          icon: Zap
        }))
      ];
      return {
        text: "⛽ Finding nearest fuel & EV charging stations...",
        options: stationOptions,
        quickReplies: ['🚗 Book a Car', '📊 Dashboard']
      };
    }

    // Book a Car
    if (text.includes('book') || text.includes('rent') || text.includes('car') || text.includes('bike')) {
      return {
        text: "🚗 Great! Let me find the best cars for you.",
        options: vehicles.slice(0, 3).map(v => ({
          label: `${v.name} - ₹${v.pricePerKm}/km`,
          value: `/vehicle/${v.id}`,
          action: 'navigate',
          icon: Car
        })),
        quickReplies: ['🔍 Search All', '💰 Cheapest', '⭐ Top Rated']
      };
    }

    // Dashboard / My Rides
    if (text.includes('dashboard') || text.includes('my ride') || text.includes('trip') || text.includes('history') || text.includes('active')) {
      return {
        text: "📊 Taking you to your Dashboard...",
        options: [
          { label: 'My Dashboard', value: '/dashboard', action: 'navigate', icon: Home },
          { label: 'Active Rides', value: '/dashboard', action: 'navigate', icon: Navigation },
          { label: 'Journey Tracker', value: '/journey/test', action: 'navigate', icon: MapPin }
        ],
        quickReplies: ['🚗 Book New Car', '⛽ Fuel Stations']
      };
    }

    // Journey Tracker
    if (text.includes('journey') || text.includes('tracker') || text.includes('track') || text.includes('start')) {
      return {
        text: "🗺️ Let's start your journey tracker!",
        options: [
          { label: 'Start Journey', value: '/journey/test', action: 'navigate', icon: Navigation },
          { label: 'Find Nearest Fuel', value: 'fuel', action: 'send', icon: Fuel }
        ],
        quickReplies: ['📊 Go to Dashboard', '🚗 Book a Car']
      };
    }

    // Compare
    if (text.includes('compare') || text.includes('vs')) {
      const top2 = vehicles.slice(0, 2);
      return {
        text: `⚖️ **Comparison:**\n\n**${top2[0].name}** vs **${top2[1].name}**\n\n💰 ₹${top2[0].pricePerKm}/km vs ₹${top2[1].pricePerKm}/km\n⭐ ${top2[0].rating} vs ${top2[1].rating}`,
        options: [
          { label: `Book ${top2[0].name}`, value: `/vehicle/${top2[0].id}`, action: 'navigate' },
          { label: `Book ${top2[1].name}`, value: `/vehicle/${top2[1].id}`, action: 'navigate' }
        ],
        quickReplies: ['🚗 Book a Car', '📊 Dashboard']
      };
    }

    // Search
    if (text.includes('search') || text.includes('find') || text.includes('browse')) {
      return {
        text: "🔍 Let's find a vehicle for you!",
        options: [
          { label: 'Browse All Cars', value: '/search', action: 'navigate', icon: Search },
          { label: 'Browse Bikes', value: '/search?type=bike', action: 'navigate', icon: Zap }
        ],
        quickReplies: ['💰 Under ₹2000', '⭐ Top Rated']
      };
    }

    // Mechanic
    if (text.includes('mechanic') || text.includes('repair') || text.includes('service')) {
      return {
        text: "🔧 Finding nearest mechanics...",
        options: mechanics.slice(0, 3).map(m => ({
          label: `${m.name} (${m.distance})`,
          value: m.contact,
          action: 'call',
          icon: ShieldCheck
        })),
        quickReplies: ['⛽ Fuel Station', '🚨 Emergency']
      };
    }

    // Cheap / Budget
    if (text.includes('cheap') || text.includes('budget') || text.includes('under') || text.includes('affordable')) {
      const affordable = [...vehicles].sort((a, b) => a.pricePerKm - b.pricePerKm).slice(0, 3);
      return {
        text: `💰 Found ${affordable.length} affordable cars:`,
        options: affordable.map(v => ({
          label: `${v.name} - ₹${v.pricePerKm}/km`,
          value: `/vehicle/${v.id}`,
          action: 'navigate',
          icon: Zap
        })),
        quickReplies: ['🔍 Search All', '📊 Dashboard']
      };
    }

    // Navigation Help
    if (text.includes('how') || text.includes('guide') || text.includes('help')) {
      return {
        text: "📱 I can help you navigate the app!\n\n• 🚗 Book a Car → Search & select vehicle\n• 💳 Payment → Complete checkout\n• 📊 Dashboard → View your rides\n• 🗺️ Journey Tracker → Start after payment\n• ⛽ Fuel Stations → Find nearby stations\n• 🚨 Emergency → Police/Ambulance",
        quickReplies: ['🚗 Book a Car', '📊 My Dashboard', '⛽ Fuel Stations']
      };
    }

    // Fallback
    return {
      text: "I'm your AI assistant! I can help you with:\n🚗 Booking cars\n⛽ Finding fuel/EV stations\n📊 Your dashboard & rides\n🗺️ Journey tracking\n🚨 Emergency services\n\nWhat would you like?",
      quickReplies: ['🚗 Book a Car', '⛽ Fuel Stations', '📊 My Dashboard', '🚨 Emergency Help']
    };
  };

  const handleSend = (overrideInput?: string) => {
    const val = overrideInput || input;
    if (!val.trim()) return;

    const userMsg: Message = {
      id: uuidv4(),
      text: val,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiResponse = generateAIResponse(val);
      const botMsg: Message = {
        id: uuidv4(),
        text: aiResponse.text || "Checking that for you...",
        sender: 'bot',
        timestamp: new Date(),
        options: aiResponse.options,
        quickReplies: aiResponse.quickReplies,
        isUrgent: aiResponse.isUrgent
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleOptionClick = (opt: MessageOption) => {
    if (opt.action === 'navigate') {
      if (opt.value.includes('http')) {
        window.open(opt.value, '_blank');
      } else {
        navigate(opt.value);
      }
      setIsOpen(false);
      return;
    }
    if (opt.action === 'call') {
      window.open(`tel:${opt.value}`, '_self');
      return;
    }
    if (opt.action === 'map') {
      window.open(opt.value, '_blank');
      return;
    }
    if (opt.action === 'send') {
      handleSend(opt.value);
      return;
    }
    handleSend(opt.label);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-[360px] sm:w-[420px] flex flex-col overflow-hidden border border-slate-200 h-[650px] animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/30 p-2.5 rounded-2xl backdrop-blur-md border border-indigo-400/30">
                  <Sparkles className="h-6 w-6 text-indigo-200 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">AI Mobility Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">Active & Ready</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/80">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[88%] px-4 py-3.5 rounded-2xl text-[14.5px] leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : msg.isUrgent 
                      ? 'bg-red-50 border-2 border-red-500/20 text-red-900 rounded-tl-none font-medium'
                      : 'bg-white border border-slate-200/60 text-slate-700 rounded-tl-none shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
                }`}>
                  {msg.text}
                </div>
                {msg.sender === 'bot' && msg.options && (
                  <div className="flex flex-col gap-2.5 mt-3 w-full max-w-[90%] pl-2">
                    {msg.options.map((opt, i) => {
                      const Icon = opt.icon || Navigation;
                      return (
                        <button key={i} onClick={() => handleOptionClick(opt)} className={`text-left hover:bg-slate-50 px-4 py-3.5 rounded-2xl transition-all shadow-sm flex items-center justify-between group border ${msg.isUrgent ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'}`}>
                          <div className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${msg.isUrgent ? 'text-white' : 'text-indigo-500'}`} />
                            <span className="text-[13px] font-bold">{opt.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {msg.sender === 'bot' && msg.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-3 pl-2">
                    {msg.quickReplies.map((qr, i) => (
                      <button key={i} onClick={() => handleSend(qr)} className="text-[12px] font-semibold px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all text-slate-600 flex items-center gap-1.5 active:scale-95">
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</span>
              <div className="flex gap-2">
                <button onClick={() => handleSend("book")} className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100">🚗</button>
                <button onClick={() => handleSend("fuel")} className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100">⛽</button>
                <button onClick={() => handleSend("dashboard")} className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100">📊</button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." className="flex-1 bg-transparent border-none py-2 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 font-medium" />
              <button type="submit" disabled={!input.trim()} className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-md active:scale-95">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-slate-900 text-white p-4 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-110 hover:shadow-[0_15px_50px_rgba(79,70,229,0.4)] transition-all duration-300 flex items-center justify-center group relative border border-slate-700">
          <div className="absolute inset-0 bg-indigo-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          <Sparkles className="h-8 w-8 group-hover:rotate-12 transition-transform text-indigo-200 group-hover:text-white" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 border-2 border-slate-900 text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg">1</span>
        </button>
      )}
    </div>
  );
}