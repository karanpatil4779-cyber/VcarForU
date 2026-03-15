import { vehicles } from '../data/vehicles';
import type { Vehicle } from '../types/vehicle';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type Agency = {
  id: string;
  agencyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  gstNumber?: string;
  password: string;
};

const CUSTOMER_KEY = 'vcarforu_customers';
const AGENCY_KEY = 'vcarforu_agencies';

const readJson = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const writeJson = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCustomers = (): Customer[] => readJson<Customer[]>(CUSTOMER_KEY) ?? [];
export const getAgencies = (): Agency[] => readJson<Agency[]>(AGENCY_KEY) ?? [];

export const registerCustomer = (customer: Customer): { success: boolean; message: string } => {
  const existing = getCustomers();
  if (existing.some((u) => u.email.toLowerCase() === customer.email.toLowerCase())) {
    return { success: false, message: 'Email already exists.' };
  }
  writeJson(CUSTOMER_KEY, [...existing, customer]);
  return { success: true, message: 'Customer registered successfully.' };
};

export const registerAgency = (agency: Agency): { success: boolean; message: string } => {
  const existing = getAgencies();
  if (existing.some((a) => a.email.toLowerCase() === agency.email.toLowerCase())) {
    return { success: false, message: 'Email already exists.' };
  }
  writeJson(AGENCY_KEY, [...existing, agency]);
  return { success: true, message: 'Agency registered successfully.' };
};

export const findCustomer = (email: string, password: string): Customer | null => {
  const existing = getCustomers();
  return existing.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  ) ?? null;
};

export type AuthUser = {
  id: string;
  role: 'customer' | 'agency';
  email: string;
  name: string;
};

const CURRENT_USER_KEY = 'vcarforu_current_user';

export const setCurrentUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const findAgency = (email: string, password: string): Agency | null => {
  const existing = getAgencies();
  return existing.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  ) ?? null;
};

// Agency Inventory Helpers
const AGENCY_VEHICLE_KEY = 'vcarforu_agency_vehicles';

export const getAgencyVehicles = (agencyId: string): Vehicle[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(AGENCY_VEHICLE_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Vehicle[];
    return list.filter((v) => v.agencyId === agencyId);
  } catch {
    return [];
  }
};

export const getAllAgencyVehicles = (): Vehicle[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(AGENCY_VEHICLE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Vehicle[];
  } catch {
    return [];
  }
};

export const addAgencyVehicle = (vehicle: Vehicle): { success: boolean; message: string } => {
  if (typeof window === 'undefined') return { success: false, message: 'Unable to access local storage.' };
  const current = getAllAgencyVehicles();
  writeJson(AGENCY_VEHICLE_KEY, [...current, vehicle]);
  return { success: true, message: 'Vehicle added.' };
};

export const findVehicleById = (id: string): Vehicle | null => {
  const localVehicles = getAllAgencyVehicles();
  return vehicles.find((v) => v.id === id) || localVehicles.find((v) => v.id === id) || null;
};
