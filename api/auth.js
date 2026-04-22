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
    if (action === 'register') {
      const users = JSON.parse(req.headers.get('x-user-data') || '[]');
      const newUser = { id: Date.now().toString(), name, email, password, phone, role: type === 'customer' ? 'customer' : 'agency', city };
      res.status(201).json({ success: true, user: newUser });
      return;
    }

    if (action === 'login') {
      const users = [{ id: '1', email: 'test@test.com', password: 'test123', name: 'Test User', role: 'customer' }];
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials. Use test@test.com / test123' });
      }
      return;
    }

    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}