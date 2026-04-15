-- VCarForU Database Schema

-- 1. Users Table (Customers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Agencies Table (Car Owners / Partners)
CREATE TABLE IF NOT EXISTS agencies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    contact VARCHAR(20),
    rating DECIMAL(3, 1) DEFAULT 4.0,
    fleet_size INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(50) PRIMARY KEY,
    agency_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,     
    fuel VARCHAR(20),
    transmission VARCHAR(20),
    seats INT,
    mileage VARCHAR(20),
    price_per_day INT NOT NULL,
    price_per_hour INT,
    deposit INT NOT NULL,
    city VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    image_url TEXT,
    rating DECIMAL(3, 1) DEFAULT 4.5,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

-- 4. Vehicle Features Mapping
CREATE TABLE IF NOT EXISTS vehicle_features (
    vehicle_id VARCHAR(50) NOT NULL,
    feature VARCHAR(50) NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    PRIMARY KEY (vehicle_id, feature)
);

-- 5. Bookings / Transactions Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    agency_id VARCHAR(50) NOT NULL,
    vehicle_id VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'Confirmed',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(100),
    user_email VARCHAR(100),
    vehicle_name VARCHAR(100),
    brand VARCHAR(50),
    city VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);
