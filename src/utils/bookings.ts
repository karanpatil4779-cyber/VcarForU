const BOOKINGS_KEY = 'vcarforu_booking_history';
const FEEDBACK_KEY = 'vcarforu_booking_feedback';
const LAST_BOOKING_ID_KEY = 'vcarforu_last_booking_id';

export type BookingRecord = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  vehicle: string;
  brand: string;
  city: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  agencyId?: string;
  createdAt: string;
};

export type BookingFeedback = {
  bookingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

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

export const getBookings = (): BookingRecord[] => readJson<BookingRecord[]>(BOOKINGS_KEY) ?? [];

export const addBooking = (booking: BookingRecord) => {
  const current = getBookings();
  writeJson(BOOKINGS_KEY, [...current, booking]);
  localStorage.setItem(LAST_BOOKING_ID_KEY, booking.id);
  return booking;
};

export const getLastBookingId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_BOOKING_ID_KEY);
};

export const getBookingById = (id: string): BookingRecord | null => {
  return getBookings().find((b) => b.id === id) ?? null;
};

export const getBookingsByUser = (userId: string): BookingRecord[] => {
  return getBookings().filter((b) => b.userId === userId);
};

export const getBookingsByAgency = (agencyId: string): BookingRecord[] => {
  return getBookings().filter((b) => b.agencyId === agencyId);
};

export const saveFeedback = (feedback: BookingFeedback) => {
  const current = readJson<BookingFeedback[]>(FEEDBACK_KEY) ?? [];
  writeJson(FEEDBACK_KEY, [...current, feedback]);
  return feedback;
};

export const getFeedbackByUser = (userId: string): BookingFeedback[] => {
  const current = readJson<BookingFeedback[]>(FEEDBACK_KEY) ?? [];
  return current.filter((f) => f.userId === userId);
};

export const getFeedbackForBooking = (bookingId: string): BookingFeedback | null => {
  const current = readJson<BookingFeedback[]>(FEEDBACK_KEY) ?? [];
  return current.find((f) => f.bookingId === bookingId) ?? null;
};

export const cancelBooking = (bookingId: string) => {
  const current = getBookings();
  const next = current.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b));
  writeJson(BOOKINGS_KEY, next);
  return next.find((b) => b.id === bookingId) ?? null;
};
