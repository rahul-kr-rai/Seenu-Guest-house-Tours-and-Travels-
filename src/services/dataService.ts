/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GuestRoom, Booking, TravelService, ContactInquiry, Testimonial } from '../types';

// Robust local storage keys
const KEYS = {
  ROOMS: 'SEENU_ROOMS_V3',
  BOOKINGS: 'SEENU_BOOKINGS_V3',
  TRAVEL: 'SEENU_TRAVEL_V3',
  INQUIRIES: 'SEENU_INQUIRIES_V3',
  TESTIMONIALS: 'SEENU_TESTIMONIALS_V3'
};

// Seed Rooms
const DEFAULT_ROOMS: GuestRoom[] = [
  {
    id: 'room-101',
    roomNumber: '101',
    category: 'Non-AC Single Room',
    pricePerDay: 300,
    capacity: 1,
    beds: '1 Single Bed',
    amenities: ['Single Attached Washroom', 'Free Pot', 'Common Refrigerator for cooking/water', 'Common Kitchen Access', 'Tap Water (Free)', 'Self-Cleaning Setup'],
    status: 'Available',
    description: 'Fully furnished, cost-effective single room. Ideal for recovering patients or single attendants wanting homelike kitchen features with free pots.',
    imgUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-102',
    roomNumber: '102',
    category: 'Non-AC Double Room',
    pricePerDay: 600,
    capacity: 2,
    beds: '1 Double Bed',
    amenities: ['Double Attached Washroom', 'Free Pot', 'Common Refrigerator for cooking/water', 'Common Kitchen Access', 'Tap Water (Free)', 'Self-Cleaning Setup'],
    status: 'Available',
    description: 'Ventilated double room with attached washroom. Self-kitchen friendliness and full assistance for patient families.',
    imgUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-103',
    roomNumber: '103',
    category: 'Non-AC Double Room with Balcony',
    pricePerDay: 800,
    capacity: 2,
    beds: '1 Double Bed',
    amenities: ['Double Attached Washroom', 'Private Breezy Balcony', 'Free Pot', 'Common Refrigerator', 'Common Kitchen Access', 'Tap Water (Free)'],
    status: 'Available',
    description: 'Breezy double room featuring a spacious private balcony. Located near Ida Scudder Road with wonderful road ventilation.',
    imgUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-201',
    roomNumber: '201',
    category: 'AC Single Room',
    pricePerDay: 700,
    capacity: 1,
    beds: '1 Single Bed',
    amenities: ['Air Conditioning', 'Attached Washroom', 'Common Refrigerator', 'Common Kitchen Access', 'Tap Water (Free)', 'Free Pot'],
    status: 'Occupied',
    description: 'Highly hygienic single AC room with attached washroom. Recommended for high-comfort patient healing.',
    imgUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-202',
    roomNumber: '202',
    category: 'AC Double Room',
    pricePerDay: 1200,
    capacity: 2,
    beds: '1 Double Bed',
    amenities: ['Air Conditioning', 'Double Attached Washroom', 'Common Refrigerator', 'Common Kitchen Access', 'Tap Water (Free)', 'Free Pot'],
    status: 'Cleaning',
    description: 'Fully furnished, high-comfort double AC room with attached washroom. Spotless cleanliness with daily self-dustbins.',
    imgUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-203',
    roomNumber: '203',
    category: 'AC Double Room',
    pricePerDay: 1200,
    capacity: 2,
    beds: '2 Single Beds',
    amenities: ['Air Conditioning', 'Double Attached Washroom', 'Common Refrigerator', 'Common Kitchen Access', 'Tap Water (Free)', 'Free Pot'],
    status: 'Available',
    description: 'Premium double AC room with twin single beds, adjacent to the shared self-kitchen area.',
    imgUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'
  }
];

/// Seed Bookings
const DEFAULT_BOOKINGS: Booking[] = [];

