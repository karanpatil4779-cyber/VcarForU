export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  try {
    if (req.method === 'POST' && action === 'create') {
      const { userId, agencyId, vehicleId, amount, paymentMethod, userName, userEmail, vehicleName, brand, city } = req.body;
      const id = 'VCU' + Math.floor(100000 + Math.random() * 900000);
      res.status(201).json({ 
        success: true, 
        booking: { id, userId, amount, status: 'Confirmed' },
        bookingDetails: { id, userId, agencyId, vehicleId, amount, paymentMethod, userName, userEmail, vehicleName, brand, city }
      });
      return;
    }

    if (req.method === 'GET') {
      res.status(200).json([]);
      return;
    }

    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}