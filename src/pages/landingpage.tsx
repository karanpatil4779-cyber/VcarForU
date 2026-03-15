import { Link } from 'react-router-dom';
import { Users, Building2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to VCarForU
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose your account type to get started
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
          {/* Customer Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full md:w-96 transform hover:scale-105 transition-transform">
            <div className="flex justify-center mb-4">
              <Users className="w-20 h-20 text-blue-600" />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-4">Customer</h2>
            <p className="text-gray-600 text-center mb-6">
              Rent cars, manage bookings, and explore vehicles
            </p>
            <div className="space-y-3">
              <Link 
                to="/customer-login" 
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition"
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
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full md:w-96 transform hover:scale-105 transition-transform">
            <div className="flex justify-center mb-4">
              <Building2 className="w-20 h-20 text-green-600" />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-4">Agency</h2>
            <p className="text-gray-600 text-center mb-6">
              List vehicles, manage fleet, and track rentals
            </p>
            <div className="space-y-3">
              <Link 
                to="/agency-login" 
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition"
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