import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageCircle, X, Send, Bot, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vehicles } from '../../data/vehicles';
import { agencies } from '../../data/agencies';

type MessageOption = {
  label: string;
  action?: 'navigate' | 'reply' | 'set_intent' | 'filter' | 'show_location';
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
};

type FAQ = {
  keywords: string[];
  answer: string;
};

const FAQS: FAQ[] = [
  { keywords: ['document', 'required', 'license', 'id'], answer: 'To book with VCarForU, you need: 1) Valid Driving License (min 1 year old), 2) Aadhaar Card / Passport / Voter ID, 3) Debit/Credit card for payment. For international users, passport is mandatory.' },
  { keywords: ['age', 'limit', 'minimum'], answer: 'Minimum age requirement: 21 years for cars (some premium vehicles 23+), 18 years for scooters/bikes. Young driver surcharge may apply for ages 21-25.' },
  { keywords: ['cancel', 'refund', 'policy'], answer: 'Free cancellation up to 24 hours before pickup! Within 24 hours, small cancellation fee applies. Security deposit is fully refunded within 3-5 business days.' },
  { keywords: ['deposit', 'security', 'collateral'], answer: 'Security deposit varies by vehicle: Cars ₹5,000-25,000, Bikes ₹1,000-5,000. Deposit is fully refundable within 3-5 days after vehicle return.' },
  { keywords: ['price', 'rate', 'fare', 'cost'], answer: 'Our prices start from ₹350/day for bikes and ₹1,200/day for cars. Prices vary by vehicle type, duration, and city. Longer rentals get bigger discounts!' },
  { keywords: ['payment', 'pay', 'upi', 'card'], answer: 'We accept all major Credit Cards, Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Wallets. Payment is processed securely.' },
  { keywords: ['help', 'support', 'contact'], answer: 'Need help? Call our 24/7 helpline: 1800-VCAR-FOR-U or email support@vcarforu.com. We respond within 2 hours!' },
  { keywords: ['insurance', 'coverage', 'accident'], answer: 'All bookings include basic insurance! For comprehensive coverage (damage theft protection), add it during booking at just ₹50-150/day extra. Recommended!' },
  { keywords: ['delivery', 'pickup', 'drop'], answer: 'Free doorstep delivery and pickup within city limits! For out-of-city delivery, a small delivery fee applies based on distance.' },
  { keywords: ['fuel', 'petrol', ' diesel'], answer: 'Vehicles are delivered with a full tank. Return with same fuel level to avoid refueling charges. We do free fuel top-up on premium packages!' },
  { keywords: ['unlimited', 'km', 'kilometer'], answer: 'Our STANDARD package includes 100km/day. UPGRADE to UNLIMITED for just ₹200/day more - drive as much as you want!' },
  { keywords: ['offer', 'discount', 'coupon', 'promo'], answer: 'Check our Offers page for latest deals! Use FIRST50 for 50% off your first booking. Refer a friend and earn ₹500!' },
  { keywords: ['compare', 'difference', 'car vs bike'], answer: 'Cars: Best for families, AC, luggage, comfort. Bikes: Best for solo travel, maneuver in traffic, fuel efficient. Choose based on your needs!' },
  { keywords: ['roadside', 'assistance', 'breakdown'], answer: '24/7 Roadside Assistance included! Call the hotline number in your booking confirmation. We\'ll dispatch help within 30 mins in cities.' },
  { keywords: ['long term', 'monthly', 'rental'], answer: 'Monthly rentals available! Get 25-40% discount on long-term bookings. Contact our fleet team for custom monthly packages. Great for business travelers!' },
  { keywords: ['corporate', 'business', 'company'], answer: 'Corporate accounts available with priority support, dedicated fleet manager, and invoicing. Apply on our corporate page!' },
];

const pickupResponses = [
  "Interesting! I can help you find a vehicle, check pricing, or learn about our policies. What would you like?",
  "Got it! Would you like to search for vehicles or get more information?",
  "Sure thing! Let me know what you're looking for - I can help with booking, pricing, or any questions!",
];

