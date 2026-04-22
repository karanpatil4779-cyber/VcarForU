
// STATIC DATA FOR VERCEL DEPLOYMENT (NO DB MODE)
const vehicles = [
  {
    id: 'f-1',
    name: 'Fortuner Legender',
    brand: 'Toyota',
    category: 'SUV',
    pricePerDay: 4500,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?auto=format&fit=crop&q=80&w=800',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: 7,
    mileage: '12 kmpl',
    rating: 4.9,
    reviews: 124,
    location: 'Airport Terminal 2',
    city: 'Mumbai',
    features: ['4WD', 'Sunroof', 'Leather Seats', 'Touchscreen'],
    agencyId: 'a-1',
    agency: 'Premium Rentals Mumbai',
    deposit: 15000
  },
  {
    id: 'f-2',
    name: 'Swift VXI',
    brand: 'Maruti Suzuki',
    category: 'Sadan',
    pricePerDay: 1200,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
    transmission: 'Manual',
    fuel: 'Petrol',
    seats: 5,
    mileage: '22 kmpl',
    rating: 4.7,
    reviews: 89,
    location: 'Kothrud Hub',
    city: 'Pune',
    features: ['AC', 'Power Steering', 'USB Port', 'ABS'],
    agencyId: 'a-2',
    agency: 'Pune Express Rentals',
    deposit: 3000
  }
];

export default async function handler(req, res) {
  const { method } = req;
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const searchParams = url.searchParams;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') return res.status(200).end();

  try {
    if (path.includes('/vehicles')) {
        const city = searchParams.get('city');
        let filtered = [...vehicles];
        if (city && city !== 'all') filtered = filtered.filter(v => v.city === city);
        return res.status(200).json(filtered);
    }
    if (path.includes('/bookings')) return res.status(200).json([]);
    return res.status(200).json({ success: true, mode: "Static Demo" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}