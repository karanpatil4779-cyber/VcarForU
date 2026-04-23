import mysql from 'mysql2/promise';

async function seedBookings() {
  const dbUrl = 'mysql://root:YGFimxVjfPMOAAfdMnfvbmrVHAdCnUYp@centerbeam.proxy.rlwy.net:41829/railway';
  const connection = await mysql.createConnection(dbUrl);
  
  console.log('Inserting bookings...');
  
  await connection.execute(`INSERT IGNORE INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status, user_name, user_email, vehicle_name, brand, city, booking_date) VALUES 
  ('b-k1', 'u-karan', 'a-1', 'v-2', 3600, 'upi', 'Confirmed', 'Karan Patil', 'karan@patil.com', 'Hyundai Creta', 'Hyundai', 'Mumbai', '2026-04-20'),
  ('b-k2', 'u-karan', 'a-1', 'v-7', 5000, 'card', 'Confirmed', 'Karan Patil', 'karan@patil.com', 'Mahindra Thar', 'Mahindra', 'Mumbai', '2026-04-25'),
  ('b-s1', 'u-sujal', 'a-2', 'v-3', 3200, 'upi', 'Confirmed', 'Sujal Patil', 'sujal@patil.com', 'Honda City', 'Honda', 'Delhi', '2026-04-18'),
  ('b-s2', 'u-sujal', 'a-3', 'v-5', 1500, 'card', 'Completed', 'Sujal Patil', 'sujal@patil.com', 'Royal Enfield Classic', 'Royal Enfield', 'Goa', '2026-04-10'),
  ('b-d1', 'u-dhaval', 'a-1', 'v-1', 3000, 'upi', 'Confirmed', 'Dhaval Patil', 'dhaval@patil.com', 'Tata Nexon', 'Tata', 'Mumbai', '2026-04-22'),
  ('b-d2', 'u-dhaval', 'a-2', 'v-4', 1200, 'card', 'Completed', 'Dhaval Patil', 'dhaval@patil.com', 'Maruti Swift', 'Maruti', 'Delhi', '2026-04-15'),
  ('b-a1', 'u-abhay', 'a-3', 'v-6', 500, 'upi', 'Confirmed', 'Abhay Pawar', 'abhay@pawar.com', 'Honda Activa', 'Honda', 'Goa', '2026-04-28'),
  ('b-a2', 'u-abhay', 'a-1', 'v-2', 3600, 'card', 'Completed', 'Abhay Pawar', 'abhay@pawar.com', 'Hyundai Creta', 'Hyundai', 'Mumbai', '2026-04-12')`);
  
  console.log('✅ Bookings inserted for Karan, Sujal, Dhaval, Abhay!');
  await connection.end();
}

seedBookings();