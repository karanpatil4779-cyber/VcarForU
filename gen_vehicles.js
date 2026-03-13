// Script to generate vehicles.ts
const fs = require('fs');

const categories = ['hatchback', 'sedan', 'suv', 'luxury', 'commuter-bike', 'sports-bike', 'touring-bike', 'scooter', 'electric'];
const fuels = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Petrol/CNG'];
const agencies = ['Delhi Ride Rentals', 'Mumbai Auto Hub', 'Bangalore Bike Rentals', 'Goa Beach Rides', 'Roorkee Wheels', 'Pune Drive Co', 'Hyderabad Motors', 'Manali Adventures'];
const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Goa', 'Manali', 'Rishikesh', 'Pune', 'Hyderabad'];

const featureList = ['ABS', 'Airbags', 'Bluetooth', 'Touchscreen', 'GPS', 'Alloy Wheels', 'Power Steering', 'Keyless Entry', 'Sunroof', 'Leather Seats', 'Disc Brakes', 'Mobile Charger'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const names = [
  'Maruti Suzuki Swift', 'Hyundai i20', 'Honda City', 'Mahindra Thar', 'Tata Nexon',
  'Royal Enfield Classic 350', 'Honda Activa 6G', 'KTM Duke 390', 'Toyota Innova Crysta',
  'Hyundai Creta', 'Kia Seltos', 'Ola S1 Pro', 'Ather 450X', 'Bajaj Pulsar 150',
  'BMW 3 Series', 'Mercedes-Benz C-Class', 'TVS Jupiter', 'Tata Tiago', 'Renault Kwid'
];

const brandMap = {
  'Maruti Suzuki Swift': 'Maruti Suzuki',
  'Hyundai i20': 'Hyundai',
  'Honda City': 'Honda',
  'Mahindra Thar': 'Mahindra',
  'Tata Nexon': 'Tata',
  'Royal Enfield Classic 350': 'Royal Enfield',
  'Honda Activa 6G': 'Honda',
  'KTM Duke 390': 'KTM',
  'Toyota Innova Crysta': 'Toyota',
  'Hyundai Creta': 'Hyundai',
  'Kia Seltos': 'Kia',
  'Ola S1 Pro': 'Ola',
  'Ather 450X': 'Ather',
  'Bajaj Pulsar 150': 'Bajaj',
  'BMW 3 Series': 'BMW',
  'Mercedes-Benz C-Class': 'Mercedes-Benz',
  'TVS Jupiter': 'TVS',
  'Tata Tiago': 'Tata',
  'Renault Kwid': 'Renault'
};

const imageMap = {
  'Maruti Suzuki Swift': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', // car
  'Honda City': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  'Mahindra Thar': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800', // SUV
  'Royal Enfield Classic 350': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800', // bike
  'Honda Activa 6G': 'https://images.unsplash.com/photo-1620882677180-877f884501fc?auto=format&fit=crop&q=80&w=800', // scooter
  'Ola S1 Pro': 'https://images.unsplash.com/photo-1635327092323-eff0f0f4b301?auto=format&fit=crop&q=80&w=800', // electric scooter
  'BMW 3 Series': 'https://images.unsplash.com/photo-1555353540-64fd8b0ebd50?auto=format&fit=crop&q=80&w=800',
};

const vehicles = [];

for (let i = 1; i <= 115; i++) {
  const name = getRandomItem(names);
  const brand = brandMap[name];
  let cat = getRandomItem(categories);
  
  if (name.includes('Enfield') || name.includes('KTM') || name.includes('Pulsar')) cat = getRandomItem(['commuter-bike', 'sports-bike', 'touring-bike']);
  if (name.includes('Activa') || name.includes('Jupiter')) cat = 'scooter';
  if (name.includes('Ola') || name.includes('Ather')) cat = 'electric';
  if (name.includes('BMW') || name.includes('Mercedes')) cat = 'luxury';
  if (name.includes('Thar') || name.includes('Creta') || name.includes('Innova') || name.includes('Nexon')) cat = 'suv';
  if (name.includes('City')) cat = 'sedan';

  const isBike = ['commuter-bike', 'sports-bike', 'touring-bike', 'scooter'].includes(cat);
  const fuel = cat === 'electric' ? 'Electric' : (isBike ? 'Petrol' : getRandomItem(['Petrol', 'Diesel', 'CNG']));
  
  // Features
  const numFeatures = getRandomInt(3, 7);
  const features = new Set();
  while (features.size < numFeatures) {
    features.add(getRandomItem(featureList));
  }

  const pDay = isBike ? getRandomInt(400, 1500) : getRandomInt(1200, 6000);
  
  const vehicle = {
    id: `v-${i}`,
    name,
    brand,
    category: cat,
    type: isBike ? 'bike' : 'car',
    fuel,
    transmission: isBike ? 'Manual' : getRandomItem(['Manual', 'Automatic', 'CVT']),
    seats: isBike ? 2 : (name.includes('Innova') ? 7 : 5),
    mileage: `${getRandomInt(12, 45)} kmpl`,
    pricePerDay: pDay,
    pricePerHour: Math.floor(pDay / 12),
    deposit: pDay * 3,
    location: `${getRandomItem(['Airport', 'Railway Station', 'Downtown', 'North'])}`,
    city: getRandomItem(cities),
    image: imageMap[name] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    agency: getRandomItem(agencies),
    agencyId: `a-${getRandomInt(1, 8)}`,
    rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
    reviews: getRandomInt(5, 120),
    lat: 20.59 + (Math.random() * 2 - 1),
    lng: 78.96 + (Math.random() * 2 - 1),
    features: Array.from(features)
  };
  
  vehicles.push(vehicle);
}

const fileContent = `import { Vehicle } from '../types/vehicle';\n\nexport const vehicles: Vehicle[] = ${JSON.stringify(vehicles, null, 2)};\n`;

fs.writeFileSync('src/data/vehicles.ts', fileContent);
console.log('Vehicles generated');
