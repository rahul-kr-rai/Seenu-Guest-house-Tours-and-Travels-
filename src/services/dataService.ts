/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GuestRoom, Booking, TravelService, ContactInquiry, Testimonial } from '../types';

// Robust local storage keys
const KEYS = {
  ROOMS: 'CMC_GUESTHOUSE_ROOMS',
  BOOKINGS: 'CMC_GUESTHOUSE_BOOKINGS',
  TRAVEL: 'CMC_GUESTHOUSE_TRAVEL',
  INQUIRIES: 'CMC_GUESTHOUSE_INQUIRIES',
  TESTIMONIALS: 'CMC_GUESTHOUSE_TESTIMONIALS'
};

// Seed Rooms
const DEFAULT_ROOMS: GuestRoom[] = [
  {
    id: 'room-101',
    roomNumber: '101',
    category: 'Standard AC',
    pricePerDay: 1200,
    capacity: 2,
    beds: '1 Double Bed',
    amenities: ['Air Conditioning', 'Free High-speed Wi-Fi', 'Attached Bathroom', 'Smart TV', 'Geyser', 'Wheelchair Friendly'],
    status: 'Available',
    description: 'Clean, airy, and cozy room located on the ground floor making it highly suitable for patients needing minimal movement. High speed wifi included.',
    imgUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-102',
    roomNumber: '102',
    category: 'Standard Non-AC',
    pricePerDay: 750,
    capacity: 2,
    beds: '2 Single Beds',
    amenities: ['Ceiling Fan', 'Free High-speed Wi-Fi', 'Attached Bathroom', 'Elevator Access', 'Geyser'],
    status: 'Available',
    description: 'An economical clean option for patient attendants. Located on the first floor with beautiful ventilation, single beds, and high ceiling fan controls.',
    imgUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-201',
    roomNumber: '201',
    category: 'Deluxe Double AC',
    pricePerDay: 1600,
    capacity: 3,
    beds: '1 Double Bed + 1 Single Bed',
    amenities: ['Superfast Wi-Fi', 'Premium Air Conditioning', 'En-suite Bathroom', 'Balcony', 'RO Water Dispenser', 'Mini Refrigerator'],
    status: 'Occupied',
    description: 'Spacious first-floor room featuring a private balcony and a small refrigerator to store cooling medicines or health food. Outstanding hygiene ventilation.',
    imgUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-202',
    roomNumber: '202',
    category: 'Deluxe Family AC',
    pricePerDay: 2200,
    capacity: 4,
    beds: '2 King Beds',
    amenities: ['Premium Air Conditioning', 'Induction Cooktop & Small Kitchenette', 'Attached Large Bathroom', 'Water Purifier', 'Elevator Access', 'Smart TV with Multi-lingual packs'],
    status: 'Cleaning',
    description: 'Designed specifically for extended medical-attendant families. Comes with an attached induction kitchenette so you can cook prescribed therapeutic meals in absolute hygiene.',
    imgUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-301',
    roomNumber: '301',
    category: 'Standard AC',
    pricePerDay: 1200,
    capacity: 2,
    beds: '1 Double Bed',
    amenities: ['Air Conditioning', 'Free High-speed Wi-Fi', 'Attached Bathroom', 'Smart TV', 'Geyser', 'Quiet Recovery Zone'],
    status: 'Available',
    description: 'Quiet third-floor sanctuary crafted for post-surgery recovery. Excellent sound insulation, double blackout curtains, and high-pressure hot water.',
    imgUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'room-302',
    roomNumber: '302',
    category: 'Standard Non-AC',
    pricePerDay: 750,
    capacity: 2,
    beds: '1 Double Bed',
    amenities: ['Ceiling Fan', 'Attached Bathroom', 'Free High-speed Wi-Fi', 'Elevator Access', 'RO Drinking Water'],
    status: 'Maintenance',
    description: 'Budget-friendly second-floor room undergoing periodic sanitization and deep cleaning to maintain zero infection standards for incoming patients.',
    imgUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
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
    roomCategory: 'Deluxe Family AC',
    assignedRoomId: 'room-202',
    checkInDate: '2026-06-12',
    checkOutDate: '2026-06-25',
    status: 'CheckedIn',
    totalAmount: 28600,
    needTravelAssistance: true,
    travelDetails: {
      pickupPoint: 'Chennai Airport',
      pickupTime: '2026-06-12 14:00',
      flightOrTrainNo: '6E-2435 Indigo'
    },
    specialInstructions: 'Patient needs a wheelchair at arrival. Booking kitchenette suite for cooking clean Bengali meals.',
    createdAt: '2026-06-10T11:30:00Z'
  },
  {
    id: 'booking-1002',
    guestName: 'Kamesh Nair',
    guestPhone: '+91 98450 67890',
    guestEmail: 'kameshnair@gmail.com',
    guestState: 'Kerala',
    patientCardNo: 'CMC-103452-Y',
    roomCategory: 'Deluxe Double AC',
    assignedRoomId: 'room-201',
    checkInDate: '2026-06-14',
    checkOutDate: '2026-06-18',
    status: 'Confirmed',
    totalAmount: 6400,
    needTravelAssistance: true,
    travelDetails: {
      pickupPoint: 'Katpadi Railway Station',
      pickupTime: '2026-06-14 06:15',
      flightOrTrainNo: '12626 Kerala Express'
    },
    specialInstructions: 'Please arrange local auto shuttle back and forth to CMC Gate 1 on treatment days.',
    createdAt: '2026-06-12T15:24:00Z'
  },
  {
    id: 'booking-1003',
    guestName: 'Dr. Sanjay Agarwal',
    guestPhone: '+91 99100 88221',
    guestState: 'Uttar Pradesh',
    roomCategory: 'Standard AC',
    status: 'Pending',
    totalAmount: 3600,
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
    roomCategory: 'Standard AC',
    assignedRoomId: 'room-301',
    checkInDate: '2026-06-05',
    checkOutDate: '2026-06-13',
    status: 'Completed',
    totalAmount: 9600,
    needTravelAssistance: true,
    travelDetails: {
      pickupPoint: 'Chennai Airport',
      pickupTime: '2026-06-05 10:10',
      flightOrTrainNo: 'BG-0083 Biman Bangladesh'
    },
    specialInstructions: 'Needs assistance with currency exchange and Sim card set-up upon Arrival.',
    createdAt: '2026-06-01T09:20:00Z'
  }
];

