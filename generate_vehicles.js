const fs = require('fs');

const carModels = {
  hatchback: [
    { name: 'Maruti Suzuki Swift', brand: 'Maruti Suzuki', fuel: 'Petrol', transmission: 'Manual', mileage: '22 kmpl', pricePerDay: 1500, deposit: 5000, seats: 5 },
    { name: 'Hyundai i20', brand: 'Hyundai', fuel: 'Petrol', transmission: 'Manual', mileage: '20 kmpl', pricePerDay: 1800, deposit: 5000, seats: 5 },
    { name: 'Tata Tiago', brand: 'Tata', fuel: 'Petrol', transmission: 'Manual', mileage: '23.84 kmpl', pricePerDay: 1200, deposit: 3000, seats: 5 },
    { name: 'Maruti Suzuki Baleno', brand: 'Maruti Suzuki', fuel: 'Petrol', transmission: 'Automatic', mileage: '22.35 kmpl', pricePerDay: 1900, deposit: 5000, seats: 5 },
  ],
  sedan: [
    { name: 'Honda City', brand: 'Honda', fuel: 'Petrol', transmission: 'CVT', mileage: '18.4 kmpl', pricePerDay: 2800, deposit: 7000, seats: 5 },
    { name: 'Hyundai Verna', brand: 'Hyundai', fuel: 'Diesel', transmission: 'Manual', mileage: '21.3 kmpl', pricePerDay: 3000, deposit: 7000, seats: 5 },
    { name: 'Maruti Suzuki Ciaz', brand: 'Maruti Suzuki', fuel: 'Petrol', transmission: 'Manual', mileage: '20.65 kmpl', pricePerDay: 2500, deposit: 6000, seats: 5 },
  ],
  suv: [
    { name: 'Mahindra Thar', brand: 'Mahindra', fuel: 'Diesel', transmission: 'Manual', mileage: '15.2 kmpl', pricePerDay: 5500, deposit: 10000, seats: 4 },
    { name: 'Hyundai Creta', brand: 'Hyundai', fuel: 'Diesel', transmission: 'Automatic', mileage: '18.5 kmpl', pricePerDay: 4000, deposit: 8000, seats: 5 },
    { name: 'Tata Nexon', brand: 'Tata', fuel: 'Petrol', transmission: 'Manual', mileage: '17.33 kmpl', pricePerDay: 3500, deposit: 8000, seats: 5 },
    { name: 'Mahindra Scorpio N', brand: 'Mahindra', fuel: 'Diesel', transmission: 'Automatic', mileage: '15 kmpl', pricePerDay: 6000, deposit: 12000, seats: 7 },
  ],
  luxury: [
    { name: 'BMW 5 Series', brand: 'BMW', fuel: 'Diesel', transmission: 'Automatic', mileage: '17.42 kmpl', pricePerDay: 15000, deposit: 30000, seats: 5 },
    { name: 'Mercedes-Benz C-Class', brand: 'Mercedes-Benz', fuel: 'Petrol', transmission: 'Automatic', mileage: '16.9 kmpl', pricePerDay: 16000, deposit: 30000, seats: 5 },
    { name: 'Audi A6', brand: 'Audi', fuel: 'Petrol', transmission: 'Automatic', mileage: '14.11 kmpl', pricePerDay: 14000, deposit: 25000, seats: 5 },
  ],
  'commuter-bike': [
    { name: 'Hero Splendor Plus', brand: 'Hero', fuel: 'Petrol', transmission: 'Manual', mileage: '80 kmpl', pricePerDay: 400, deposit: 1000, seats: 2 },
    { name: 'Honda Shine', brand: 'Honda', fuel: 'Petrol', transmission: 'Manual', mileage: '65 kmpl', pricePerDay: 500, deposit: 1000, seats: 2 },
  ],
  'sports-bike': [
    { name: 'KTM Duke 390', brand: 'KTM', fuel: 'Petrol', transmission: 'Manual', mileage: '28 kmpl', pricePerDay: 1800, deposit: 5000, seats: 2 },
    { name: 'Yamaha R15', brand: 'Yamaha', fuel: 'Petrol', transmission: 'Manual', mileage: '48 kmpl', pricePerDay: 1200, deposit: 3000, seats: 2 },
  ],
  'touring-bike': [
    { name: 'Royal Enfield Classic 350', brand: 'Royal Enfield', fuel: 'Petrol', transmission: 'Manual', mileage: '35 kmpl', pricePerDay: 1500, deposit: 5000, seats: 2 },
    { name: 'Royal Enfield Himalayan', brand: 'Royal Enfield', fuel: 'Petrol', transmission: 'Manual', mileage: '30 kmpl', pricePerDay: 2000, deposit: 6000, seats: 2 },
  ],
  scooter: [
    { name: 'Honda Activa 6G', brand: 'Honda', fuel: 'Petrol', transmission: 'CVT', mileage: '50 kmpl', pricePerDay: 400, deposit: 1000, seats: 2 },
    { name: 'TVS Ntorq 125', brand: 'TVS', fuel: 'Petrol', transmission: 'CVT', mileage: '45 kmpl', pricePerDay: 500, deposit: 1500, seats: 2 },
    { name: 'Suzuki Access 125', brand: 'Suzuki', fuel: 'Petrol', transmission: 'CVT', mileage: '52 kmpl', pricePerDay: 450, deposit: 1500, seats: 2 },
  ],
  electric: [
    { name: 'Tata Nexon EV', brand: 'Tata', fuel: 'Electric', transmission: 'Automatic', mileage: '312 km/charge', pricePerDay: 4500, deposit: 10000, seats: 5 },
    { name: 'Ather 450X', brand: 'Ather', fuel: 'Electric', transmission: 'Automatic', mileage: '105 km/charge', pricePerDay: 800, deposit: 2000, seats: 2 },
    { name: 'Ola S1 Pro', brand: 'Ola', fuel: 'Electric', transmission: 'Automatic', mileage: '181 km/charge', pricePerDay: 900, deposit: 2000, seats: 2 },
  ],
};

