/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GuestRoom, Booking, TravelService, ContactInquiry, Testimonial } from '../types';

// Robust local storage keys
const KEYS = {
  ROOMS: 'SEENU_ROOMS_V2',
  BOOKINGS: 'SEENU_BOOKINGS_V2',
  TRAVEL: 'SEENU_TRAVEL_V2',
  INQUIRIES: 'SEENU_INQUIRIES_V2',
  TESTIMONIALS: 'SEENU_TESTIMONIALS_V2'
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

// Seed Bookings
const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'booking-1001',
    guestName: 'Animesh Mukhopadhyay',
    guestPhone: '+91 94330 12345',
    guestEmail: 'animesh.m@gmail.com',
    guestState: 'West Bengal',
    patientCardNo: 'CMC-789210-B',
    roomCategory: 'AC Double Room',
    assignedRoomId: 'room-202',
    checkInDate: '2026-06-12',
    checkOutDate: '2026-06-27', // 15 days
    status: 'CheckedIn',
    totalAmount: 16200, // 1200 * 15 = 18000, 10% discount = 16200
    needTravelAssistance: true,
    travelDetails: {
      pickupPoint: 'Chennai Airport',
      pickupTime: '2026-06-12 14:00',
      flightOrTrainNo: '6E-2435 Indigo'
    },
    specialInstructions: 'Patient needs a wheelchair at arrival. Self-kitchen setup used daily for cooking light Bengali meals.',
    createdAt: '2026-06-10T11:30:00Z'
  },
  {
    id: 'booking-1002',
    guestName: 'Kamesh Nair',
    guestPhone: '+91 98450 67890',
    guestEmail: 'kameshnair@gmail.com',
    guestState: 'Kerala',
    patientCardNo: 'CMC-103452-Y',
    roomCategory: 'Non-AC Double Room with Balcony',
    assignedRoomId: 'room-103',
    checkInDate: '2026-06-14',
    checkOutDate: '2026-06-18',
    status: 'Confirmed',
    totalAmount: 3200, // 800 * 4 = 3200
    needTravelAssistance: true,
    travelDetails: {
      pickupPoint: 'Katpadi Railway Station',
      pickupTime: '2026-06-14 06:15',
      flightOrTrainNo: '12626 Kerala Express'
    },
    specialInstructions: 'Please arrange local auto transportation back and forth on treatment days.',
    createdAt: '2026-06-12T15:24:00Z'
  },
  {
    id: 'booking-1003',
    guestName: 'Dr. Sanjay Agarwal',
    guestPhone: '+91 99100 88221',
    guestState: 'Uttar Pradesh',
    roomCategory: 'AC Single Room',
    status: 'Pending',
    totalAmount: 2100, // 700 * 3 = 2100
    needTravelAssistance: false,
    specialInstructions: 'Visiting CMC for clinical consultation. Request clean high floor room.',
    createdAt: '2026-06-13T18:45:00Z',
    checkInDate: '2026-06-18',
    checkOutDate: '2026-06-21'
  },
  {
    id: 'booking-1004',
    guestName: 'Rahim Ahsan',
    guestPhone: '+880 1711 556677',
    guestEmail: 'rahim.ahsan@yahoo.com',
    guestState: 'Dhaka, Bangladesh',
    patientCardNo: 'CMC-410398-X',
    roomCategory: 'AC Single Room',
    assignedRoomId: 'room-201',
    checkInDate: '2026-06-05',
    checkOutDate: '2026-06-13',
    status: 'Completed',
    totalAmount: 5600, // 700 * 8 = 5600
    needTravelAssistance: true,
    travelDetails: {
      pickupPoint: 'Chennai Airport',
      pickupTime: '2026-06-05 10:10',
      flightOrTrainNo: 'BG-0083 Biman Bangladesh'
    },
    specialInstructions: 'Needs currency exchange support and active assistance with local SIM card activation.',
    createdAt: '2026-06-01T09:20:00Z'
  }
];

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
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    author: 'Debadrita Roy',
    relation: 'Patient Daughter',
    state: 'Kolkata, WB',
    rating: 5,
    text: 'Visiting Vellore from Kolkata with a cancer-diagnosed mother was highly stressful. Staying here was a lifesaver. The kitchenette facility allowed me to cook home-cooked mild meals for mom, and Murugan (cab driver) picked us up directly from Chennai airport. Absolute blessing, highly recommended!',
    date: '2026-06-01'
  },
  {
    id: 't-2',
    author: 'Mohammad Farooq',
    relation: 'Patient Brother',
    state: 'Dhaka, Bangladesh',
    rating: 5,
    text: 'Very hygienic rooms near hospital, only 4 minutes walking. Bengali food ingredients are easily grocery shopped nearby. The owner helped our family do cash exchanges and get Indian sim card too. Translating to Tamil is easy here since guesthouse staff speak Hindi/Bengali.',
    date: '2026-05-18'
  },
  {
    id: 't-3',
    author: 'Ranjit Shenoy',
    relation: 'Direct outpatient',
    state: 'Mangalore, Karnataka',
    rating: 5,
    text: 'Highly professional. Affordable prices. Rooms are spacious and spotless with proper hot water. The Katpadi railway booking shuttle was perfectly on-time to receive our family at 5 AM. Five stars!',
    date: '2026-06-10'
  }
];

// Seed Inquiries
const DEFAULT_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Shreya Sengupta',
    phone: '+91 90070 33445',
    email: 'shreya.sen@gmail.com',
    subject: 'Room availability for long term stay (1.5 months)',
    message: 'Hello, our family is coming to Vellore for radiation treatment of 6 weeks. Do you have discounts for long-term monthly bookings (from July 5th)? Kitchen access is mandatory. Also require airport pickup. Please advise.',
    isRead: false,
    createdAt: '2026-06-13T10:15:00Z'
  },
  {
    id: 'inq-2',
    name: 'Balachandran R.',
    phone: '+91 94432 99011',
    subject: 'Wheelchair assistance',
    message: 'Do you have wheelchair ramp access from the main street to the ground floor room? My father is scheduled for orthopedic checkup next week on Wednesday. Looking to book room 101.',
    isRead: true,
    createdAt: '2026-06-12T14:10:00Z'
  }
];

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
