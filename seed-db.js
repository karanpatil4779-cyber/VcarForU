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

    // 1. Insert 2 Users
    await connection.execute(`
      INSERT IGNORE INTO users (id, name, email, password, phone) VALUES 
      ('u-1', 'John Doe', 'john@example.com', 'hashedpassword', '9876543210'),
      ('u-2', 'Jane Smith', 'jane@example.com', 'hashedpassword', '9123456780')
    `);

    // 2. Insert 3 Agencies
    await connection.execute(`
      INSERT IGNORE INTO agencies (id, name, email, password, city, contact, rating, fleet_size) VALUES 
      ('a-1', 'Zoom Wheels', 'zoom@wheels.com', 'pass', 'Mumbai', '9988776655', 4.8, 120),
      ('a-2', 'DriveIt', 'contact@driveit.in', 'pass', 'Delhi', '8899001122', 4.5, 80),
      ('a-3', 'Goa Rides', 'booking@goarides.com', 'pass', 'Goa', '7788990011', 4.9, 45)
    `);

    // 3. Insert 8 Vehicles
    await connection.execute(`
      INSERT IGNORE INTO vehicles (id, agency_id, name, brand, category, type, fuel, transmission, seats, mileage, price_per_day, deposit, city) VALUES 
      ('v-1', 'a-1', 'Tata Nexon', 'Tata', 'suv', 'car', 'Petrol', 'Automatic', 5, '17 kmpl', 1500, 3000, 'Mumbai'),
      ('v-2', 'a-1', 'Hyundai Creta', 'Hyundai', 'suv', 'car', 'Diesel', 'Manual', 5, '21 kmpl', 1800, 4000, 'Mumbai'),
      ('v-3', 'a-2', 'Honda City', 'Honda', 'sedan', 'car', 'Petrol', 'Automatic', 5, '18 kmpl', 1600, 3500, 'Delhi'),
      ('v-4', 'a-2', 'Maruti Swift', 'Maruti', 'hatchback', 'car', 'Petrol', 'Manual', 5, '23 kmpl', 1200, 2500, 'Delhi'),
      ('v-5', 'a-3', 'Royal Enfield Classic', 'Royal Enfield', 'cruiser', 'bike', 'Petrol', 'Manual', 2, '35 kmpl', 800, 1500, 'Goa'),
      ('v-6', 'a-3', 'Honda Activa', 'Honda', 'scooter', 'bike', 'Petrol', 'Automatic', 2, '45 kmpl', 400, 1000, 'Goa'),
      ('v-7', 'a-1', 'Mahindra Thar', 'Mahindra', 'suv', 'car', 'Diesel', 'Manual', 4, '15 kmpl', 2500, 5000, 'Mumbai'),
      ('v-8', 'a-2', 'Toyota Innova', 'Toyota', 'suv', 'car', 'Diesel', 'Automatic', 7, '14 kmpl', 2200, 5000, 'Delhi')
    `);

    // 4. Insert 2 Bookings
    await connection.execute(`
      INSERT IGNORE INTO bookings (id, user_id, agency_id, vehicle_id, amount, payment_method, status) VALUES 
      ('b-1', 'u-1', 'a-1', 'v-1', 4500, 'upi', 'Confirmed'),
      ('b-2', 'u-2', 'a-3', 'v-6', 1400, 'card', 'Completed')
    `);

    console.log("✅ 15 records inserted successfully!");

  } catch (err) {
    console.error("❌ SQL ERROR:", err);
  } finally {
    if (connection) await connection.end();
  }
}

seedDB();