// Seed Travel Services
const DEFAULT_TRAVEL: TravelService[] = [
  {
    id: 'travel-1',
    serviceName: 'Katpadi Station Shuttle',
    vehicleType: 'Auto Rickshaw / Hatchback',
    ratePerKm: 15,
    fixedRate: 150,
    coverage: 'Local Vellore',
    description: 'Quick reliable transport from Katpadi Junction Railway Station straight to our guesthouse doorstep. Attendants will assist with luggage carrying.',
    isAvailable: true,
    driverName: 'Suresh Kumar',
    driverContact: '+91 95000 88771'
  },
  {
    id: 'travel-2',
    serviceName: 'Chennai Airport Express',
    vehicleType: 'Sedan (Toyota Etios/Swift DZire)',
    ratePerKm: 13,
    fixedRate: 3200,
    coverage: 'Airport Pickup',
    description: 'Hassle-free AC sedan pickup from Chennai International Airport directly to Scudder road, Vellore. Driver handles flight monitoring to ensure instant pickup on landing.',
    isAvailable: true,
    driverName: 'Murugan G.',
    driverContact: '+91 94441 55662'
  },
  {
    id: 'travel-3',
    serviceName: 'Bengaluru Airport Super-Comfort',
    vehicleType: 'SUV (Toyota Innova Crysta)',
    ratePerKm: 18,
    fixedRate: 5200,
    coverage: 'Airport Pickup',
    description: 'Premium absolute comfort, orthopedic seats, ideal for patients who have undergone critical procedures. Spacious enough for wheelchairs and large bags.',
    isAvailable: true,
    driverName: 'Anand Dev',
    driverContact: '+91 88992 01020'
  },
  {
    id: 'travel-4',
    serviceName: 'Daily Hospital Shuttle',
    vehicleType: 'Eco-E-Rickshaw (Wheelchair Fit)',
    ratePerKm: 0,
    fixedRate: 50,
    coverage: 'Local Vellore',
    description: 'Constant back-and-forth transit care to CMC Hospital Main Building, OPD, or Mental Health Dept. Cleanly fitted with safe ramps.',
    isAvailable: true,
    driverName: 'Selvam',
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
