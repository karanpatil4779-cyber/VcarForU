export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `https://${req.headers.get('host')}`);
  const action = url.searchParams.get('action');
  const type = url.searchParams.get('type');
  
  let body = {};
  try {
    const rawBody = await req.text();
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch (e) {
    body = {};
  }

  const { name, email, password, phone, city } = body;

  try {
    if (action === 'register') {
      const newUser = { 
        id: Date.now().toString(), 
        name, 
        email, 
        password, 
        phone, 
        role: type === 'customer' ? 'customer' : 'agency', 
        city 
      };
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