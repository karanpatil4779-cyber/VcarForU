import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageCircle, X, Send, Bot, Sparkles, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vehicles as staticVehicles } from '../../data/vehicles';
import { useAuth } from '../../context/AuthContext';

type MessageOption = {
  label: string;
  action?: string;
  value: string;
  data?: Record<string, unknown>;
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
  const [chatContext, setChatContext] = useState<{
    intent?: string;
    city?: string;
    budget?: 'low' | 'mid' | 'high';
    category?: string;
    isUrgent?: boolean;
    preferences?: string[];
  }>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [vehicles, setVehicles] = useState(staticVehicles);

  useEffect(() => {
    fetch('/api/vehicles').then(r => r.json()).then(data => {
      if (data && data.length > 0) setVehicles([...staticVehicles, ...data]);
    }).catch(() => {});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg: Message = {
        id: 'welcome',
        text: `Hey ${user ? user.name.split(' ')[0] : 'there'}! 👋 I'm your AI Travel Assistant.\n\nI can help you find a ride in seconds. Looking for something specific or just browsing?`,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Cheap Car Tomorrow', 'Premium SUV', 'Book a Bike', 'Pricing Help']
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (input: string): Partial<Message> => {
    const text = input.toLowerCase();
    const isUrgent = text.includes('now') || text.includes('urgent') || text.includes('immediately') || text.includes('today');
    
    if (isUrgent) {
      setChatContext(prev => ({ ...prev, isUrgent: true }));
    }

    if (text.includes('recommend') || text.includes('suggest') || text.includes('find') || text.includes('car')) {
      let results = [...vehicles];
      if (text.includes('suv')) results = results.filter(v => v.category === 'suv');
      if (text.includes('mumbai')) results = results.filter(v => v.city === 'Mumbai');
      
      const recommendations = results.slice(0, 3);
      if (recommendations.length > 0) {
        return {
          text: isUrgent 
            ? `I've found these available for immediate pickup! Our best options right now:` 
            : `I've found some great options for you. Which one catches your eye?`,
          options: recommendations.map(v => ({
            label: `${v.brand} ${v.name} - ₹${v.pricePerDay}/day`,
            value: `/vehicle/${v.id}`,
            action: 'navigate'
          })),
          quickReplies: ['Show More', 'Filter by Budget', 'Change City']
        };
      }
    }

    if (text.includes('cancel') || text.includes('refund')) {
      return {
        text: "Free cancellation up to 24 hours before your trip! Your deposit will be refunded within 3-5 business days. 💳",
        quickReplies: ['Check My Booking', 'Talk to Agent']
      };
    }

    if (text.includes('price') || text.includes('cost') || text.includes('offer')) {
      return {
        text: "Our cars start at ₹1,200/day. Use code **AI50** for a special discount! 🎁",
        quickReplies: ['Cheap Cars', 'Premium Options']
      };
    }

    return {
      text: "I can help with bookings, pricing, or any questions. What would you like to do?",
      quickReplies: ['Find Car', 'Check Status', 'Support']
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
    handleSend(opt.label);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-[360px] sm:w-[400px] flex flex-col overflow-hidden border border-white/20 h-[600px] animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 p-5 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">AI Assistant</h3>
                  <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Live & Intelligent</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>
                  {msg.text}
                </div>
                {msg.sender === 'bot' && msg.options && (
                  <div className="flex flex-col gap-2 mt-3 w-full max-w-[85%]">
                    {msg.options.map((opt, i) => (
                      <button key={i} onClick={() => handleOptionClick(opt)} className="text-left bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-4 py-3 rounded-2xl transition-all shadow-sm flex items-center justify-between group">
                        <span className="text-xs font-bold">{opt.label}</span>
                        <ShoppingCart className="h-4 w-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
                {msg.sender === 'bot' && msg.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.quickReplies.map((qr, i) => (
                      <button key={i} onClick={() => handleSend(qr)} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-200/50 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-200 transition-all text-slate-600">
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
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-1.5 border border-transparent focus-within:border-indigo-500/30">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me about anything..." className="flex-1 bg-transparent border-none py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium" />
              <button type="submit" disabled={!input.trim()} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-indigo-600 text-white p-4 rounded-3xl shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative">
          <MessageCircle className="h-7 w-7 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 bg-red-500 border-2 border-white text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">1</span>
        </button>
      )}
    </div>
  );
}