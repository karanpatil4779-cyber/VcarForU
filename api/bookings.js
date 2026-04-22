import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

const dbConfig = process.env.DATABASE_URL || {
  host: 'centerbeam.proxy.rlwy.net',
  user: 'root',
  password: 'YGFimxVjfPMOAAfdMnfvbmrVHAdCnUYp',
  port: 41829,
  database: 'railway'
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;
  const { userId, agencyId, vehicleId, amount, paymentMethod, userName, userEmail, vehicleName, brand, city } = req.body;

  try {
    const connection = await getConnection();

    if (req.method === 'POST' && action === 'create') {
      const id = 'VCU' + Math.floor(100000 + Math.random() * 900000);
      await connection.execute(
        'INSERT INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status, user_name, user_email, vehicle_name, brand, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, userId, agencyId, vehicleId, amount, paymentMethod, 'Confirmed', userName, userEmail, vehicleName, brand, city]
      );
      await connection.end();
      return res.status(201).json({ success: true, booking: { id, userId, amount, status: 'Confirmed' } });
    }

    if (req.method === 'GET') {
      const { userId: qUserId, agencyId: qAgencyId } = req.query;
      let query = 'SELECT * FROM bookings';
      const params = [];

      if (qUserId) {
        query += ' WHERE user_id = ?';
        params.push(qUserId);
      } else if (qAgencyId) {
        query += ' WHERE agency_id = ?';
        params.push(qAgencyId);
      }

      query += ' ORDER BY booking_date DESC';

      const [rows] = await connection.execute(query, params);
      await connection.end();
      return res.status(200).json(rows);
    }

    await connection.end();
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}