// Seed Travel Services
const DEFAULT_TRAVEL: TravelService[] = [
  {
    id: 'travel-1',
    serviceName: 'Airport/Railway Pickup & Drop',
    vehicleType: 'Auto, Car, Bus, Train, Airplane',
    ratePerKm: 0,
    fixedRate: 0,
    coverage: 'Airport Pickup',
    description: 'Seamless pick-and-drop support from Chennai Airport, Bangalore Airport, or Katpadi junction. Charge varies depending on distance, time, and transport type selected.',
    isAvailable: true,
    driverName: 'Suresh Kumar',
    driverContact: '+91 95000 88771'
  },
  {
    id: 'travel-2',
    serviceName: 'Tourist Place Travel with Selected Location',
    vehicleType: 'Car, SUV, Auto, Bus',
    ratePerKm: 0,
    fixedRate: 0,
    coverage: 'Intercity Outstation',
    description: 'Sightseeing, historical tours, or personal trips tailored around nearby landmarks. Charge depends on duration and distance covered.',
    isAvailable: true,
    driverName: 'Murugan G.',
    driverContact: '+91 94441 55662'
  },
  {
    id: 'travel-3',
    serviceName: 'Bus Ticket Booking',
    vehicleType: 'Sleeper, Semi-Sleeper, AC Bus',
    ratePerKm: 0,
    fixedRate: 0,
    coverage: 'Local Vellore',
    description: 'Instant platform assistance for booking long-distance express buses toward Bangalore, Chennai, Kochi, Hyderabad, or Vijayawada.',
    isAvailable: true,
    driverName: 'Desk Coordinator',
    driverContact: '+91 93602 11223'
  },
  {
    id: 'travel-4',
    serviceName: 'Tirupati Balaji Ji Darshan Tour',
    vehicleType: 'Car, SUV, Bus',
    ratePerKm: 0,
    fixedRate: 0,
    coverage: 'Intercity Outstation',
    description: 'Special dynamic travel packages for Tirupati Balaji Ji Darshan. Rates depend on group size, vehicle choice, and peak schedule dates.',
    isAvailable: true,
    driverName: 'Seenu Travels',
    driverContact: '+91 93602 11223'
  }
];

// Seed Testimonials
const DEFAULT_TESTIMONIALS: Testimonial[] = [];

// Seed Inquiries
const DEFAULT_INQUIRIES: ContactInquiry[] = [];

