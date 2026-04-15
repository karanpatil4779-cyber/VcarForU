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

  const { action, type } = req.query;

  try {
    const connection = await getConnection();

    if (req.method === 'POST') {
      if (action === 'register') {
        const { name, email, password, phone, city, address, registrationNumber } = req.body;
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
        const { email, password } = req.body;
        
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
    }

    await connection.end();
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
