import express from 'express';
import { createServer } from 'http';
import { parse } from 'url';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const dbUrl = process.env.DATABASE_URL || 'mysql://root:root123@localhost:3306/vcarforu';

async function getConnection() {
  return await mysql.createConnection(dbUrl);
}

// Auth API
app.post('/api/auth', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, type } = req.query;
  const { name, email, password, phone, city } = req.body;

  try {
    const connection = await getConnection();

    if (action === 'register') {
      const id = uuidv4();
      
      if (type === 'customer') {
        await connection.execute(
          'INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
          [id, name, email, password, phone]
        );
        await connection.end();
        return res.status(201).json({ success: true, user: { id, name, email, role: 'customer' } });
      } else if (type === 'agency') {
        await connection.execute(
          'INSERT INTO agencies (id, name, email, password, city, contact) VALUES (?, ?, ?, ?, ?, ?)',
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

    await connection.end();
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bookings API
app.post('/api/bookings', async (req, res) => {
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

    if (action === 'create') {
      const id = 'VCU' + Math.floor(100000 + Math.random() * 900000);
      await connection.execute(
        'INSERT INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status, user_name, user_email, vehicle_name, brand, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, userId, agencyId, vehicleId, amount, paymentMethod, 'Confirmed', userName, userEmail, vehicleName, brand, city]
      );
      await connection.end();
      return res.status(201).json({ success: true, booking: { id, userId, amount, status: 'Confirmed' } });
    }

    await connection.end();
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { userId, agencyId } = req.query;

  try {
    const connection = await getConnection();
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
    res.status(500).json({ success: false, error: error.message });
  }
});

const server = createServer(app);
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});