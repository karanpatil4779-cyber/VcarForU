import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const VehicleDetails = lazy(() => import('./pages/VehicleDetails'));
const PayMock = lazy(() => import('./pages/PayMock'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));
const AgencyDashboard = lazy(() => import('./pages/AgencyDashboard'));
const CustomerLogin = lazy(() => import('./pages/CustomerLogin'));
const AgencyLogin = lazy(() => import('./pages/AgencyLogin'));
const CustomerSignup = lazy(() => import('./pages/CustomerSignup'));
const AgencySignup = lazy(() => import('./pages/AgencySignup'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-extrabold tracking-tight text-gray-900">
              VCarForU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Browse Cars
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              {user ? (
                <>
                  <span className="text-sm font-bold text-gray-700">Hi, {user.name.split(' ')[0]}</span>
                  <button
                    onClick={onLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/customer-login" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Customer Login
                  </Link>
                  <Link 
                    to="/agency-login" 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    Agency Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/search" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Browse Cars
            </Link>
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link 
              to="/customer-login" 
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
              onClick={() => setIsOpen(false)}
            >
              Customer Login
            </Link>
            <Link 
              to="/agency-login" 
              className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-green-50"
              onClick={() => setIsOpen(false)}
            >
              Agency Login
            </Link>
            <Link 
              to="/customer-signup" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Customer Sign Up
            </Link>
            <Link 
              to="/agency-signup" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Agency Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Suspense fallback={<div className="p-10 text-center text-blue-600">Loading...</div>}>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/checkout/:id" element={<ProtectedRoute><PayMock /></ProtectedRoute>} />
            <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/payment-failure" element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/agency-dashboard" element={<ProtectedRoute><AgencyDashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />

            {/* Authentication Routes */}
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/agency-login" element={<AgencyLogin />} />
            <Route path="/customer-signup" element={<CustomerSignup />} />
            <Route path="/agency-signup" element={<AgencySignup />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;