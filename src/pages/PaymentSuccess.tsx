import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle2, ArrowRight, Star, MessageCircle, Send, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { getBookingById, getLastBookingId, saveFeedback } from '../utils/bookings';
import { useAuth } from '../context/AuthContext';

const PaymentSuccess = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{from: 'agency'|'customer'; text: string; time: string}[]>([]);
  const [chatInput, setChatInput] = useState('');

  const lastBookingId = getLastBookingId();
  const booking = lastBookingId ? getBookingById(lastBookingId) : null;

  const submitFeedback = () => {
    if (!user || !booking) return;
    saveFeedback({
      bookingId: booking.id,
      userId: user.id,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { from: 'customer', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'agency', text: 'Hi! Thanks for reaching out. How can I help you with your booking?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Payment Successful
          </h1>
          <p className="font-body text-[15px] text-slate-500 leading-relaxed mb-8">
            Your booking has been confirmed. You will receive a confirmation on your registered email.
          </p>

          {booking ? (
            <>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="font-body text-[13px] text-slate-500 tracking-wide">Booking ID</span>
                  <span className="font-heading font-bold text-slate-900">{booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-[13px] text-slate-500 tracking-wide">Vehicle</span>
                  <span className="font-body font-semibold text-slate-900">{booking.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-[13px] text-slate-500 tracking-wide">City</span>
                  <span className="font-body font-semibold text-slate-900">{booking.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-[13px] text-slate-500 tracking-wide">Date</span>
                  <span className="font-body font-semibold text-slate-900">{booking.date}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="font-heading font-bold text-slate-900">Amount Paid</span>
                  <span className="font-heading text-xl font-bold text-primary-600">₹{booking.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-left mb-4">
                <div className="mb-2 font-semibold text-slate-700">Leave feedback for this ride</div>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <button type="button" key={star} onClick={() => setRating(star)} className={`p-2 rounded-full ${rating >= star ? 'bg-amber-200 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Star className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was your ride?" className="w-full border border-slate-200 rounded-xl p-2 mb-3" />
                <button onClick={submitFeedback} disabled={saved} className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
                  {saved ? 'Feedback Saved' : 'Submit Feedback'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-slate-500 mb-4">Unable to load booking details right now.</p>
          )}

          <div className="flex flex-col gap-3">
            <Link to="/dashboard">
              <Button size="lg" className="w-full rounded-2xl shadow-primary-200">
                View Booking <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button onClick={() => setShowChat(true)} size="lg" variant="secondary" className="w-full rounded-2xl">
              <MessageCircle className="w-5 h-5 mr-2" /> Chat with Agency
            </Button>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full rounded-2xl">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <p className="font-body text-[11px] text-slate-400 tracking-wide mt-6">Secured by PayU &bull; Booking ref stored locally</p>
      </div>

      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg h-[600px] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5 text-green-600" /> Chat with Agency</h3>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-3 border-b border-slate-100 bg-green-50">
              <p className="text-sm font-semibold">{booking?.vehicle}</p>
              <p className="text-xs text-slate-500">Booking ID: {booking?.id}</p>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start a conversation with the agency</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.from === 'customer' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] ${msg.from === 'customer' ? 'text-green-100' : 'text-slate-400'} mt-1`}>{msg.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendChatMessage()} placeholder="Type a message..." className="flex-1 p-3 border rounded-xl" />
              <Button onClick={sendChatMessage}><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