const images = {
  hatchback: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
  sedan: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
  suv: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800',
  luxury: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
  'commuter-bike': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
  'sports-bike': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
  'touring-bike': 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=800',
  scooter: 'https://images.unsplash.com/photo-1620021305436-ecfba0e38699?auto=format&fit=crop&q=80&w=800',
  electric: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?auto=format&fit=crop&q=80&w=800',
};

const cities = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Manali', lat: 32.2396, lng: 77.1887 },
  { name: 'Rishikesh', lat: 30.0869, lng: 78.2676 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
];

const agencies = [
  { id: 'agency-del', name: 'Delhi Ride Rentals', city: 'Delhi', rating: 4.7 },
  { id: 'agency-mum', name: 'Mumbai Auto Hub', city: 'Mumbai', rating: 4.8 },
  { id: 'agency-blr', name: 'Bangalore Bike Rentals', city: 'Bangalore', rating: 4.6 },
  { id: 'agency-goa', name: 'Goa Beach Rides', city: 'Goa', rating: 4.9 },
  { id: 'agency-rkee', name: 'Roorkee Wheels', city: 'Roorkee', rating: 4.5 },
  { id: 'agency-pune', name: 'Pune Drive Co', city: 'Pune', rating: 4.7 },
  { id: 'agency-hyd', name: 'Hyderabad Motors', city: 'Hyderabad', rating: 4.6 },
  { id: 'agency-man', name: 'Manali Adventures', city: 'Manali', rating: 4.8 },
];

const carsFeatures = ['Airbags', 'ABS', 'Bluetooth', 'Reverse Camera', 'GPS tracking'];
const bikesFeatures = ['ABS', 'Electric Start', 'GPS tracking'];
const scootersFeatures = ['Electric Start', 'Under-seat storage'];
const evFeatures = ['Fast Charging', 'GPS tracking', 'Regenerative Braking'];

const data = [];
let idCounter = 1;

// Generating targets
const targets = {
  hatchback: 15,
  sedan: 10,
  suv: 10,
  luxury: 5,
  'commuter-bike': 15,
  'sports-bike': 10,
  'touring-bike': 15,
  scooter: 20,
  electric: 10,
};

for (const [category, targetCount] of Object.entries(targets)) {
  const templates = carModels[category];
  for (let i = 0; i < targetCount; i++) {
    const template = templates[i % templates.length];
    
    // Pick random agency
    const agency = agencies[Math.floor(Math.random() * agencies.length)];
    // Pick random city based on agency (or random if we want mixed, but let's map agency to city roughly)
    const city = cities.find(c => c.name === agency.city) || cities[0];

    // Add some random fuzz to lat lng
    const lat = city.lat + (Math.random() - 0.5) * 0.1;
    const lng = city.lng + (Math.random() - 0.5) * 0.1;

    let features = [];
    if (['hatchback', 'sedan', 'suv', 'luxury'].includes(category)) features = [...carsFeatures];
    else if (['commuter-bike', 'sports-bike', 'touring-bike'].includes(category)) features = [...bikesFeatures];
    else if (category === 'scooter') features = [...scootersFeatures];
    else if (category === 'electric') features = [...evFeatures];

    // randomize price and deposit slightly
    const pricePerDay = template.pricePerDay + Math.floor(Math.random() * 5) * 100;

    data.push({
      id: `${category}-${String(idCounter++).padStart(3, '0')}`,
      name: template.name,
      brand: template.brand,
      category,
      type: category, // Keep for backward compat
      fuel: template.fuel,
      transmission: template.transmission,
      seats: template.seats,
      mileage: template.mileage,
      pricePerDay,
      pricePerHour: Math.floor(pricePerDay / 10),
      deposit: template.deposit,
      location: city.name,
      city: city.name,
      image: images[category],
      agency: agency.name,
      agencyId: agency.id,
      rating: +(Math.random() * (5 - 4) + 4).toFixed(1),
      reviews: Math.floor(Math.random() * 200) + 10,
      lat,
      lng,
      features
    });
  }
}

const fileContent = `import type { Vehicle } from '../types/vehicle';\n\nexport const vehicles: Vehicle[] = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync('src/data/vehicles.ts', fileContent);
console.log('vehicles.ts generated with ' + data.length + ' vehicles.');
