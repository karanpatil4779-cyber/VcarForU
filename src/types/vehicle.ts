export type VehicleCategory =
  | 'hatchback'
  | 'sedan'
  | 'suv'
  | 'luxury'
  | 'commuter-bike'
  | 'sports-bike'
  | 'touring-bike'
  | 'scooter'
  | 'electric';

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Petrol/CNG';

export type TransmissionType = 'Manual' | 'Automatic' | 'CVT' | 'Auto';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  type: string;
  fuel: FuelType;
  transmission: TransmissionType;
  seats: number;
  mileage: string;
  pricePerDay: number;
  pricePerHour?: number;
  deposit: number;
  location: string;
  city: string;
  image: string;
  agency: string;
  agencyId: string;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  features: string[];
}

export interface Agency {
  id: string;
  name: string;
  city: string;
  location: string;
  lat: number;
  lng: number;
  rating: number;
  fleetSize: number;
  contact: string;
  image: string;
}

export interface City {
  name: string;
  state: string;
  lat: number;
  lng: number;
  vehicleCount: number;
  image: string;
}