export const dbService = {
  // Initialize Database inside localStorage
  init() {
    if (!localStorage.getItem(KEYS.ROOMS)) {
      localStorage.setItem(KEYS.ROOMS, JSON.stringify(DEFAULT_ROOMS));
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
    }
    if (!localStorage.getItem(KEYS.TRAVEL)) {
      localStorage.setItem(KEYS.TRAVEL, JSON.stringify(DEFAULT_TRAVEL));
    }
    if (!localStorage.getItem(KEYS.INQUIRIES)) {
      localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(DEFAULT_INQUIRIES));
    }
    if (!localStorage.getItem(KEYS.TESTIMONIALS)) {
      localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
    }
  },

  // Rooms CRUD
  getRooms(): GuestRoom[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.ROOMS) || '[]');
  },

  addRoom(room: Omit<GuestRoom, 'id'>): GuestRoom {
    const rooms = this.getRooms();
    const newRoom: GuestRoom = {
      ...room,
      id: `room-${Date.now()}`
    };
    rooms.push(newRoom);
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
    return newRoom;
  },

  updateRoom(roomId: string, updatedFields: Partial<GuestRoom>): GuestRoom[] {
    const rooms = this.getRooms();
    const updated = rooms.map(room => room.id === roomId ? { ...room, ...updatedFields } : room);
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(updated));
    return updated;
  },

  deleteRoom(roomId: string): GuestRoom[] {
    const rooms = this.getRooms();
    const filtered = rooms.filter(room => room.id !== roomId);
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(filtered));
    return filtered;
  },

  updateRoomStatus(roomId: string, status: GuestRoom['status']): GuestRoom[] {
    const rooms = this.getRooms();
    const updated = rooms.map(room => room.id === roomId ? { ...room, status } : room);
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(updated));
    return updated;
  },

  updateRoomPrice(roomId: string, pricePerDay: number): GuestRoom[] {
    const rooms = this.getRooms();
    const updated = rooms.map(room => room.id === roomId ? { ...room, pricePerDay } : room);
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(updated));
    return updated;
  },

  // Bookings CRUD
  getBookings(): Booking[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
  },

  addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    // If an assignedRoomId exists, update the status to occupied
    if (newBooking.assignedRoomId && newBooking.status === 'CheckedIn') {
      this.updateRoomStatus(newBooking.assignedRoomId, 'Occupied');
    }

    return newBooking;
  },

  updateBookingStatus(bookingId: string, status: Booking['status'], assignedRoomId?: string): Booking[] {
    const bookings = this.getBookings();
    const updated = bookings.map(booking => {
      if (booking.id === bookingId) {
        const prevRoom = booking.assignedRoomId;
        const newRoom = assignedRoomId !== undefined ? assignedRoomId : booking.assignedRoomId;

        // Manage Room availability conflicts
        if (status === 'CheckedIn' && newRoom) {
          this.updateRoomStatus(newRoom, 'Occupied');
        } else if (status === 'Completed' && newRoom) {
          this.updateRoomStatus(newRoom, 'Cleaning');
        } else if (status === 'Cancelled' && prevRoom) {
          this.updateRoomStatus(prevRoom, 'Available');
        }

        return { ...booking, status, assignedRoomId: newRoom };
      }
      return booking;
    });

    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
    return updated;
  },

  deleteBooking(bookingId: string): Booking[] {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (booking?.assignedRoomId) {
      this.updateRoomStatus(booking.assignedRoomId, 'Available');
    }
    const filtered = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(filtered));
    return filtered;
  },

  // Travel Service CRUD
  getTravelServices(): TravelService[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.TRAVEL) || '[]');
  },

  updateTravelAvailability(serviceId: string, isAvailable: boolean): TravelService[] {
    const services = this.getTravelServices();
    const updated = services.map(srv => srv.id === serviceId ? { ...srv, isAvailable } : srv);
    localStorage.setItem(KEYS.TRAVEL, JSON.stringify(updated));
    return updated;
  },

  updateDriverDetails(serviceId: string, driverName: string, driverContact: string): TravelService[] {
    const services = this.getTravelServices();
    const updated = services.map(srv => srv.id === serviceId ? { ...srv, driverName, driverContact } : srv);
    localStorage.setItem(KEYS.TRAVEL, JSON.stringify(updated));
    return updated;
  },

  // Testimonials CR
  getTestimonials(): Testimonial[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS) || '[]');
  },

  addTestimonial(test: Omit<Testimonial, 'id' | 'date'>): Testimonial {
    const testimonials = this.getTestimonials();
    const newTest: Testimonial = {
      ...test,
      id: `t-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    testimonials.unshift(newTest);
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    return newTest;
  },

  // Inquiries CRUD
  getInquiries(): ContactInquiry[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.INQUIRIES) || '[]');
  },

  addInquiry(inq: Omit<ContactInquiry, 'id' | 'isRead' | 'createdAt'>): ContactInquiry {
    const inquiries = this.getInquiries();
    const newInq: ContactInquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    inquiries.unshift(newInq);
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));
    return newInq;
  },

  markInquiryAsRead(inqId: string): ContactInquiry[] {
    const inquiries = this.getInquiries();
    const updated = inquiries.map(inq => inq.id === inqId ? { ...inq, isRead: true } : inq);
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(updated));
    return updated;
  },

  deleteInquiry(inqId: string): ContactInquiry[] {
    const inquiries = this.getInquiries();
    const filtered = inquiries.filter(inq => inq.id !== inqId);
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(filtered));
    return filtered;
  },

  // Real-time Analytics Engine
  getAnalytics() {
    const bookings = this.getBookings();
    const rooms = this.getRooms();
    const inquiries = this.getInquiries();

    // 1. Occupancy calculation
    const occupiedCount = rooms.filter(r => r.status === 'Occupied').length;
    const cleaningCount = rooms.filter(r => r.status === 'Cleaning').length;
    const maintenanceCount = rooms.filter(r => r.status === 'Maintenance').length;
    const availableCount = rooms.filter(r => r.status === 'Available').length;
    const totalRooms = rooms.length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

    // 2. Booking distributions
    const totalBookingsCount = bookings.length;
    const statusDistribution = {
      Pending: bookings.filter(b => b.status === 'Pending').length,
      Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
      CheckedIn: bookings.filter(b => b.status === 'CheckedIn').length,
      Completed: bookings.filter(b => b.status === 'Completed').length,
      Cancelled: bookings.filter(b => b.status === 'Cancelled').length
    };

    // 3. States / Region breakdown of patients
    const patientStateDistribution: { [key: string]: number } = {};
    bookings.forEach(b => {
      const state = b.guestState || 'Other';
      patientStateDistribution[state] = (patientStateDistribution[state] || 0) + 1;
    });

    // 4. Financial Calculations
    // Projected / Confirmed Revenue from ACTIVE check-ins and completed bookings
    const activeAndCompleted = bookings.filter(b => b.status === 'CheckedIn' || b.status === 'Completed' || b.status === 'Confirmed');
    const totalRevenue = activeAndCompleted.reduce((acc, curr) => acc + curr.totalAmount, 0);

    // 5. Travel Service workload
    const travelRequestsCount = bookings.filter(b => b.needTravelAssistance).length;
    const travelPickupsBreakdown = {
      'Chennai Airport': bookings.filter(b => b.needTravelAssistance && b.travelDetails?.pickupPoint === 'Chennai Airport').length,
      'Bangalore Airport': bookings.filter(b => b.needTravelAssistance && b.travelDetails?.pickupPoint === 'Bangalore Airport').length,
      'Katpadi Railway Station': bookings.filter(b => b.needTravelAssistance && b.travelDetails?.pickupPoint === 'Katpadi Railway Station').length,
      'None': bookings.filter(b => b.needTravelAssistance && b.travelDetails?.pickupPoint === 'None').length
    };

    // 6. Alert signals
    const pendingApprovalsCount = statusDistribution.Pending;
    const unreadInquiriesCount = inquiries.filter(i => !i.isRead).length;

    return {
      occupancyRate,
      occupiedCount,
      cleaningCount,
      maintenanceCount,
      availableCount,
      totalRooms,
      statusDistribution,
      totalBookingsCount,
      totalRevenue,
      patientStateDistribution,
      travelRequestsCount,
      travelPickupsBreakdown,
      pendingApprovalsCount,
      unreadInquiriesCount
    };
  }
};
