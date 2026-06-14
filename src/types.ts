/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GuestRoom {
  id: string;
  roomNumber: string;
  category: 'Non-AC Single Room' | 'Non-AC Double Room' | 'Non-AC Double Room with Balcony' | 'AC Single Room' | 'AC Double Room';
  pricePerDay: number;
  capacity: number;
  beds: string;
  amenities: string[];
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  description: string;
  imgUrl: string;
}

export interface Booking {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  guestState: string; // Patient families come from West Bengal, Bangladesh, etc.
  patientCardNo?: string; // Optional CMC UHID
  roomCategory: string;
  assignedRoomId?: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'Completed' | 'Cancelled';
  totalAmount: number;
  needTravelAssistance: boolean;
  travelDetails?: {
    pickupPoint: 'Katpadi Railway Station' | 'Chennai Airport' | 'Bangalore Airport' | 'None';
    pickupTime?: string;
    flightOrTrainNo?: string;
  };
  specialInstructions?: string;
  createdAt: string;
}

export interface TravelService {
  id: string;
  serviceName: string;
  vehicleType: string;
  ratePerKm: number;
  fixedRate: number;
  coverage: 'Local Vellore' | 'Intercity Outstation' | 'Airport Pickup';
  description: string;
  isAvailable: boolean;
  driverName?: string;
  driverContact?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  relation: string; // "Patient Relative", "General Visitor", etc.
  state: string; // e.g. "Kolkata, WB"
  rating: number;
  text: string;
  date: string;
}
