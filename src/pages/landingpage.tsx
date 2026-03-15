import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Sun, Moon } from 'lucide-react';

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-900'}`}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-4">
          <button onClick={() => setDarkMode((prev) => !prev)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold border ${darkMode ? 'border-slate-600 bg-slate-800 text-slate-100' : 'border-blue-300 bg-white text-slate-700'}`}>
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>
            Welcome to VCarForU
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Choose your account type to get started
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
          {/* Customer Card */}
          <div className={`rounded-xl p-8 w-full md:w-96 transform transition duration-300 ${darkMode ? 'bg-slate-800 text-slate-100 shadow-2xl shadow-slate-900/20 hover:-translate-y-0.5' : 'bg-white text-slate-800 shadow-2xl hover:-translate-y-0.5'}`}>
            <div className="flex justify-center mb-4">
              <Users className={`w-20 h-20 ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`} />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-4">Customer</h2>
            <p className="text-gray-600 text-center mb-6">
              Rent cars, manage bookings, and explore vehicles
            </p>
            <div className="space-y-3">
              <Link 
                to="/customer-login" 
                className={`block w-full text-center py-3 rounded-lg transition ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Customer Login
              </Link>
              <Link 
                to="/customer-signup" 
                className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Create Customer Account
              </Link>
            </div>
          </div>

          {/* Agency Card */}
          <div className={`rounded-xl p-8 w-full md:w-96 transform transition duration-300 ${darkMode ? 'bg-slate-800 text-slate-100 shadow-2xl shadow-slate-900/20 hover:-translate-y-0.5' : 'bg-white text-slate-800 shadow-2xl hover:-translate-y-0.5'}`}>
            <div className="flex justify-center mb-4">
              <Building2 className={`w-20 h-20 ${darkMode ? 'text-emerald-300' : 'text-green-600'}`} />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-4">Agency</h2>
            <p className="text-gray-600 text-center mb-6">
              List vehicles, manage fleet, and track rentals
            </p>
            <div className="space-y-3">
              <Link 
                to="/agency-login" 
                className={`block w-full text-center py-3 rounded-lg transition ${darkMode ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                Agency Login
              </Link>
              <Link 
                to="/agency-signup" 
                className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Register Your Agency
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;