import { getConnection } from './db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  try {
    const connection = await getConnection();

    if (req.method === 'POST' && action === 'create') {
      const { userId, agencyId, vehicleId, amount, paymentMethod, userName, userEmail, vehicleName, brand, city } = req.body;
      const id = 'VCU' + Math.floor(100000 + Math.random() * 900000);

      await connection.execute(
        'INSERT INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status, user_name, user_email, vehicle_name, brand, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, userId, agencyId, vehicleId, amount, paymentMethod, 'Confirmed', userName, userEmail, vehicleName, brand, city]
      );

      await connection.end();
      return res.status(201).json({ success: true, booking: { id, userId, agencyId, vehicleId, amount, status: 'Confirmed' } });
    }

    if (req.method === 'GET') {
      const { userId, agencyId } = req.query;
      let query = 'SELECT * FROM bookings';
      const params = [];

      if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
      } else if (agencyId) {
        query += ' WHERE agency_id = ?';
        params.push(agencyId);
      }

      query += ' ORDER BY booking_date DESC';

      const [rows] = await connection.execute(query, params);
      await connection.end();
      return res.status(200).json(rows);
    }

    if (req.method === 'PUT' && action === 'cancel') {
      const { bookingId } = req.body;
      await connection.execute('UPDATE bookings SET status = ? WHERE id = ?', ['Cancelled', bookingId]);
      await connection.end();
      return res.status(200).json({ success: true });
    }

    await connection.end();
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Bookings error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}