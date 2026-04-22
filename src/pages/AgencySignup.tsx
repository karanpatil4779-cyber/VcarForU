import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AgencySignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    agencyName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    registrationNumber: '',
    gstNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agencyName.trim() || !formData.ownerName.trim() || !formData.email.trim() || !formData.registrationNumber.trim() || !formData.address.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth?action=register&type=agency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.agencyName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          city: formData.address.trim(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Agency registered successfully. Redirecting to login...');
        setTimeout(() => navigate('/agency-login'), 1200);
      } else {
        setError(data.message || data.error || 'Registration failed');
      }
    } catch {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-5">
          <Building2 className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Agency Registration</h1>
          <p className="text-gray-600">Register your fleet and start listing vehicles.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Agency Name</label>
              <input
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                required
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="ABC Rentals"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                required
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="agency@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="w-full mt-1 border rounded-lg px-3 py-2"
              placeholder="Business address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                required
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="REG123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GST Number (optional)</label>
              <input
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="GSTIN123456"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
            {isLoading ? 'Registering...' : 'Register Agency'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/agency-login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AgencySignup;