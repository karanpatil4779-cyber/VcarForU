import type { Vehicle } from '../types/vehicle';

// 20 Agencies x 13 Vehicles each (4 cars + 7 bikes + 2 electric) = 260 vehicles in Mumbai

const carModels = [
  { name: 'Honda City', brand: 'Honda', category: 'sedan' as const, price: 2500, deposit: 5000 },
  { name: 'Maruti Swift', brand: 'Maruti', category: 'hatchback' as const, price: 1500, deposit: 3000 },
  { name: 'Hyundai Creta', brand: 'Hyundai', category: 'suv' as const, price: 3200, deposit: 8000 },
  { name: 'Toyota Innova', brand: 'Toyota', category: 'suv' as const, price: 4500, deposit: 10000 },
];

const bikeModels = [
  { name: 'Honda Activa', brand: 'Honda', category: 'scooter' as const, price: 350, deposit: 1000 },
  { name: 'TVS Jupiter', brand: 'TVS', category: 'scooter' as const, price: 380, deposit: 1000 },
  { name: 'Suzuki Access', brand: 'Suzuki', category: 'scooter' as const, price: 400, deposit: 1000 },
  { name: 'Apache RTR 160', brand: 'TVS', category: 'sports-bike' as const, price: 600, deposit: 2000 },
  { name: 'Royal Enfield Classic', brand: 'Royal Enfield', category: 'touring-bike' as const, price: 800, deposit: 3000 },
  { name: 'Bajaj Pulsar', brand: 'Bajaj', category: 'sports-bike' as const, price: 550, deposit: 2000 },
  { name: 'Hero Glamour', brand: 'Hero', category: 'commuter-bike' as const, price: 450, deposit: 1500 },
];

const electricModels = [
  { name: 'Ather 450X', brand: 'Ather', category: 'electric' as const, price: 700, deposit: 5000 },
  { name: 'Ola S1 Pro', brand: 'Ola', category: 'electric' as const, price: 650, deposit: 5000 },
];

const agencyLocations = [
  { id: 'mum-001', name: 'Andheri Car Rentals', lat: 19.1197, lng: 72.8698, location: 'Andheri East' },
  { id: 'mum-002', name: 'Bandra Auto Hub', lat: 19.0544, lng: 72.8404, location: 'Bandra West' },
  { id: 'mum-003', name: 'Juhu Beach Motors', lat: 19.0967, lng: 72.8261, location: 'Juhu' },
  { id: 'mum-004', name: 'Powai Drive Solutions', lat: 19.1166, lng: 72.9088, location: 'Powai' },
  { id: 'mum-005', name: 'Marine Drive Rentals', lat: 18.9438, lng: 72.8234, location: 'Marine Lines' },
  { id: 'mum-006', name: 'Colaba Wheelz', lat: 18.9217, lng: 72.8337, location: 'Colaba' },
  { id: 'mum-007', name: 'Worli Car Point', lat: 19.0168, lng: 72.8300, location: 'Worli' },
  { id: 'mum-008', name: 'Lower Parel Rides', lat: 19.0011, lng: 72.8279, location: 'Lower Parel' },
  { id: 'mum-009', name: 'Dadar Motors', lat: 19.0176, lng: 72.8422, location: 'Dadar' },
  { id: 'mum-010', name: 'Matunga Auto', lat: 19.0274, lng: 72.8551, location: 'Matunga' },
  { id: 'mum-011', name: 'Ghatkopar Wheels', lat: 19.0867, lng: 72.9084, location: 'Ghatkopar' },
  { id: 'mum-012', name: 'Vidyavihar Rentals', lat: 19.0765, lng: 72.9083, location: 'Vidyavihar' },
  { id: 'mum-013', name: 'Kurla Drive Hub', lat: 19.0653, lng: 72.8883, location: 'Kurla' },
  { id: 'mum-014', name: 'Santacruz Motors', lat: 19.0895, lng: 72.8656, location: 'Santacruz' },
  { id: 'mum-015', name: 'Vile Parle Rides', lat: 19.0992, lng: 72.8437, location: 'Vile Parle' },
  { id: 'mum-016', name: 'Chembur Auto Point', lat: 19.0520, lng: 72.8993, location: 'Chembur' },
  { id: 'mum-017', name: 'Govandi Wheels', lat: 19.0440, lng: 72.9083, location: 'Govandi' },
  { id: 'mum-018', name: 'Mulund Drive Co', lat: 19.1441, lng: 72.9521, location: 'Mulund' },
  { id: 'mum-019', name: 'Bhandup Rentals', lat: 19.1497, lng: 72.9355, location: 'Bhandup' },
  { id: 'mum-020', name: 'Kanjurmarg Motors', lat: 19.1272, lng: 72.9343, location: 'Kanjurmarg' },
];

