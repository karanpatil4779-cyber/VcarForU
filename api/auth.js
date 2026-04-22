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
}