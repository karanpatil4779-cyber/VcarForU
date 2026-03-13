import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import Button from './components/ui/Button';

// Import Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import VehicleDetails from './pages/VehicleDetails';
import PayMock from './pages/PayMock';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-xl shadow-sm">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">vCar<span className="text-primary-600">U</span></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="font-body text-[13px] font-medium tracking-wide text-slate-600 hover:text-primary-600 transition-colors">Browse Vehicles</Link>
            <Link to="/search" className="font-body text-[13px] font-medium tracking-wide text-slate-600 hover:text-primary-600 transition-colors">Cities</Link>
            <Link to="/dashboard" className="font-body text-[13px] font-medium tracking-wide text-slate-600 hover:text-primary-600 transition-colors">Agency Portal</Link>
            <div className="w-px h-6 bg-slate-200" />
            <Link to="/login" className="font-body text-[13px] font-medium tracking-wide text-slate-600 hover:text-primary-600 transition-colors">Login</Link>
            <Button size="sm" className="shadow-primary-200">Get Started</Button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass animate-fade-in border-b border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link to="/search" className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:text-primary-600">Browse Vehicles</Link>
            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:text-primary-600">Agency Portal</Link>
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:text-primary-600">Login</Link>
            <Button className="w-full mt-2">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/checkout/:id" element={<PayMock />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/map" element={<SearchResults />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        
        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-8 w-8 text-primary-400" />
                <span className="font-heading text-3xl font-extrabold tracking-tight">vCarU</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                The most reliable platform for car and bike rentals. Connecting you with premium agencies worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/search" className="hover:text-primary-400">Search</Link></li>
                <li><Link to="/map" className="hover:text-primary-400">Map</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-400">Agencies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>support@vcaru.com</li>
                <li>+1 (555) 000-0000</li>
                <li>123 Drive St, Auto City</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            © 2026 vCarU Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
