import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // CORS Headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ 
      error: "Missing MySQL Connection String", 
      message: "Please configure DATABASE_URL in Vercel Environment Variables" 
    });
  }

  try {
    // Connect to the DB using the connection string from Vercel ENV
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    // Fetch vehicles
    if (req.method === 'GET') {
      const [rows] = await connection.execute('SELECT * FROM vehicles LIMIT 50');
      await connection.end();
      return res.status(200).json(rows);
    }

    await connection.end();
    return res.status(405).json({ message: 'Method Not Allowed' });
    
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: error.message });
  }
}