function getRandomFallback(): string {
  const index = Math.floor(Math.random() * pickupResponses.length);
  return pickupResponses[index];
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [chatContext, setChatContext] = useState<{ step?: string; city?: string; agency?: string; type?: string; budget?: string; }>({});
  const [showFAQ, setShowFAQ] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Namaste! I'm VCarForU Assistant\n\nI can help you with:\nFinding the perfect vehicle\nBest prices & offers\nDocuments & policies\nSupport & assistance\n\nWhat would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
      options: [
        { label: 'Find a Vehicle', value: 'find_car', action: 'set_intent' },
        { label: 'Documents Needed', value: 'document', action: 'reply' },
        { label: 'Pricing & Offers', value: 'price', action: 'reply' },
        { label: 'Help & Support', value: 'help', action: 'reply' },
      ],
      quickReplies: ['Find a Car', 'Pricing', 'Cancel Policy', 'Contact Support'],
    },
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
      id: uuidv4(),
      text: response.text,
      sender: 'bot',
      timestamp: new Date(),
      options: response.options,
      quickReplies: response.quickReplies,
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: uuidv4(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      processBotResponse(userMsg.text);
    }, 500);
  };

  const handleOptionClick = (opt: MessageOption) => {
    if (opt.action === 'navigate') {
      navigate(opt.value);
      setIsOpen(false);
      return;
    }

    if (opt.action === 'show_location') {
      navigate('/search?city=' + opt.value + '&view=map');
      setIsOpen(false);
      return;
    }

    if (opt.action === 'filter') {
      navigate('/search?city=' + (opt.data?.city as string) + '&type=' + (opt.data?.type as string) + '&price=' + (opt.data?.price as string));
      setIsOpen(false);
      return;
    }

    const userMsg: Message = {
      id: uuidv4(),
      text: opt.label,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      processBotResponse(opt.label, opt.value, opt.action);
    }, 400);
  };

  const handleQuickReply = (text: string) => {
    setInput(text);
    handleSend();
  };

  const generateResponse = useCallback((
    text: string,
    value?: string,
    action?: string
  ): { text: string; options?: MessageOption[]; quickReplies?: string[] } => {
    const lowerText = text.toLowerCase();

    if (lowerText.match(/^(hi|hello|hey|namaste|hola|good|morning|evening|night)/)) {
      return {
        text: "Namaste! Welcome to VCarForU!\n\nI can help you find the best vehicle at great prices. What would you like to do today?",
        options: [
          { label: 'Find Vehicle', value: 'find_car', action: 'set_intent' },
          { label: 'Get Quote', value: 'quote', action: 'set_intent' },
          { label: 'Ask Question', value: 'help', action: 'reply' },
        ],
        quickReplies: ['Find Car', 'Pricing', 'Book Now'],
      };
    }

    if (action === 'set_intent' && value === 'find_car') {
      const uniqueCities = Array.from(new Set(agencies.map(a => a.city)));
      setChatContext({ step: 'select_city' });
      return {
        text: "Great choice!\n\nLet's find your perfect ride.\n\nWhich city are you in?",
        options: uniqueCities.map(c => ({ label: c, value: c, action: 'set_intent' })),
        quickReplies: uniqueCities.slice(0, 4),
      };
    }

    if (chatContext.step === 'select_city' && action === 'set_intent') {
      const city = value || '';
      const cityAgencies = agencies.filter(a => a.city === city);
      setChatContext({ step: 'select_agency', city });
      return {
        text: `Found ${cityAgencies.length} trusted agencies in ${city}!\n\nSelect an agency to see their vehicles:`,
        options: [
          ...cityAgencies.slice(0, 5).map(a => ({
            label: `${a.name} ${a.rating}`,
            value: a.name,
            action: 'set_intent' as const,
            data: { city },
          })),
          { label: 'Show on Map', value: city, action: 'show_location' as const, data: { city } },
        ],
        quickReplies: ['Best Rated', 'Cheapest', 'Show Map'],
      };
    }

    if (chatContext.step === 'select_agency' && action === 'set_intent') {
      const agencyName = value || '';
      const agencyVehicles = vehicles.filter(v => v.agency === agencyName && v.city === chatContext.city);
      setChatContext({ step: 'select_vehicle', city: chatContext.city, agency: agencyName });

      if (agencyVehicles.length === 0) {
        return {
          text: "Sorry! This agency currently has no vehicles in stock.\n\nWould you like to see other options?",
          options: [
            { label: 'Show All in City', value: 'find_car', action: 'set_intent' as const },
            { label: 'Start Over', value: 'restart', action: 'set_intent' as const },
          ],
        };
      }

      return {
        text: `Excellent! ${agencyName} has ${agencyVehicles.length} vehicles available.\n\nSelect one to view details and book:`,
        options: [
          ...agencyVehicles.slice(0, 6).map(v => ({
            label: `${v.name} - ₹${v.pricePerDay}/day`,
            value: `/vehicle/${v.id}`,
            action: 'navigate' as const,
            data: { vehicle: v.name },
          })),
        ],
        quickReplies: ['Budget Option', 'Premium', 'All Types'],
      };
    }

    if (action === 'reply' && value === 'help') {
      return {
        text: "Here's how I can assist you:\n\n1. Booking issues & modifications\n2. Cancellation & refunds\n3. Document verification\n4. Payment problems\n5. Roadside assistance\n\nWhat type of help do you need?",
        options: [
          { label: 'Call Support', value: 'call', action: 'reply' },
          { label: 'Live Chat', value: 'chat', action: 'reply' },
          { label: 'Email Support', value: 'email', action: 'reply' },
        ],
        quickReplies: ['Call Now', 'Email', 'Cancel Booking'],
      };
    }

    for (const faq of FAQS) {
      if (faq.keywords.some(k => lowerText.includes(k))) {
        return {
          text: faq.answer,
          options: [
            { label: 'Book Now', value: 'find_car', action: 'set_intent' },
            { label: 'More Help', value: 'help', action: 'reply' },
          ],
          quickReplies: ['Book Vehicle', 'Talk to Agent'],
        };
      }
    }

    if (lowerText.includes('location') || lowerText.includes('map') || lowerText.includes('near')) {
      const uniqueCities = Array.from(new Set(agencies.map(a => a.city)));
      const mentionedCity = uniqueCities.find(c => lowerText.includes(c.toLowerCase()));
      
      if (mentionedCity) {
        return {
          text: `Here are agencies in ${mentionedCity}!`,
          options: [
            { label: 'Show on Map', value: mentionedCity, action: 'show_location', data: { city: mentionedCity } },
            { label: 'See Vehicles', value: mentionedCity, action: 'filter', data: { city: mentionedCity } },
          ],
        };
      }

      return {
        text: "We operate in multiple cities!\n\nWhich city would you like to see?",
        options: uniqueCities.map(c => ({ label: c, value: c, action: 'show_location', data: { city: c } })),
      };
    }

    if (lowerText.includes('cheap') || lowerText.includes('affordable') || lowerText.includes('budget')) {
      const cheapVehicles = [...vehicles].sort((a, b) => a.pricePerDay - b.pricePerDay).slice(0, 5);
      setChatContext({ step: 'budget_select' });
      return {
        text: "Here are our budget-friendly options!\n\nBest value vehicles starting from just ₹350/day:",
        options: cheapVehicles.map(v => ({
          label: `${v.name} - ₹${v.pricePerDay}/day`,
          value: `/vehicle/${v.id}`,
          action: 'navigate',
        })),
      };
    }

    if (lowerText.includes('premium') || lowerText.includes('luxury') || lowerText.includes('high-end')) {
      const premiumVehicles = vehicles.filter(v => v.pricePerDay > 3000).slice(0, 5);
      return {
        text: "Looking for premium experience!\n\nOur luxury fleet:",
        options: premiumVehicles.map(v => ({
          label: `${v.name} - ₹${v.pricePerDay}/day`,
          value: `/vehicle/${v.id}`,
          action: 'navigate',
        })),
      };
    }

    if (lowerText.includes('booking') || lowerText.includes('my ride') || lowerText.includes('reservation')) {
      return {
        text: "To check your booking status, please go to your Dashboard.\n\nThere you can see:\n- Active bookings\n- Ride history\n- Cancel modifications\n\nWould you like to go to Dashboard?",
        options: [
          { label: 'Go to Dashboard', value: '/dashboard', action: 'navigate' },
          { label: 'New Booking', value: 'find_car', action: 'set_intent' },
        ],
      };
    }

    if (lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('complaint')) {
      return {
        text: "I'm sorry to hear about your experience.\n\nPlease describe your issue and our team will resolve it within 2 hours.\n\nAlternatively, call our 24/7 helpline: 1800-VCAR-FOR-U",
        options: [
          { label: 'Call Helpline', value: 'call', action: 'reply' },
          { label: 'Email Support', value: 'email', action: 'reply' },
        ],
      };
    }

    if (lowerText.includes('thank') || lowerText.includes('thanks') || lowerText.includes('nice')) {
      return {
        text: "You're welcome! Happy to help!\n\nAnything else I can assist you with?",
        options: [
          { label: 'Find Vehicle', value: 'find_car', action: 'set_intent' },
          { label: 'More Questions', value: 'help', action: 'reply' },
        ],
        quickReplies: ['Yes', 'No thanks'],
      };
    }

    if (lowerText.includes('bye') || lowerText.includes('exit') || lowerText.includes('close')) {
      return {
        text: "Thank you for choosing VCarForU!\n\nSafe travels and see you soon!",
      };
    }

    return {
      text: getRandomFallback(),
      options: [
        { label: 'Find Vehicle', value: 'find_car', action: 'set_intent' },
        { label: 'Check Pricing', value: 'price', action: 'reply' },
        { label: 'Policies', value: 'cancel', action: 'reply' },
      ],
      quickReplies: ['Find Car', 'Pricing', 'Policies'],
    };
  }, [chatContext]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-[420px] flex flex-col overflow-hidden border border-gray-100 h-[600px] transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8" />
                <span className="absolute -bottom-1 -right-1 bg-green-400 h-3 w-3 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg">VCarForU Assistant</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setShowFAQ(!showFAQ)} 
                className="text-blue-100 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="FAQ"
              >
                <FileText className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-blue-100 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {showFAQ && (
            <div className="bg-gray-50 border-b border-gray-200 p-3 max-h-48 overflow-y-auto">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Answers</h4>
              <div className="grid grid-cols-1 gap-1">
                {FAQS.slice(0, 8).map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(faq.keywords[0]); handleSend(); setShowFAQ(false); }}
                    className="text-left text-xs px-2 py-1.5 rounded bg-white hover:bg-blue-50 text-gray-700 transition-colors"
                  >
                    {faq.keywords[0].charAt(0).toUpperCase() + faq.keywords[0].slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[90%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                
                {msg.sender === 'bot' && msg.options && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%] pl-1">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        className="text-left bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs px-3 py-1.5 rounded-xl transition-colors font-medium shadow-sm active:scale-95"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%] pl-1">
                    {msg.quickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(qr)}
                        className="text-xs px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                      >
                        {qr}
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
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">1</span>
        </button>
      )}
    </div>
  );
}