const generateVehicles = (): Vehicle[] => {
  const allVehicles: Vehicle[] = [];
  
  agencyLocations.forEach((agency) => {
    // Add 4 Cars
    carModels.forEach((car, idx) => {
      allVehicles.push({
        id: `${agency.id}-c${idx + 1}`,
        name: car.name,
        brand: car.brand,
        category: car.category,
        type: 'Car',
        fuel: car.category === 'suv' ? 'Diesel' : 'Petrol',
        transmission: idx % 2 === 0 ? 'Automatic' : 'Manual',
        seats: 5,
        mileage: car.category === 'suv' ? '14 kmpl' : '20 kmpl',
        pricePerDay: car.price,
        deposit: car.deposit,
        location: agency.location,
        city: 'Mumbai',
        image: `https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800`,
        agency: agency.name,
        agencyId: agency.id,
        rating: 4.5 + Math.random() * 0.4,
        reviews: Math.floor(100 + Math.random() * 400),
        lat: agency.lat,
        lng: agency.lng,
        features: ['AC', 'Music System', 'Power Steering'],
      });
    });

    // Add 7 Bikes
    bikeModels.forEach((bike, idx) => {
      allVehicles.push({
        id: `${agency.id}-b${idx + 1}`,
        name: bike.name,
        brand: bike.brand,
        category: bike.category,
        type: 'Bike',
        fuel: 'Petrol',
        transmission: 'Manual',
        seats: 2,
        mileage: bike.category === 'scooter' ? '55 kmpl' : '40 kmpl',
        pricePerDay: bike.price,
        deposit: bike.deposit,
        location: agency.location,
        city: 'Mumbai',
        image: `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800`,
        agency: agency.name,
        agencyId: agency.id,
        rating: 4.3 + Math.random() * 0.5,
        reviews: Math.floor(100 + Math.random() * 500),
        lat: agency.lat,
        lng: agency.lng,
        features: ['LED Lights', 'Economy Mode'],
      });
    });

    // Add 2 Electric Scooters
    electricModels.forEach((e, idx) => {
      allVehicles.push({
        id: `${agency.id}-e${idx + 1}`,
        name: e.name,
        brand: e.brand,
        category: e.category,
        type: 'Electric Scooter',
        fuel: 'Electric',
        transmission: 'Auto',
        seats: 2,
        mileage: '70 km/full charge',
        pricePerDay: e.price,
        deposit: e.deposit,
        location: agency.location,
        city: 'Mumbai',
        image: `https://images.unsplash.com/photo-1628124432827-a62c0b2a5007?auto=format&fit=crop&q=80&w=800`,
        agency: agency.name,
        agencyId: agency.id,
        rating: 4.4 + Math.random() * 0.4,
        reviews: Math.floor(50 + Math.random() * 200),
        lat: agency.lat,
        lng: agency.lng,
        features: ['Fast Charging', 'GPS'],
      });
    });
  });

  return allVehicles;
};

export const vehicles: Vehicle[] = generateVehicles();