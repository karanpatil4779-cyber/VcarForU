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

  const [chatContext, setChatContext] = useState<{ topic?: string, target?: string }>({});

  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // 0. Greetings
    if (lowerText.match(/^(hi|hello|hey|greetings|good morning|good evening|good afternoon)\b/)) {
        return "Hello! How can I assist you today? You can ask me to compare cars, find the nearest agencies, or check pricing and availability.";
    }

    // 1. Policies & Documents FAQ
    if (lowerText.includes('document') || lowerText.includes('license') || lowerText.includes('id proof')) {
        return "To rent a vehicle, you will need a valid Driving License (at least 1 year old) and an original ID proof (Aadhar Card, Passport, or Voter ID).";
    }
    if (lowerText.includes('age') && (lowerText.includes('limit') || lowerText.includes('minimum'))) {
        return "The minimum age limit to rent our cars is 21 years, and 18 years for scooters. For luxury cars, the minimum age is 25 years.";
    }
    if (lowerText.includes('cancel') || lowerText.includes('refund policy')) {
        return "Cancellation Policy: Free cancellation up to 24 hours before pickup. Cancellations within 24 hours incur a 50% charge of the first day's rental. The security deposit is always fully refunded.";
    }
    if (lowerText.includes('insurance') || lowerText.includes('accident')) {
        return "All our rentals come with standard comprehensive insurance. In case of damage, your liability is limited to the security deposit amount (unless under the influence or negligence).";
    }

    // 2. Payment & Deposit FAQ
    if (lowerText.includes('payment') || lowerText.includes('deposit') || lowerText.includes('pay') || lowerText.includes('refund')) {
        return "We accept all major credit cards, UPI, and net banking. A fully refundable security deposit is standard on all rentals, calculated dynamically based on the vehicle type. The deposit will be returned within 3-5 business days of drop-off.";
    }

    // 3. Comparisons (e.g., "compare thar and nexon")
    if (lowerText.includes('compare')) {
        const foundVehicles = vehicles.filter(v => lowerText.includes(v.name.toLowerCase()));
        if (foundVehicles.length >= 2) {
            const v1 = foundVehicles[0];
            const v2 = foundVehicles[1];
            return `Comparison:\n- ${v1.name}: ₹${v1.pricePerDay}/day, ${v1.fuel}, ${v1.transmission}, ${v1.seats} seats.\n- ${v2.name}: ₹${v2.pricePerDay}/day, ${v2.fuel}, ${v2.transmission}, ${v2.seats} seats. \n\nBoth are great options! Which one do you prefer?`;
        }
        return "To compare, please mention the specific names of at least two vehicles (e.g., 'Compare Thar and Nexon').";
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
    let foundTransmission = ['automatic', 'manual', 'cvt'].find(t => lowerText.includes(t));

    // 4. Price queries (affordable, best price, cheap)
    if (lowerText.includes('cheap') || lowerText.includes('best price') || lowerText.includes('lowest') || lowerText.includes('affordable') || lowerText.includes('under')) {
        let pool = vehicles;
        if (foundCity) pool = pool.filter(v => v.city.toLowerCase() === foundCity);
        if (foundCategory) pool = pool.filter(v => v.category.includes(foundCategory!) || v.type.includes(foundCategory!));
        if (foundTransmission) pool = pool.filter(v => v.transmission.toLowerCase() === foundTransmission);
        
        const sorted = [...pool].sort((a, b) => a.pricePerDay - b.pricePerDay);
        if (sorted.length === 0) return `I couldn't find any cheap options matching your criteria.`;
        const top3 = sorted.slice(0, 3);
        const listing = top3.map(v => `${v.name} in ${v.city} (₹${v.pricePerDay}/day)`).join(', ');
        return `Here are some of the most affordable ${foundTransmission || ''} options I found: ${listing}.`;
    }

    // 5. Specific Car Details
    if ((lowerText.includes('detail') || lowerText.includes('about') || lowerText.includes('tell me') || lowerText.includes('info')) && specificCar) {
        setChatContext({ topic: 'vehicle', target: specificCar.name });
        return `The ${specificCar.name} is a fantastic ${specificCar.category} by ${specificCar.brand}. It runs on ${specificCar.fuel} (${specificCar.transmission}) and gives a mileage of ${specificCar.mileage}. It seats ${specificCar.seats}. Rental starts at ₹${specificCar.pricePerDay}/day. It includes ${specificCar.features.slice(0, 3).join(', ')}.`;
    }

    // Contextual Follow-up Memory
    if (chatContext.topic === 'vehicle' && (lowerText.includes('where') || lowerText.includes('location') || lowerText.includes('book'))) {
        const memoryCar = vehicles.find(v => v.name === chatContext.target);
        if (memoryCar) {
             setChatContext({});
             return `The ${memoryCar.name} you asked about earlier is available via ${memoryCar.agency} in ${memoryCar.city}. You can find it in our main search page to book it instantly!`;
        }
    }

    // 6. Search by Feature
    if (foundFeature) {
        let pool = vehicles;
        if (foundCity) pool = pool.filter(v => v.city.toLowerCase() === foundCity);
        const matching = pool.filter(v => v.features.some(f => f.toLowerCase().includes(foundFeature as string)));
        if (matching.length > 0) {
            const sample = matching.slice(0, 3).map(v => `${v.name} (${v.city})`).join(', ');
            return `I found ${matching.length} vehicles with ${foundFeature}! For example: ${sample}.`;
        }
    }

    // 7. Agency Search by City
    if (lowerText.includes('agency') || lowerText.includes('agencies') || lowerText.includes('near') || lowerText.includes('company')) {
        if (foundCity) {
            const cityAgencies = agencies.filter(a => a.city.toLowerCase() === foundCity);
            if (cityAgencies.length > 0) {
                const agencyDetails = cityAgencies.map(a => `${a.name} (${a.rating}/5 ⭐)`).join(' | ');
                return `Top agencies in ${foundCity}: ${agencyDetails}.`;
            } else {
                return `Sorry, we don't currently have active agency partnerships mapped in ${foundCity}.`;
            }
        }
        return "Which city are you looking in? (e.g., Delhi, Mumbai, Pune, Goa).";
    }

    // 8. Contextual Category or City Search
    if (foundCity || foundCategory) {
        let pool = vehicles;
        if (foundCity) pool = pool.filter(v => v.city.toLowerCase() === foundCity);
        if (foundCategory) pool = pool.filter(v => v.category.includes(foundCategory!) || v.type.includes(foundCategory!));
        if (foundTransmission) pool = pool.filter(v => v.transmission.toLowerCase() === foundTransmission);

        if (pool.length > 0) {
            const startPrice = Math.min(...pool.map(v => v.pricePerDay));
            const sample = pool.slice(0, 3).map(v => v.name).join(', ');
            return `I found ${pool.length} ${foundTransmission || ''} ${foundCategory || 'vehicles'} in ${foundCity || 'our network'}, starting from just ₹${startPrice}/day. Some popular ones are: ${sample}.`;
        } else {
            return `I couldn't find any matches. Try adjusting your search!`;
        }
    }

    // 9. Help Command
    if (lowerText.includes('help') || lowerText.includes('how to book') || lowerText.includes('how do i') || lowerText.match(/what can you do|who are you/)) {
      return "I can help you with finding car rentals by city, searching for specific car brands (like Tata, Honda, BMW), specific types (SUVs, scooters), getting the best prices, comparing features, checking policies, or finding nearby agencies. Just ask me!";
    }

    // Fallback Explicit
    if (specificCar) {
         setChatContext({ topic: 'vehicle', target: specificCar.name });
         return `We have the ${specificCar.brand} ${specificCar.name} available! Are you looking for its specifications, price, or availability in a certain city?`;
    }

    return "I'm not quite sure I understand. You can ask me to 'compare Nexon and Thar', 'check age limit', 'affordable automatic cars in Goa', or 'details on Ather'.";
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
