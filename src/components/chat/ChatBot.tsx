import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
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
    
    // 1. Help & General FAQ
    if (lowerText.includes('help') || lowerText.includes('how to book') || lowerText.includes('how do i') || lowerText.match(/what can you do|who are you/)) {
      return "I can help you with finding car rentals by city, searching for specific car brands (like Tata, Honda, BMW), specific types (SUVs, scooters), getting the best prices, comparing features, or finding nearby agencies. Just ask me!";
    }

    // 2. Payment & Deposit FAQ
    if (lowerText.includes('payment') || lowerText.includes('deposit') || lowerText.includes('pay') || lowerText.includes('refund')) {
        return "We accept all major credit cards, UPI, and net banking. A fully refundable security deposit is standard on all rentals, calculated dynamically based on the vehicle type. The deposit will be returned within 3-5 business days of drop-off.";
    }

    // Identifiers
    const cities = ['delhi', 'mumbai', 'bangalore', 'goa', 'roorkee', 'pune', 'hyderabad', 'manali', 'rishikesh'];
    let foundCity = cities.find(c => lowerText.includes(c));

    const categories = ['suv', 'luxury', 'scooter', 'electric', 'touring-bike', 'sedan', 'hatchback', 'sports-bike', 'commuter-bike'];
    let foundCategory = categories.find(c => lowerText.includes(c));
    if (!foundCategory && lowerText.includes('bike')) foundCategory = 'bike';
    if (!foundCategory && lowerText.includes('car')) foundCategory = 'car';

    const specificCar = vehicles.find(v => lowerText.includes(v.name.toLowerCase()) || (v.brand.toLowerCase() !== 'honda' && v.brand.toLowerCase() !== 'tata' && lowerText.includes(v.brand.toLowerCase())));

    const features = ['sunroof', 'bluetooth', 'airbags', 'gps', 'alloy', 'leather'];
    let foundFeature = features.find(f => lowerText.includes(f));

    // 3. Price queries (affordable, best price, cheap)
    if (lowerText.includes('cheap') || lowerText.includes('best price') || lowerText.includes('lowest') || lowerText.includes('affordable') || lowerText.includes('under')) {
        let pool = vehicles;
        if (foundCity) pool = pool.filter(v => v.city.toLowerCase() === foundCity);
        if (foundCategory) pool = pool.filter(v => v.category.includes(foundCategory!) || v.type.includes(foundCategory!));
        
        const sorted = [...pool].sort((a, b) => a.pricePerDay - b.pricePerDay);
        if (sorted.length === 0) return `I couldn't find any cheap options matching your criteria.`;
        const top3 = sorted.slice(0, 3);
        const listing = top3.map(v => `${v.name} in ${v.city} (₹${v.pricePerDay}/day)`).join(', ');
        return `Here are some of the most affordable options I found: ${listing}.`;
    }

    // 4. Specific Car Details
    if ((lowerText.includes('detail') || lowerText.includes('about') || lowerText.includes('tell me') || lowerText.includes('info')) && specificCar) {
        return `The ${specificCar.name} is a fantastic ${specificCar.category} by ${specificCar.brand}. It runs on ${specificCar.fuel} (${specificCar.transmission}) and gives a mileage of ${specificCar.mileage}. It seats ${specificCar.seats}. Rental starts at ₹${specificCar.pricePerDay}/day (or ₹${specificCar.pricePerHour}/hr). It's available via ${specificCar.agency} in ${specificCar.city}.`;
    }

    // 5. Search by Feature
    if (foundFeature) {
        let pool = vehicles;
        if (foundCity) pool = pool.filter(v => v.city.toLowerCase() === foundCity);
        const matching = pool.filter(v => v.features.some(f => f.toLowerCase().includes(foundFeature as string)));
        if (matching.length > 0) {
            const sample = matching.slice(0, 3).map(v => `${v.name} (${v.city})`).join(', ');
            return `I found ${matching.length} vehicles with ${foundFeature}! For example: ${sample}.`;
        }
    }

    // 6. Agency Search by City
    if (lowerText.includes('agency') || lowerText.includes('agencies') || lowerText.includes('near') || lowerText.includes('company')) {
        if (foundCity) {
            const cityAgencies = agencies.filter(a => a.city.toLowerCase() === foundCity);
            if (cityAgencies.length > 0) {
                const agencyDetails = cityAgencies.map(a => `${a.name} (Rating: ${a.rating}/5, Contact: ${a.contact})`).join(' | ');
                return `Top agencies in ${foundCity}: ${agencyDetails}.`;
            } else {
                return `Sorry, we don't currently have active agency partnerships mapped in ${foundCity}.`;
            }
        }
        return "Which city are you looking in? (e.g., Delhi, Mumbai, Pune, Goa).";
    }

    // 7. Contextual Category or City Search
    if (foundCity || foundCategory) {
        let pool = vehicles;
        if (foundCity) pool = pool.filter(v => v.city.toLowerCase() === foundCity);
        if (foundCategory) pool = pool.filter(v => v.category.includes(foundCategory!) || v.type.includes(foundCategory!));

        if (pool.length > 0) {
            const startPrice = Math.min(...pool.map(v => v.pricePerDay));
            const sample = pool.slice(0, 3).map(v => v.name).join(', ');
            return `I found ${pool.length} ${foundCategory || 'vehicles'} in ${foundCity || 'our network'}, starting from just ₹${startPrice}/day. Some popular ones are: ${sample}.`;
        } else {
            return `I couldn't find any ${foundCategory || 'vehicles'} in ${foundCity || 'that location'}. Try adjusting your search!`;
        }
    }

    // 8. Fallbacks
    const explicitFallbackCar = vehicles.find(v => lowerText.includes(v.name.toLowerCase()));
    if (explicitFallbackCar) {
         return `We have the ${explicitFallbackCar.brand} ${explicitFallbackCar.name} available! Are you looking for its specifications, price, or availability in a certain city? (e.g., "details about ${explicitFallbackCar.name}")`;
    }

    return "I am not sure I understand. You can ask me about 'cheap cars in Goa', 'details about Tata Nexon', 'agencies in Mumbai', or 'SUVs with sunroofs'.";
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
