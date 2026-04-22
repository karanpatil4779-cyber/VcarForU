import mysql from 'mysql2/promise';

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

const apiHandler = async (req, res) => {
  const url = new URL(req.url, `https://${req.headers.get('host')}`);
  const path = url.pathname;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let body = {};
  try {
    const raw = await req.text();
    body = raw ? JSON.parse(raw) : {};
  } catch (e) {
    body = {};
  }

  try {
    if (path.endsWith('/auth') || path === '/auth') {
      const { action, type } = url.searchParams;
      const { name, email, password, phone, city } = body;

      let connection = await getConnection();

      if (action === 'register') {
        const id = Date.now().toString();
        if (type === 'customer') {
          await connection.execute(
            'INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
            [id, name, email, password, phone]
          );
        } else if (type === 'agency') {
          await connection.execute(
            'INSERT INTO agencies (id, name, email, password, city, contact) VALUES (?, ?, ?, ?, ?)',
            [id, name, email, password, city, phone]
          );
        }
        await connection.end();
        res.status(201).json({ success: true, user: { id, name, email, role: type } });
        return;
      }

      if (action === 'login') {
        if (type === 'customer') {
          const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
          );
          await connection.end();
          if (rows.length > 0) {
            res.status(200).json({ success: true, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: 'customer' } });
            return;
          }
        } else if (type === 'agency') {
          const [rows] = await connection.execute(
            'SELECT * FROM agencies WHERE email = ? AND password = ?',
            [email, password]
          );
          await connection.end();
          if (rows.length > 0) {
            res.status(200).json({ success: true, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: 'agency' } });
            return;
          }
        }
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }
    }

    if (path.endsWith('/bookings') || path === '/bookings') {
      const { action } = url.searchParams;

      let connection = await getConnection();

      if (req.method === 'POST' && action === 'create') {
        const { userId, agencyId, vehicleId, amount, paymentMethod, userName, userEmail, vehicleName, brand, city } = body;
        const id = 'VCU' + Math.floor(100000 + Math.random() * 900000);
        await connection.execute(
          'INSERT INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status, user_name, user_email, vehicle_name, brand, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, userId, agencyId, vehicleId, amount, paymentMethod, 'Confirmed', userName, userEmail, vehicleName, brand, city]
        );
        await connection.end();
        res.status(201).json({ success: true, booking: { id, userId, amount, status: 'Confirmed' } });
        return;
      }

      if (req.method === 'GET') {
        const { userId, agencyId } = url.searchParams;
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
        res.status(200).json(rows);
        return;
      }
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default apiHandler;