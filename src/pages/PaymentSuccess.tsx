import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { getBookingById, getLastBookingId, saveFeedback } from '../utils/bookings';
import { useAuth } from '../context/AuthContext';

const PaymentSuccess = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

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
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full rounded-2xl">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <p className="font-body text-[11px] text-slate-400 tracking-wide mt-6">Secured by PayU &bull; Booking ref stored locally</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
