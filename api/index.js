import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

const dbConfig = {
  host: 'centerbeam.proxy.rlwy.net',
  user: 'root',
  password: 'YGFimxVjfPMOAAfdMnfvbmrVHAdCnUYp',
  port: 41829,
  database: 'railway'
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

app.post('/auth', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, type } = req.query;
  const { name, email, password, phone, city } = req.body;

  let connection;
  try {
    connection = await getConnection();

    if (action === 'register') {
      const id = Date.now().toString();
      
      if (type === 'customer') {
        await connection.execute(
          'INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
          [id, name, email, password, phone]
        );
        await connection.end();
        return res.status(201).json({ success: true, user: { id, name, email, role: 'customer' } });
      } else if (type === 'agency') {
        await connection.execute(
          'INSERT INTO agencies (id, name, email, password, city, contact) VALUES (?, ?, ?, ?, ?)',
          [id, name, email, password, city, phone]
        );
        await connection.end();
        return res.status(201).json({ success: true, user: { id, name, email, role: 'agency' } });
      }
    }

    if (action === 'login') {
      if (type === 'customer') {
        const [rows] = await connection.execute(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password]
        );
        await connection.end();
        if (rows.length > 0) {
          return res.status(200).json({ success: true, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: 'customer' } });
        }
      } else if (type === 'agency') {
        const [rows] = await connection.execute(
          'SELECT * FROM agencies WHERE email = ? AND password = ?',
          [email, password]
        );
        await connection.end();
        if (rows.length > 0) {
          return res.status(200).json({ success: true, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: 'agency' } });
        }
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (connection) await connection.end();
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Auth error:', error);
    if (connection) await connection.end();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/bookings', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;
  const { userId, agencyId, vehicleId, amount, paymentMethod, userName, userEmail, vehicleName, brand, city } = req.body;

  let connection;
  try {
    connection = await getConnection();

    if (action === 'create') {
      const id = 'VCU' + Math.floor(100000 + Math.random() * 900000);
      await connection.execute(
        'INSERT INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status, user_name, user_email, vehicle_name, brand, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, userId, agencyId, vehicleId, amount, paymentMethod, 'Confirmed', userName, userEmail, vehicleName, brand, city]
      );
      await connection.end();
      return res.status(201).json({ success: true, booking: { id, userId, amount, status: 'Confirmed' } });
    }

    if (connection) await connection.end();
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Bookings error:', error);
    if (connection) await connection.end();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/bookings', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { userId, agencyId } = req.query;

  let connection;
  try {
    connection = await getConnection();
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
  } catch (error) {
    console.error('Bookings error:', error);
    if (connection) await connection.end();
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;