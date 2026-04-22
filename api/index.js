import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'centerbeam.proxy.rlwy.net',
  user: 'root',
  password: 'YGFimxVjfPMOAAfdMnfvbmrVHAdCnUYp',
  port: 41829,
  database: 'railway'
};

async function getConnection() {
  return await mysql.createConnection(process.env.DATABASE_URL || dbConfig);
}

export default async function handler(req, context) {
  // Extract info from request (Vercel/Netlify compatible check)
  const method = req.method;
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/index/, '').replace(/^\/api/, '');
  const searchParams = url.searchParams;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let body = {};
  if (method === 'POST') {
    try {
      const raw = await req.text();
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      body = {};
    }
  }

  try {
    const connection = await getConnection();

    // AUTH ENDPOINT
    if (path.includes('/auth')) {
      const action = searchParams.get('action');
      const type = searchParams.get('type');
      const { name, email, password, phone, city } = body;

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
        return { statusCode: 201, headers, body: JSON.stringify({ success: true, user: { id, name, email, role: type } }) };
      }

      if (action === 'login') {
        let rows = [];
        if (type === 'customer') {
          [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
          );
        } else if (type === 'agency') {
          [rows] = await connection.execute(
            'SELECT * FROM agencies WHERE email = ? AND password = ?',
            [email, password]
          );
        }
        await connection.end();
        if (rows.length > 0) {
          const user = rows[0];
          return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
              success: true, 
              user: { id: user.id, name: user.name, email: user.email, role: type } 
            }) 
          };
        }
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid credentials' }) };
      }
    }

    // BOOKINGS ENDPOINT
    if (path.includes('/bookings')) {
      if (method === 'POST') {
        const { userId, agencyId, vehicleId, amount, paymentMethod, userName, userEmail, vehicleName, brand, city } = body;
        const id = 'VCU' + Math.floor(100000 + Math.random() * 900000);
        await connection.execute(
          'INSERT INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status, user_name, user_email, vehicle_name, brand, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, userId, agencyId, vehicleId, amount, paymentMethod, 'Confirmed', userName, userEmail, vehicleName, brand, city]
        );
        await connection.end();
        return { statusCode: 201, headers, body: JSON.stringify({ success: true, booking: { id, userId, amount, status: 'Confirmed' } }) };
      }

      if (method === 'GET') {
        const userId = searchParams.get('userId');
        const agencyId = searchParams.get('agencyId');
        let query = 'SELECT * FROM bookings';
        const params = [];

        if (userId) {
          query += ' WHERE user_id = ?';
          params.push(userId);
        } else if (agencyId) {
          query += ' WHERE agency_id = ?';
          params.push(agencyId);
        }

        query += ' ORDER BY id DESC';
        const [rows] = await connection.execute(query, params);
        await connection.end();
        return { statusCode: 200, headers, body: JSON.stringify(rows) };
      }
    }

    // VEHICLES ENDPOINT
    if (path.includes('/vehicles')) {
      if (method === 'GET') {
        const agencyId = searchParams.get('agencyId');
        const city = searchParams.get('city');
        let query = 'SELECT id, agency_id as agencyId, name, brand, category, type, fuel, transmission, seats, mileage, price_per_day as pricePerDay, deposit, city, location, image_url as image, rating FROM vehicles';
        const params = [];

        if (agencyId) {
          query += ' WHERE agency_id = ?';
          params.push(agencyId);
        } else if (city) {
          query += ' WHERE city = ?';
          params.push(city);
        }

        const [rows] = await connection.execute(query, params);
        await connection.end();
        return { statusCode: 200, headers, body: JSON.stringify(rows) };
      }

      if (method === 'POST') {
        const v = body;
        const id = v.id || Date.now().toString();
        await connection.execute(
          'INSERT INTO vehicles (id, agency_id, name, brand, category, type, fuel, transmission, seats, mileage, price_per_day, deposit, location, city, image_url, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, v.agencyId, v.name, v.brand, v.category, v.type, v.fuel, v.transmission, v.seats, v.mileage, v.pricePerDay, v.deposit, v.location, v.city, v.image, v.rating || 4.5]
        );
        await connection.end();
        return { statusCode: 201, headers, body: JSON.stringify({ success: true, id }) };
      }
    }

    await connection.end();
    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (error) {
    console.error('API error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) };
  }
}