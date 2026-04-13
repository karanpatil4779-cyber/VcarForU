import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vehicles } from '../../data/vehicles';
import { agencies } from '../../data/agencies';

type MessageOption = {
  label: string;
  action?: 'navigate' | 'reply' | 'set_intent';
  value: string;
};

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: MessageOption[];
};

export default function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [chatContext, setChatContext] = useState<{ step?: string, city?: string, agency?: string }>({});
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hi there! I can help you find nearest car rentals, the best prices, and specific agencies. What are you looking for today?',
      sender: 'bot',
      timestamp: new Date(),
      options: [
        { label: 'Find a Car', value: 'find_car', action: 'set_intent' },
        { label: 'Help & Policies', value: 'help', action: 'reply' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processBotResponse = (text: string, value?: string, action?: string) => {
    const response = generateResponse(text, value, action);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: 'bot',
      timestamp: new Date(),
      options: response.options
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    setTimeout(() => {
      processBotResponse(userMsg.text);
    }, 600);
  };

  const handleOptionClick = (opt: MessageOption) => {
    if (opt.action === 'navigate') {
       navigate(opt.value);
       setIsOpen(false);
       return;
    }

    const userMsg: Message = { 
      id: Date.now().toString(), 
      text: opt.label, 
      sender: 'user', 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMsg]);
    
    setTimeout(() => {
      processBotResponse(opt.label, opt.value, opt.action);
    }, 600);
  };

  const generateResponse = (text: string, value?: string, action?: string): { text: string, options?: MessageOption[] } => {
    const lowerText = text.toLowerCase();
    
    // GUIDED FLOW HANDLING
    if (action === 'set_intent' && value === 'find_car') {
        const uniqueCities = Array.from(new Set(agencies.map(a => a.city)));
        setChatContext({ step: 'select_city' });
        return {
            text: "Great! Let's get you a ride. Which city are you currently in?",
            options: uniqueCities.map(c => ({ label: c, value: c, action: 'set_intent' }))
        };
    }

    if (chatContext.step === 'select_city' && action === 'set_intent') {
        const city = value || '';
        const cityAgencies = agencies.filter(a => a.city === city);
        setChatContext({ step: 'select_agency', city });
        return {
            text: `Awesome! I found ${cityAgencies.length} highly-rated agencies near you in ${city}. Which one would you prefer?`,
            options: cityAgencies.map(a => ({ label: `${a.name} (${a.rating}⭐)`, value: a.name, action: 'set_intent' }))
        };
    }

    if (chatContext.step === 'select_agency' && action === 'set_intent') {
        const agencyName = value || '';
        const agencyVehicles = vehicles.filter(v => v.agency === agencyName && v.city === chatContext.city);
        setChatContext({ step: 'select_vehicle', city: chatContext.city, agency: agencyName });
        
        if (agencyVehicles.length === 0) return { text: "Sorry, this agency currently has no vehicles available." };

        const options = agencyVehicles.slice(0, 5).map(v => ({
            label: `${v.name} (₹${v.pricePerDay}/day)`,
            value: `/vehicle/${v.id}`,
            action: 'navigate' as const
        }));

        return {
            text: `${agencyName} has some great rides! Here are the best available cars and bikes. Select one to see its full details and book immediately:`,
            options
        };
    }

    if (lowerText.includes('find') && (lowerText.includes('car') || lowerText.includes('ride') || lowerText.includes('vehicle'))) {
        const uniqueCities = Array.from(new Set(agencies.map(a => a.city)));
        setChatContext({ step: 'select_city' });
        return {
            text: "I can help you find a ride starting from an agency near you. First, which city are you in?",
            options: uniqueCities.map(c => ({ label: c, value: c, action: 'set_intent' }))
        };
    }

    // Identifiers
    const citiesLoc = ['delhi', 'mumbai', 'bangalore', 'goa', 'roorkee', 'pune', 'hyderabad', 'manali', 'rishikesh'];
    let foundCity = citiesLoc.find(c => lowerText.includes(c));

    // GENERAL NLP RESPONSES
    if (lowerText.match(/^(hi|hello|hey|greetings)/)) {
        return {
            text: "Hello! Ready to hit the road? Let me know what you need.",
            options: [
                { label: 'Find Nearest Agency', value: 'find_car', action: 'set_intent' }
            ]
        };
    }

    if (lowerText.includes('document')) {
        return { text: "To rent, you'll need a valid Driving License (at least 1 year old) and an original ID proof (Aadhar Card, Passport, or Voter ID)." };
    }
    if (lowerText.includes('age') && lowerText.includes('limit')) {
        return { text: "The minimum age is 21 years for cars, and 18 for scooters." };
    }
    if (lowerText.includes('cancel')) {
        return { text: "Free cancellation up to 24 hours before pickup! The deposit is always fully refunded." };
    }

    if (lowerText.includes('payment') || lowerText.includes('deposit')) {
        return { text: "We accept all credit cards, UPI, and net banking. Security deposits are calculated dynamically and refunded within 3-5 days." };
    }

    if (foundCity && (lowerText.includes('agency') || lowerText.includes('agencies') || lowerText.includes('near'))) {
        const cityAgencies = agencies.filter(a => a.city.toLowerCase() === foundCity);
        if (cityAgencies.length > 0) {
            setChatContext({ step: 'select_agency', city: cityAgencies[0].city });
            return {
                text: `I found these top agencies in ${foundCity}:`,
                options: cityAgencies.map(a => ({ label: `${a.name} (${a.rating}⭐)`, value: a.name, action: 'set_intent' }))
            };
        }
        return { text: `Sorry, no active agencies mapped in ${foundCity}.` };
    }
    
    // Quick Fallbacks
    return {
        text: "I'm ready to assist! Do you want to find vehicles near you, or do you have a specific question?",
        options: [
            { label: 'Find Cars Near Me', value: 'find_car', action: 'set_intent' },
        ]
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-100 h-[500px] transition-all duration-300">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <h3 className="font-semibold text-lg">VCarForU Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                
                {/* Render Action Options if available & sent by bot */}
                {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2 w-full max-w-[85%] pl-2">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        className="text-left bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs px-3 py-2 rounded-xl transition-colors font-medium shadow-sm active:scale-95"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type 'Find me a car'..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 flex items-center justify-center animate-bounce"
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      )}
    </div>
  );
}
