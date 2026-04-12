import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { vehicles } from '../../data/vehicles';
import { agencies } from '../../data/agencies';

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hi there! I can help you find nearest car rentals, the best prices, and specific agencies. What are you looking for today?',
      sender: 'bot',
      timestamp: new Date()
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
    
    // Simulate thinking delay
    setTimeout(() => {
      const responseText = generateResponse(userMsg.text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('near') || lowerText.includes('nearest') || lowerText.includes('agency')) {
        let city = '';
        const cities = ['delhi', 'mumbai', 'bangalore', 'goa', 'roorkee', 'pune', 'hyderabad', 'manali'];
        for (const c of cities) {
            if (lowerText.includes(c)) {
                city = c;
                break;
            }
        }

        if (city) {
            const cityAgencies = agencies.filter(a => a.city.toLowerCase() === city);
            if (cityAgencies.length > 0) {
                return `I found agencies near you in ${city}: ${cityAgencies.map(a => a.name).join(', ')}. Which one sounds good?`;
            } else {
                return `I couldn't find specific agencies in ${city}.`;
            }
        }
        
        return "Where are you located? Please mention your city (e.g. Delhi, Mumbai, Goa, Pune, etc.) so I can find agencies and rentals near you.";
    }
    
    if (lowerText.includes('cheap') || lowerText.includes('best price') || lowerText.includes('lowest')) {
        const sorted = [...vehicles].sort((a, b) => a.pricePerDay - b.pricePerDay);
        const top3 = sorted.slice(0, 3);
        const listing = top3.map(v => `${v.name} (₹${v.pricePerDay}/day)`).join(', ');
        return `Here are some of the best daily rates currently available: ${listing}. Would you like details on any of these?`;
    }

    if (lowerText.includes('tharm') || lowerText.includes('thar') || lowerText.includes('details')) {
        const queryCar = vehicles.find(v => lowerText.includes(v.name.toLowerCase()) || (v.name.toLowerCase().includes('thar') && lowerText.includes('thar')));
        if (queryCar) {
            return `Here are the details for the ${queryCar.name}: It costs ₹${queryCar.pricePerDay}/day, has ${queryCar.seats} seats, runs on ${queryCar.fuel}, and includes features like ${queryCar.features.slice(0, 3).join(', ')}.`;
        }
        return "Which car would you like details on? I have information on cars like Mahindra Thar, Tata Nexon, Ola S1 Pro, and more.";
    }

    return "I didn't quite catch that. You can ask me to 'find the cheapest cars', 'show nearest agencies in Mumbai', or 'get details on cars'.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-100 h-[500px] transition-all duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <h3 className="font-semibold text-lg">VCarForU Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
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
