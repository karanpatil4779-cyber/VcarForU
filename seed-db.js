import mysql from 'mysql2/promise';

async function seedDB() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ ERROR: DATABASE_URL not set.");
    process.exit(1);
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbUrl);
    console.log("⏳ Connected to DB. Inserting mock data...");

    // 1. Insert Users (Karan, Sujal, Dhaval, Abhay)
    await connection.execute(`
      INSERT IGNORE INTO users (id, name, email, password, phone) VALUES 
      ('u-karan', 'Karan Patil', 'karan@patil.com', 'password123', '9876543210'),
      ('u-sujal', 'Sujal Patil', 'sujal@patil.com', 'password123', '9876543211'),
      ('u-dhaval', 'Dhaval Patil', 'dhaval@patil.com', 'password123', '9876543212'),
      ('u-abhay', 'Abhay Pawar', 'abhay@pawar.com', 'password123', '9876543213')
    `);
    console.log("✅ Users inserted: Karan Patil, Sujal Patil, Dhaval Patil, Abhay Pawar");

    // 2. Insert 3 Agencies
    await connection.execute(`
      INSERT IGNORE INTO agencies (id, name, email, password, city, contact, rating, fleet_size) VALUES 
      ('a-1', 'Zoom Wheels', 'zoom@wheels.com', 'Mumbai', '9988776655', 4.8, 120),
      ('a-2', 'DriveIt', 'contact@driveit.in', 'Delhi', '8899001122', 4.5, 80),
      ('a-3', 'Goa Rides', 'booking@goarides.com', 'Goa', '7788990011', 4.9, 45)
    `);

    // 3. Insert 8 Vehicles
    await connection.execute(`
      INSERT IGNORE INTO vehicles (id, agency_id, name, brand, category, type, fuel, transmission, seats, mileage, price_per_km, deposit, city) VALUES 
      ('v-1', 'a-1', 'Tata Nexon', 'Tata', 'suv', 'car', 'Petrol', 'Automatic', 5, '17 kmpl', 15, 3000, 'Mumbai'),
      ('v-2', 'a-1', 'Hyundai Creta', 'Hyundai', 'suv', 'car', 'Diesel', 'Manual', 5, '21 kmpl', 18, 4000, 'Mumbai'),
      ('v-3', 'a-2', 'Honda City', 'Honda', 'sedan', 'car', 'Petrol', 'Automatic', 5, '18 kmpl', 16, 3500, 'Delhi'),
      ('v-4', 'a-2', 'Maruti Swift', 'Maruti', 'hatchback', 'car', 'Petrol', 'Manual', 5, '23 kmpl', 12, 2500, 'Delhi'),
      ('v-5', 'a-3', 'Royal Enfield Classic', 'Royal Enfield', 'cruiser', 'bike', 'Petrol', 'Manual', 2, '35 kmpl', 10, 1500, 'Goa'),
      ('v-6', 'a-3', 'Honda Activa', 'Honda', 'scooter', 'bike', 'Petrol', 'Automatic', 2, '45 kmpl', 5, 1000, 'Goa'),
      ('v-7', 'a-1', 'Mahindra Thar', 'Mahindra', 'suv', 'car', 'Diesel', 'Manual', 4, '15 kmpl', 25, 5000, 'Mumbai'),
      ('v-8', 'a-2', 'Toyota Innova', 'Toyota', 'suv', 'car', 'Diesel', 'Automatic', 7, '14 kmpl', 22, 5000, 'Delhi')
    `);

    // 4. Insert Bookings for each user
    await connection.execute(`
      INSERT IGNORE INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status, user_name, user_email, vehicle_name, brand, city, booking_date) VALUES 
      ('b-k1', 'u-karan', 'a-1', 'v-2', 3600, 'upi', 'Confirmed', 'Karan Patil', 'karan@patil.com', 'Hyundai Creta', 'Hyundai', 'Mumbai', '2026-04-20'),
      ('b-k2', 'u-karan', 'a-1', 'v-7', 5000, 'card', 'Confirmed', 'Karan Patil', 'karan@patil.com', 'Mahindra Thar', 'Mahindra', 'Mumbai', '2026-04-25'),
      ('b-s1', 'u-sujal', 'a-2', 'v-3', 3200, 'upi', 'Confirmed', 'Sujal Patil', 'sujal@patil.com', 'Honda City', 'Honda', 'Delhi', '2026-04-18'),
      ('b-s2', 'u-sujal', 'a-3', 'v-5', 1500, 'card', 'Completed', 'Sujal Patil', 'sujal@patil.com', 'Royal Enfield Classic', 'Royal Enfield', 'Goa', '2026-04-10'),
      ('b-d1', 'u-dhaval', 'a-1', 'v-1', 3000, 'upi', 'Confirmed', 'Dhaval Patil', 'dhaval@patil.com', 'Tata Nexon', 'Tata', 'Mumbai', '2026-04-22'),
      ('b-d2', 'u-dhaval', 'a-2', 'v-4', 1200, 'card', 'Completed', 'Dhaval Patil', 'dhaval@patil.com', 'Maruti Swift', 'Maruti', 'Delhi', '2026-04-15'),
      ('b-a1', 'u-abhay', 'a-3', 'v-6', 500, 'upi', 'Confirmed', 'Abhay Pawar', 'abhay@pawar.com', 'Honda Activa', 'Honda', 'Goa', '2026-04-28'),
      ('b-a2', 'u-abhay', 'a-1', 'v-2', 3600, 'card', 'Completed', 'Abhay Pawar', 'abhay@pawar.com', 'Hyundai Creta', 'Hyundai', 'Mumbai', '2026-04-12')
    `);
    console.log("✅ Bookings inserted for all 4 users");

    console.log("✅ All data inserted successfully!");

  } catch (err) {
    console.error("❌ SQL ERROR:", err);
  } finally {
    if (connection) await connection.end();
  }
}

seedDB();
