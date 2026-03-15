import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookingsByUser, getFeedbackByUser } from '../utils/bookings';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-md text-center">
          <h1 className="text-2xl font-bold">Please login to access your dashboard</h1>
          <p className="text-slate-500 mt-2">You can log in from the home screen.</p>
          <div className="mt-4">
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'agency') {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-500">Agency Portal</p>
              <h1 className="text-3xl font-black text-slate-900 mt-2">Welcome back, {user.name}</h1>
              <p className="text-slate-500 mt-1">Manage your fleet and vehicles in your agency dashboard.</p>
            </div>
            <Button onClick={() => navigate('/agency-dashboard')}>Go to Agency Dashboard</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs uppercase tracking-wide font-bold text-blue-700">Your Agency</p>
              <p className="text-xl font-black mt-2">{user.name}</p>
              <p className="text-slate-500 text-sm">Use the agency dashboard to add vehicles and monitor bookings.</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <p className="text-xs uppercase tracking-wide font-bold text-emerald-700">Quick Note</p>
              <p className="mt-1 text-sm text-slate-600">Your agency page is now separate from the customer dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bookings = getBookingsByUser(user.id);
  const feedbacks = getFeedbackByUser(user.id);
  const totalSpend = bookings.reduce((sum, b) => sum + b.amount, 0);
  const completed = bookings.filter((b) => b.status === 'Confirmed').length;
  const avgSpend = bookings.length ? Math.round(totalSpend / bookings.length) : 0;
  const cityCounts = bookings.reduce<Record<string, number>>((acc, ride) => {
    acc[ride.city] = (acc[ride.city] || 0) + 1;
    return acc;
  }, {});
  const mostBookedCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-500">Customer Dashboard</p>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Hello, {user.name}</h1>
            <p className="text-slate-500 mt-1">Your ride history, spending analysis and feedback all in one place.</p>
          </div>
          <Button onClick={() => navigate('/search')}>Book a New Ride</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Total Trips</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{bookings.length}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Total Spent</p>
            <p className="text-3xl font-black text-slate-900 mt-1">₹{totalSpend.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Avg per Ride</p>
            <p className="text-3xl font-black text-slate-900 mt-1">₹{avgSpend.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Recent Rides</p>
                <h2 className="text-xl font-black text-slate-900 mt-1">Ride History</h2>
                <p className="text-slate-500 text-sm mt-1">{bookings.length} rides total</p>
              </div>
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-xl">{completed} confirmed</span>
            </div>
            {bookings.length === 0 ? (
              <div className="mt-4 border border-dashed border-slate-300 rounded-xl p-4 text-center text-slate-500">No rides yet. Book your first ride now.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {bookings.slice(-5).reverse().map((ride) => (
                  <div key={ride.id} className="bg-white border border-slate-200 rounded-xl p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-slate-800">{ride.vehicle}</p>
                        <p className="text-xs text-slate-500">{ride.city}  {ride.date}</p>
                      </div>
                      <p className="font-black text-sm text-primary-600">₹{ride.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Status: <strong className="text-slate-700">{ride.status}</strong></span>
                      {getFeedbackByUser(user.id).find((f) => f.bookingId === ride.id) ? (
                        <span className="text-emerald-600 font-bold">Feedback submitted</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">Awaiting feedback</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h3 className="text-xl font-black text-slate-900">Experience Insights</h3>
            <p className="text-slate-500 mt-1">Quick performance at a glance from your ride activity.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Most booked city</p>
                <p className="font-black text-slate-900 mt-1">{mostBookedCity}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Feedback count</p>
                <p className="font-black text-slate-900 mt-1">{feedbacks.length}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-3 bg-white">
              <p className="text-sm font-semibold text-slate-700">Tip:</p>
              <p className="text-xs text-slate-500 mt-1">After each ride, submit feedback from the success page to keep your profile quality high.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
