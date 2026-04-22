import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Send, Sparkles, Navigation, AlertTriangle, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vehicles as staticVehicles } from '../../data/vehicles';
import { mechanics } from '../../data/mechanics';
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

  const initWelcomeMessage = (): Message => ({
    id: 'welcome',
    text: `Welcome back ${user ? user.name.split(' ')[0] : 'traveler'}! 🚗💨\nI'm your intelligent Mobility Assistant. I can help you find cars, compare prices, or get emergency roadside help. What do you need today?`,
    sender: 'bot',
    timestamp: new Date(),
    quickReplies: ['📍 Cars Near Me', '💰 Best under ₹2000', '⚖️ Compare SUVs', '🚨 Emergency Help']
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

  const generateAIResponse = (input: string): Partial<Message> => {
    const text = input.toLowerCase();
    const isUrgent = text.includes('urgent') || text.includes('broke') || text.includes('help') || text.includes('emergency') || text.includes('accident');
    
    // 1. EMERGENCY MODE
    if (isUrgent) {
      return {
        text: "🚨 EMERGENCY MODE ACTIVATED 🚨\nI'm finding the nearest mechanics and support for you right now.",
        isUrgent: true,
        options: mechanics.slice(0, 2).map(m => ({
          label: `${m.name} (${m.distance} away) - ⭐ ${m.rating}`,
          value: m.contact,
          action: 'call',
          icon: AlertTriangle
        })),
        quickReplies: ['Call Police (100)', 'Call Ambulance (108)']
      };
    }

    // 2. LIVE CAR COMPARISON
    if (text.includes('compare')) {
      const isSuv = text.includes('suv');
      const filtered = isSuv ? vehicles.filter(v => v.category === 'suv') : vehicles;
      const top2 = filtered.slice(0, 2);
      if (top2.length >= 2) {
        return {
          text: `⚖️ **Live Comparison**:\n\n**${top2[0].name}** vs **${top2[1].name}**\n\n💰 Price: ₹${top2[0].pricePerDay} vs ₹${top2[1].pricePerDay}\n⛽ Fuel: ${top2[0].fuel} vs ${top2[1].fuel}\n⚙️ Trans: ${top2[0].transmission} vs ${top2[1].transmission}\n⭐ Rating: ${top2[0].rating} vs ${top2[1].rating}\n\n🏆 **Winner:** ${top2[0].pricePerDay < top2[1].pricePerDay ? top2[0].name : top2[1].name} is the better value!`,
          options: [
            { label: `Book ${top2[0].name}`, value: `/vehicle/${top2[0].id}`, action: 'navigate' },
            { label: `Book ${top2[1].name}`, value: `/vehicle/${top2[1].id}`, action: 'navigate' }
          ],
          quickReplies: ['Compare Sedans', 'Find Cheapest']
        };
      }
    }

    // 3. BUDGET & DISCOVERY ENGINE
    if (text.includes('cheap') || text.includes('under')) {
      const budgetMatch = text.match(/\d+/);
      const budget = budgetMatch ? parseInt(budgetMatch[0]) : 2000;
      const affordable = vehicles.filter(v => v.pricePerDay <= budget).sort((a, b) => a.pricePerDay - b.pricePerDay);
      
      if (affordable.length > 0) {
        return {
          text: `💰 I found ${affordable.length} cars under ₹${budget}. Here are the best deals:`,
          options: affordable.slice(0, 3).map(v => ({
            label: `${v.name} - ₹${v.pricePerDay}/day (⭐ ${v.rating})`,
            value: `/vehicle/${v.id}`,
            action: 'navigate',
            icon: ShieldCheck
          })),
          quickReplies: ['Sort by Rating', 'Increase Budget']
        };
      }
    }

    // 4. SMART INSIGHTS / PRICE PREDICTION
    if (text.includes('price') || text.includes('cost') || text.includes('tomorrow')) {
      return {
        text: "📊 **Smart Insight:** Prices in Mumbai are expected to rise by 15% this weekend due to high demand. I recommend booking within the next 2 hours to lock in current rates.",
        quickReplies: ['Find Cars in Mumbai', 'Show Long-Term Plans']
      };
    }

    // 5. NEAR ME / LOCATION INTELLIGENCE
    if (text.includes('near me') || text.includes('nearby') || text.includes('close')) {
      return {
        text: "📍 Detecting your location...\nI found 3 highly-rated cars within 2 km of you.",
        options: vehicles.slice(0, 3).map(v => ({
          label: `${v.name} (1.2 km away) - ₹${v.pricePerDay}/day`,
          value: `/vehicle/${v.id}`,
          action: 'navigate',
          icon: Navigation
        })),
        quickReplies: ['Show on Map', 'Find Mechanics Near Me']
      };
    }

    // 6. AI RECOMMENDATION (TRIPS)
    if (text.includes('trip') || text.includes('lonavala') || text.includes('long')) {
      const suvs = vehicles.filter(v => v.category.toLowerCase() === 'suv' || v.category.toLowerCase() === 'luxury');
      return {
        text: "🧠 **AI Suggestion:** Since you're planning a trip, I highly recommend an SUV for better comfort on highways and hilly terrain. Expected fuel cost: ~₹1,500.",
        options: suvs.slice(0, 2).map(v => ({
          label: `${v.name} - ₹${v.pricePerDay}/day`,
          value: `/vehicle/${v.id}`,
          action: 'navigate',
          icon: Zap
        })),
        quickReplies: ['Compare SUVs', 'Calculate Total Cost']
      };
    }

    // FALLBACK
    return {
      text: "I'm equipped to help you with booking, comparisons, price predictions, or emergency assistance. How can I assist you today?",
      quickReplies: ['Find Cheap Cars', 'Recommend for a Trip', 'Mechanics Near Me']
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
      navigate(opt.value);
      setIsOpen(false);
      return;
    }
    if (opt.action === 'call') {
      window.open(`tel:${opt.value}`, '_self');
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
                <div className={`max-w-[88%] px-4 py-3.5 rounded-2xl text-[14.5px] leading-relaxed shadow-sm whitespace-pre-wrap ${
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Smart Actions</span>
              <div className="flex gap-2">
                <button onClick={() => handleSend("Near me")} className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100">📍 Near Me</button>
                <button onClick={() => handleSend("Compare cars")} className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100">⚖️ Compare</button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message or request..." className="flex-1 bg-transparent border-none py-2 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 font-medium" />
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