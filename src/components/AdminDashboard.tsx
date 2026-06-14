/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dataService';
import { Booking, GuestRoom, TravelService, ContactInquiry, Testimonial } from '../types';
import { 
  BarChart3, CalendarDays, KeyRound, Truck, 
  Mail, Settings, CheckCircle2, AlertCircle, Trash2, 
  User, RefreshCw, IndianRupee, ShieldCheck, MapPin, 
  Maximize2, Plus, Edit2, Check, X, ShieldAlert, Menu, Upload, LogOut
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

export default function AdminDashboard({ onBackToWebsite }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'rooms' | 'travel' | 'inquiries' | 'content'>('overview');
  
  // Local reactive states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<GuestRoom[]>([]);
  const [travels, setTravels] = useState<TravelService[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Filter states
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('All');
  const [assigningRoomId, setAssigningRoomId] = useState<string | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<string>('');

  // Editing pricing states
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newRoomPrice, setNewRoomPrice] = useState<number>(0);

  // Driver edit states
  const [editingDriverServiceId, setEditingDriverServiceId] = useState<string | null>(null);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverContact, setNewDriverContact] = useState('');

  // Content state additions
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRelation, setNewReviewRelation] = useState('Patient Relative');
  const [newReviewState, setNewReviewState] = useState('West Bengal');
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Mobile admin navigation layout state
  const [isAdminNavigationOpen, setIsAdminNavigationOpen] = useState(false);

  // Full Room Catalog CRUD state
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [roomFormMode, setRoomFormMode] = useState<'create' | 'edit'>('create');
  const [editingRoomIdForCatalog, setEditingRoomIdForCatalog] = useState<string | null>(null);
  
  // Room entry state fields
  const [roomFormNumber, setRoomFormNumber] = useState('');
  const [roomFormCategory, setRoomFormCategory] = useState<string>('Non-AC Single Room');
  const [roomFormPricePerDay, setRoomFormPricePerDay] = useState<number>(300);
  const [roomFormCapacity, setRoomFormCapacity] = useState<number>(1);
  const [roomFormBeds, setRoomFormBeds] = useState('');
  const [roomFormAmenities, setRoomFormAmenities] = useState<string>('');
  const [roomFormDescription, setRoomFormDescription] = useState('');
  const [roomFormImgUrl, setRoomFormImgUrl] = useState('');
  const [roomFormStatus, setRoomFormStatus] = useState<GuestRoom['status']>('Available');

  // Manual Back-Office Bookings Walk-in parameters
  const [isManualBookingFormOpen, setIsManualBookingFormOpen] = useState(false);
  const [manualGuestName, setManualGuestName] = useState('');
  const [manualGuestPhone, setManualGuestPhone] = useState('');
  const [manualGuestState, setManualGuestState] = useState('West Bengal');
  const [manualRoomCategory, setManualRoomCategory] = useState('Non-AC Single Room');
  const [manualCheckIn, setManualCheckIn] = useState('');
  const [manualCheckOut, setManualCheckOut] = useState('');
  const [manualSpecialInstructions, setManualSpecialInstructions] = useState('');
  const [manualPatientCardNo, setManualPatientCardNo] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    dbService.init();
    const loadedBookings = dbService.getBookings();
    const loadedRooms = dbService.getRooms();
    const loadedTravels = dbService.getTravelServices();
    const loadedInqs = dbService.getInquiries();
    const loadedTests = dbService.getTestimonials();

    setBookings(loadedBookings);
    setRooms(loadedRooms);
    setTravels(loadedTravels);
    setInquiries(loadedInqs);
    setTestimonials(loadedTests);
    setAnalytics(dbService.getAnalytics());
  };

  const handleBookingStatusChange = (bookingId: string, status: Booking['status'], roomId?: string) => {
    const updated = dbService.updateBookingStatus(bookingId, status, roomId);
    loadAllData();
  };

  const handleRoomStatusChange = (roomId: string, status: GuestRoom['status']) => {
    dbService.updateRoomStatus(roomId, status);
    loadAllData();
  };

  const handlePriceUpdate = (roomId: string) => {
    if (newRoomPrice <= 0) return;
    dbService.updateRoomPrice(roomId, newRoomPrice);
    setEditingRoomId(null);
    loadAllData();
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm('Are you certain you want to remove this booking request?')) {
      dbService.deleteBooking(bookingId);
      loadAllData();
    }
  };

  const handleMarkInquiryRead = (inqId: string) => {
    dbService.markInquiryAsRead(inqId);
    loadAllData();
  };

  const handleDeleteInquiry = (inqId: string) => {
    dbService.deleteInquiry(inqId);
    loadAllData();
  };

  const handleUpdateDriver = (srvId: string) => {
    dbService.updateDriverDetails(srvId, newDriverName, newDriverContact);
    setEditingDriverServiceId(null);
    loadAllData();
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;

    dbService.addTestimonial({
      author: newReviewAuthor,
      relation: newReviewRelation,
      state: newReviewState,
      rating: 5,
      text: newReviewText
    });

    setNewReviewAuthor('');
    setNewReviewText('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
    loadAllData();
  };
  
  // Direct file drag and drop image upload states and handlers
  const [roomImgDragOver, setRoomImgDragOver] = useState(false);

  const handleRoomImgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setRoomImgDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processRoomImageFile(file);
    }
  };

  const processRoomImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files (PNG, JPG, JPEG, WEBP) are supported.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRoomFormImgUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCreateRoom = () => {
    setRoomFormMode('create');
    setEditingRoomIdForCatalog(null);
    setRoomFormNumber('');
    setRoomFormCategory('Non-AC Single Room');
    setRoomFormPricePerDay(300);
    setRoomFormCapacity(1);
    setRoomFormBeds('1 Single Bed');
    setRoomFormAmenities('Common Kitchen Access, Tap Water (Free), Self-Cleaning Setup');
    setRoomFormDescription('');
    setRoomFormImgUrl('https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80');
    setRoomFormStatus('Available');
    setIsRoomFormOpen(true);
  };

  const handleOpenEditRoom = (room: GuestRoom) => {
    setRoomFormMode('edit');
    setEditingRoomIdForCatalog(room.id);
    setRoomFormNumber(room.roomNumber);
    setRoomFormCategory(room.category);
    setRoomFormPricePerDay(room.pricePerDay);
    setRoomFormCapacity(room.capacity);
    setRoomFormBeds(room.beds);
    setRoomFormAmenities(room.amenities.join(', '));
    setRoomFormDescription(room.description);
    setRoomFormImgUrl(room.imgUrl);
    setRoomFormStatus(room.status);
    setIsRoomFormOpen(true);
  };

  const handleSaveRoomCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormNumber || !roomFormCategory) return;

    const amenitiesArray = roomFormAmenities
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const roomData = {
      roomNumber: roomFormNumber,
      category: roomFormCategory as any,
      pricePerDay: Number(roomFormPricePerDay),
      capacity: Number(roomFormCapacity),
      beds: roomFormBeds,
      amenities: amenitiesArray,
      description: roomFormDescription,
      imgUrl: roomFormImgUrl || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
      status: roomFormStatus
    };

    if (roomFormMode === 'create') {
      dbService.addRoom(roomData);
    } else if (roomFormMode === 'edit' && editingRoomIdForCatalog) {
      dbService.updateRoom(editingRoomIdForCatalog, roomData);
    }

    setIsRoomFormOpen(false);
    loadAllData();
  };

  const handleDeleteRoomFromCatalog = (roomId: string) => {
    if (confirm('Are you absolutely sure you want to completely remove this room entry from the catalog?')) {
      dbService.deleteRoom(roomId);
      loadAllData();
    }
  };

  const handleSaveManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualGuestName || !manualGuestPhone || !manualCheckIn || !manualCheckOut) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceMap: { [key: string]: number } = {
      'Non-AC Single Room': 300,
      'AC Single Room': 700,
      'Non-AC Double Room with Balcony': 800,
      'AC Double Room': 1200,
      'AC Deluxe Suite with Kitchenette': 1500
    };
    const rate = priceMap[manualRoomCategory] || 500;
    
    const date1 = new Date(manualCheckIn);
    const date2 = new Date(manualCheckOut);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

    dbService.addBooking({
      guestName: manualGuestName,
      guestPhone: manualGuestPhone,
      guestState: manualGuestState,
      roomCategory: manualRoomCategory as any,
      checkInDate: manualCheckIn,
      checkOutDate: manualCheckOut,
      totalAmount: rate * days,
      needTravelAssistance: false,
      status: 'Pending',
      specialInstructions: manualSpecialInstructions || undefined,
      patientCardNo: manualPatientCardNo || undefined
    });

    setIsManualBookingFormOpen(false);
    setManualGuestName('');
    setManualGuestPhone('');
    setManualCheckIn('');
    setManualCheckOut('');
    setManualSpecialInstructions('');
    setManualPatientCardNo('');
    loadAllData();
  };

  // Pre-configured list of states to filter booking sources
  const activeBookings = bookings.filter((b) => {
    if (bookingFilterStatus === 'All') return true;
    return b.status === bookingFilterStatus;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
      
      {/* Navigation matching landing page */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200 z-40 transition-all shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2.5 rounded-xl shadow-md shrink-0 flex items-center justify-center border border-white/10" id="seenu-brand-logo">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Abstract hospitality + tour logo: A stylish roof with dual interlacing paths (for tours & travels) */}
                <path d="M3 10L12 3L21 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12V20C5 21.1046 5.89543 22 7 22H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M19 12V20C19 21.1046 18.1046 22 17 22H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                {/* Emerald active travel curve representing safe health journeys */}
                <path d="M9 13C9 13 11 11.5 12 11.5C13 11.5 15 13 15 13C15 13 13.5 16 12 16C10.5 16 9 13 9 13Z" fill="#10B981" />
                <circle cx="12" cy="11.5" r="1.5" fill="white" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-sans tracking-tight text-slate-900">
                Seenu Guest House
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] bg-blue-50 text-blue-700 border border-blue-150 py-0.5 px-2.5 rounded-full font-mono uppercase font-semibold shrink-0">
                  Tours & Travels
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onBackToWebsite}
              className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold tracking-tight transition cursor-pointer hidden sm:flex items-center gap-1.5 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Portal</span>
            </button>

            {/* Hamburger Toggle button always visible */}
            <button
              onClick={() => setIsAdminNavigationOpen(!isAdminNavigationOpen)}
              className="p-2 rounded-xl text-slate-650 hover:text-blue-600 hover:bg-slate-100 transition focus:outline-none cursor-pointer"
              title="Toggle Menu"
              id="admin-nav-toggle"
            >
              {isAdminNavigationOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Dropdown Menu matching landing page style */}
        {isAdminNavigationOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl space-y-4 animate-fade-in" id="admin-dropdown-menu">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold mb-2 px-3">
                Management Modules
              </p>
              <button
                onClick={() => { setActiveTab('overview'); setIsAdminNavigationOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition flex items-center gap-3 ${
                  activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics Dashboard
              </button>
              <button
                onClick={() => { setActiveTab('bookings'); setIsAdminNavigationOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition flex items-center justify-between ${
                  activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4" />
                  <span>Residency Bookings</span>
                </div>
                {analytics?.pendingApprovalsCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-rose-500 text-white">
                    {analytics.pendingApprovalsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('rooms'); setIsAdminNavigationOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition flex items-center gap-3 ${
                  activeTab === 'rooms' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                Rooms Status Matrix
              </button>
              <button
                onClick={() => { setActiveTab('travel'); setIsAdminNavigationOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition flex items-center gap-3 ${
                  activeTab === 'travel' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Truck className="w-4 h-4" />
                Transit Shuttles Desk
              </button>
              <button
                onClick={() => { setActiveTab('inquiries'); setIsAdminNavigationOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition flex items-center justify-between ${
                  activeTab === 'inquiries' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>Visitor Inquiries</span>
                </div>
                {analytics?.unreadInquiriesCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-red-500 text-white">
                    {analytics.unreadInquiriesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('content'); setIsAdminNavigationOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition flex items-center gap-3 ${
                  activeTab === 'content' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Plus className="w-4 h-4" />
                Content & Reviews Editor
              </button>

              <div className="border-t border-slate-100 mt-2.5 pt-2.5">
                <button
                  onClick={onBackToWebsite}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-3 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Logout & Exit to Website
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Admin Workspace Structure */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 gap-6 relative">
        
        {/* Left Side menu rail */}
        <nav className="hidden lg:flex lg:relative bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-col gap-2 shrink-0 lg:w-64">
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black mb-3 px-3">
            Management Modules
          </p>
          <button
            onClick={() => { setActiveTab('overview'); setIsAdminNavigationOpen(false); }}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'overview' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4.5 h-4.5" />
            Analytics Dashboard
          </button>
          <button
            onClick={() => { setActiveTab('bookings'); setIsAdminNavigationOpen(false); }}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center justify-between transition cursor-pointer ${
              activeTab === 'bookings' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="w-4.5 h-4.5" />
              <span>Residency Bookings</span>
            </div>
            {analytics?.pendingApprovalsCount > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'bookings' ? 'bg-slate-950 text-emerald-400' : 'bg-rose-500 text-white'
              }`}>
                {analytics.pendingApprovalsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('rooms'); setIsAdminNavigationOpen(false); }}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'rooms' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <KeyRound className="w-4.5 h-4.5" />
            Rooms Status Matrix
          </button>
          <button
            onClick={() => { setActiveTab('travel'); setIsAdminNavigationOpen(false); }}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'travel' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Truck className="w-4.5 h-4.5" />
            Transit Shuttles Desk
          </button>
          <button
            onClick={() => { setActiveTab('inquiries'); setIsAdminNavigationOpen(false); }}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center justify-between transition cursor-pointer ${
              activeTab === 'inquiries' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4.5 h-4.5" />
              <span>Visitor Inquiries</span>
            </div>
            {analytics?.unreadInquiriesCount > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'inquiries' ? 'bg-slate-950 text-emerald-400' : 'bg-red-500 text-white'
              }`}>
                {analytics.unreadInquiriesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('content'); setIsAdminNavigationOpen(false); }}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'content' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Plus className="w-4.5 h-4.5" />
            Content & Reviews Editor
          </button>

          <div className="mt-auto pt-4 border-t border-slate-800">
            <button
              onClick={onBackToWebsite}
              className="w-full text-left font-semibold text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer text-rose-400 hover:bg-rose-955/20 hover:text-rose-300"
            >
              <LogOut className="w-4.5 h-4.5" />
              Logout & Exit Portal
            </button>
          </div>

        </nav>

        {/* Right workspace panels */}
        <main className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:overflow-y-auto lg:max-h-[85vh]">
          {analytics === null ? (
            <div className="py-20 text-center text-slate-400">Loading analytic streams...</div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & ANALYTICS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold font-sans tracking-tight text-white">Analytics & Performance Reports</h2>
                      <p className="text-xs text-slate-400 mt-1">Real-time statistics sourced direct from guesthouse SQLite-local streams.</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">As of {new Date().toLocaleDateString()}</span>
                  </div>

                  {/* Summary Metric tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Active Occupancy Rate</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-black text-emerald-400">{analytics.occupancyRate}%</span>
                        <span className="text-xs text-slate-400">({analytics.occupiedCount}/{analytics.totalRooms} rooms)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analytics.occupancyRate}%` }} />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Projected/Confirmed Revenue</p>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-black font-mono text-white">₹{analytics.totalRevenue.toLocaleString()}</span>
                        <span className="text-xs text-slate-500">Total</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-3 font-mono">From {analytics.totalBookingsCount} registrations</p>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Action items required</p>
                      <div className="flex items-baseline gap-3 mt-2">
                        <span className="text-3xl font-black text-rose-400">{analytics.pendingApprovalsCount}</span>
                        <span className="text-xs text-slate-400">Bookings pending approval</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-3 font-mono block">Needs review across room allocations</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Clean alerts / maint</p>
                      <div className="flex items-baseline gap-3 mt-2">
                        <span className="text-3xl font-black text-blue-400">{analytics.cleaningCount}</span>
                        <span className="text-xs text-slate-400">Rooms being deep cleaned</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-3 font-mono block">Maintenance holds: {analytics.maintenanceCount}</span>
                    </div>
                  </div>

                  {/* Operational breakdown charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                    {/* Patients origin states breakdown */}
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div>
                        <h3 className="font-bold text-white text-base font-sans">Geographic Patient Attendants flow</h3>
                        <p className="text-xs text-slate-400">Where our guests travel from to CMC hospital.</p>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(analytics.patientStateDistribution).length === 0 ? (
                          <p className="text-slate-400 text-xs">No guest records found.</p>
                        ) : (
                          Object.entries(analytics.patientStateDistribution).map(([state, count]: [string, any]) => {
                            const pct = Math.round((count / analytics.totalBookingsCount) * 100);
                            return (
                              <div key={state} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-slate-300">{state}</span>
                                  <span className="text-slate-400 font-mono font-bold">{count} ({pct}%)</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Shuttles workload map */}
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div>
                        <h3 className="font-bold text-white text-base font-sans">Airport Arrivals Workload</h3>
                        <p className="text-xs text-slate-400">Allocated transit requests by port of landing.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                            <span className="text-2xl font-black font-mono text-emerald-400">{analytics.travelPickupsBreakdown['Chennai Airport']}</span>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold mt-1">Chennai (MAA)</span>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                            <span className="text-2xl font-black font-mono text-blue-400">{analytics.travelPickupsBreakdown['Bangalore Airport']}</span>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold mt-1">Bangalore (BLR)</span>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                            <span className="text-2xl font-black font-mono text-amber-400">{analytics.travelPickupsBreakdown['Katpadi Railway Station']}</span>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold mt-1">Katpadi Train</span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <p className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-emerald-400" />
                            Active Shuttle Services Rate: {analytics.travelRequestsCount} Booked Transits
                          </p>
                          <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                            Airport transfers include live flight delay coordinate lookups to avoid driver wait-charge overrides at the terminal arrivals loops.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back-Office Operations Guide */}
                  <div className="bg-emerald-950/40 border border-emerald-900/50 p-4 rounded-xl flex items-center gap-4">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div className="text-xs text-emerald-200">
                      <span className="font-bold uppercase tracking-wider block font-mono">Operations Desk Guide:</span>
                      <p className="font-light mt-0.5 leading-relaxed">
                        Navigate to the "Residency Bookings" tab, find a booking that is **Pending** or **Confirmed**, and check their request-in. You can assign rooms directly or mark their status as "Checked-In" to see the "Room Status Matrix" automatically flag that room as Occupied in real-time.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BOOKINGS REGISTER */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold font-sans text-white">Residency Bookings Ledger</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Filter, approve, clean assign, and manage all patient stays near CMC.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                      <button
                        onClick={() => setIsManualBookingFormOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg w-full sm:w-auto justify-center"
                        id="back-office-walk-in-btn"
                      >
                        <Plus className="w-3.5 h-3.5" /> Book Walk-In Guest
                      </button>
                      
                      {/* Status Tabs filter */}
                      <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono w-full sm:w-auto">
                        {['All', 'Pending', 'Confirmed', 'CheckedIn', 'Completed', 'Cancelled'].map((st) => (
                          <button
                            key={st}
                            onClick={() => setBookingFilterStatus(st)}
                            className={`px-2 py-1 rounded-lg font-semibold transition cursor-pointer flex-1 sm:flex-initial text-center ${
                              bookingFilterStatus === st ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Manual Walk-in Booking centered modal form overlay */}
                  {isManualBookingFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
                      <form 
                        onSubmit={handleSaveManualBooking}
                        className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-left relative animate-scale-up"
                        id="back-office-manual-booking-form"
                      >
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                          <div>
                            <h3 className="font-bold text-white text-base">Register Walk-In Attendant stayed Reservation</h3>
                            <p className="text-[11px] text-slate-400 mt-1">Manually catalog a walk-in companion or patient stay directly into the active Operations ledger.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsManualBookingFormOpen(false)}
                            className="text-slate-400 hover:text-white bg-slate-850 border border-slate-700 p-2 rounded-lg transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3 font-sans">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Guest / Attendant Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Priyan Sen Gupta"
                              value={manualGuestName}
                              onChange={(e) => setManualGuestName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Attendant Phone Number *</label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. +91 98765 43210"
                                value={manualGuestPhone}
                                onChange={(e) => setManualGuestPhone(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Guest State / Origin *</label>
                              <select
                                value={manualGuestState}
                                onChange={(e) => setManualGuestState(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                              >
                                <option value="West Bengal">West Bengal</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Assam">Assam</option>
                                <option value="Tripura">Tripura</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Odisha font">Odisha</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Other Area">Other Area</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Planned Check-In *</label>
                              <input
                                type="date"
                                required
                                value={manualCheckIn}
                                onChange={(e) => setManualCheckIn(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Planned Check-Out *</label>
                              <input
                                type="date"
                                required
                                value={manualCheckOut}
                                onChange={(e) => setManualCheckOut(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Desired Room Category *</label>
                              <select
                                value={manualRoomCategory}
                                onChange={(e) => setManualRoomCategory(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                              >
                                <option value="Non-AC Single Room">Non-AC Single Room</option>
                                <option value="AC Single Room">AC Single Room</option>
                                <option value="Non-AC Double Room with Balcony">Non-AC Double Room with Balcony</option>
                                <option value="AC Double Room">AC Double Room</option>
                                <option value="AC Deluxe Suite with Kitchenette">AC Deluxe Suite with Kitchenette</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">CMC Patient Card No / UHID No</label>
                              <input
                                type="text"
                                placeholder="e.g. CMC892211"
                                value={manualPatientCardNo}
                                onChange={(e) => setManualPatientCardNo(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Companion Attendant Details & Notes</label>
                            <textarea
                              rows={2}
                              placeholder="e.g. Attending with family, wants to use shared self-cooking stove kitchen."
                              value={manualSpecialInstructions}
                              onChange={(e) => setManualSpecialInstructions(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => setIsManualBookingFormOpen(false)}
                            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-350 px-4 py-2 rounded-xl text-xs font-semibold transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-550 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
                          >
                            Create Active Reservation
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeBookings.length === 0 ? (
                    <div className="bg-slate-950 rounded-2xl py-12 text-center border border-slate-800 text-slate-400 text-sm">
                      No bookings matching "{bookingFilterStatus}" was found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeBookings.map((bk) => {
                        const isAssigningThis = assigningRoomId === bk.id;
                        return (
                          <div 
                            key={bk.id}
                            className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/40 pb-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-slate-400" />
                                    {bk.guestName}
                                  </h3>
                                  <span className="bg-slate-900 text-slate-400 border border-slate-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {bk.guestState}
                                  </span>
                                  {bk.patientCardNo && (
                                    <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/50 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                                      UHID: {bk.patientCardNo}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 font-mono">{bk.guestPhone} | ID: {bk.id}</p>
                              </div>

                              <div>
                                <span className={`px-3 py-1 font-mono text-xs rounded-full font-black uppercase tracking-wider ${
                                  bk.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                  bk.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                  bk.status === 'CheckedIn' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                                  bk.status === 'Completed' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  ● {bk.status}
                                </span>
                              </div>
                            </div>

                            {/* Core Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-2">
                              <div>
                                <p className="text-slate-500 uppercase tracking-widest font-mono text-[10px]">Lodging Choice</p>
                                <p className="font-semibold text-slate-100 mt-1">{bk.roomCategory}</p>
                                <p className="text-emerald-400 font-mono mt-0.5 font-bold">₹{bk.totalAmount.toLocaleString()} Estimated</p>
                              </div>

                              <div>
                                <p className="text-slate-500 uppercase tracking-widest font-mono text-[10px]">Planned Stay range</p>
                                <div className="mt-1 space-y-0.5">
                                  <p className="text-slate-200"><span className="font-mono text-slate-500">In:</span> {bk.checkInDate}</p>
                                  <p className="text-slate-200"><span className="font-mono text-slate-500">Out:</span> {bk.checkOutDate}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-slate-500 uppercase tracking-widest font-mono text-[10px]">Shuttle / Transit Booking</p>
                                {bk.needTravelAssistance && bk.travelDetails ? (
                                  <div className="mt-1 space-y-0.5 text-slate-200">
                                    <p className="font-semibold text-emerald-400">🚕 Pickup Activated</p>
                                    <p className="font-mono text-[11px] truncate">{bk.travelDetails.pickupPoint}</p>
                                    <p className="text-slate-400 font-mono text-[10px]">No: {bk.travelDetails.flightOrTrainNo}</p>
                                  </div>
                                ) : (
                                  <p className="text-slate-500 font-light mt-1">No custom transit pickup requested</p>
                                )}
                              </div>
                            </div>

                            {bk.specialInstructions && (
                              <div className="p-3 bg-slate-900 border border-slate-800/40 rounded-lg text-xs leading-relaxed text-slate-400 italic">
                                <span className="font-bold text-slate-200 not-italic">Companion details:</span> {bk.specialInstructions}
                              </div>
                            )}

                            {/* Actions and Assignment Control */}
                            <div className="flex flex-wrap gap-3 items-center justify-between pt-3 border-t border-slate-800/20">
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* If checked in, see the room */}
                                {bk.assignedRoomId ? (
                                  <span className="font-mono bg-blue-950/40 text-blue-400 border border-blue-900/40 font-semibold px-2.5 py-1 rounded-lg text-xs">
                                    Assigned Room: {rooms.find(r => r.id === bk.assignedRoomId)?.roomNumber || bk.assignedRoomId}
                                  </span>
                                ) : (
                                  <span className="font-mono bg-rose-950/20 text-rose-400 border border-rose-900/40 px-2.5 py-1 rounded-lg text-xs">
                                    ⚠️ Unassigned Room
                                  </span>
                                )}

                                {isAssigningThis ? (
                                  <div className="flex items-center gap-2 mt-1 shrink-0 bg-slate-900 p-1.5 rounded-lg border border-slate-700 animate-scale-up">
                                    <select
                                      value={selectedRoomForBooking}
                                      onChange={(e) => setSelectedRoomForBooking(e.target.value)}
                                      className="bg-slate-950 border border-slate-700 rounded text-xs px-2 py-1 text-white focus:outline-none"
                                    >
                                      <option value="">Choose Room...</option>
                                      {rooms
                                        .filter((r) => r.category === bk.roomCategory && r.status === 'Available')
                                        .map((r) => (
                                          <option key={r.id} value={r.id}>Room {r.roomNumber}</option>
                                        ))}
                                    </select>
                                    <button
                                      disabled={!selectedRoomForBooking}
                                      onClick={() => {
                                        handleBookingStatusChange(bk.id, 'Confirmed', selectedRoomForBooking);
                                        setAssigningRoomId(null);
                                        setSelectedRoomForBooking('');
                                      }}
                                      className="bg-emerald-500 text-slate-950 p-1 rounded hover:bg-emerald-400 transition cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5 line-clamp-1" />
                                    </button>
                                    <button
                                      onClick={() => setAssigningRoomId(null)}
                                      className="bg-rose-500 text-white p-1 rounded hover:bg-rose-400 transition cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  bk.status === 'Pending' && (
                                    <button
                                      onClick={() => {
                                        setAssigningRoomId(bk.id);
                                        setSelectedRoomForBooking('');
                                      }}
                                      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition shadow cursor-pointer"
                                    >
                                      Assign Room & Confirm
                                    </button>
                                  )
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Workflow buttons */}
                                {bk.status === 'Confirmed' && (
                                  <button
                                    onClick={() => handleBookingStatusChange(bk.id, 'CheckedIn')}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                                  >
                                    Register Guest Check-In
                                  </button>
                                )}

                                {bk.status === 'CheckedIn' && (
                                  <button
                                    onClick={() => handleBookingStatusChange(bk.id, 'Completed')}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                                  >
                                    Guest Checkout & Bill
                                  </button>
                                )}

                                {bk.status !== 'Completed' && bk.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleBookingStatusChange(bk.id, 'Cancelled')}
                                    className="bg-slate-800 hover:bg-slate-700 hover:text-rose-400 text-slate-400 border border-slate-700 text-xs px-3 py-1.5 rounded-lg transition"
                                  >
                                    Cancel Booking
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteBooking(bk.id)}
                                  className="text-slate-500 hover:text-red-400 p-1.5 rounded transition"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
                   {/* TAB 3: ROOM AVAILABILITY MATRIX */}
              {activeTab === 'rooms' && (
                <div className="space-y-6 animate-scale-up">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold font-sans text-white">Guest Room Catalog & Matrix Controls</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Add, Edit, or Remove rooms from the live booking inventory, and manage immediate override status parameters.</p>
                    </div>
                    <button
                      onClick={handleOpenCreateRoom}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                      id="admin-btn-add-room"
                    >
                      <Plus className="w-4 h-4" /> Add New Guest Room
                    </button>
                  </div>

                  {/* Beautiful Screen-Centered Modal Form for Room Creation / Editing */}
                  {isRoomFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
                      <form 
                        onSubmit={handleSaveRoomCatalogItem} 
                        className="bg-slate-900 border border-slate-800/80 p-6 sm:p-7 rounded-2xl space-y-5 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up text-left relative"
                        id="admin-room-catalog-form"
                      >
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                          <div>
                            <h3 className="font-bold text-white text-base">
                              {roomFormMode === 'create' ? 'Create Guest Room Catalog Entry' : `Configure Catalog Settings — Room ${roomFormNumber}`}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1">Specify specifications, room capacity, rent rates, features, and direct interior photography.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsRoomFormOpen(false)}
                            className="text-slate-400 hover:text-white bg-slate-800 border border-slate-700 p-2 rounded-lg transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Room Number *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 104 or 203"
                              value={roomFormNumber}
                              onChange={(e) => setRoomFormNumber(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Room Category *</label>
                            <select
                              value={roomFormCategory}
                              onChange={(e) => setRoomFormCategory(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="Non-AC Single Room font">Non-AC Single Room</option>
                              <option value="AC Single Room font">AC Single Room</option>
                              <option value="Non-AC Double Room with Balcony">Non-AC Double Room with Balcony</option>
                              <option value="AC Double Room">AC Double Room</option>
                              <option value="AC Deluxe Suite with Kitchenette">AC Deluxe Suite with Kitchenette</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Status Override State *</label>
                            <select
                              value={roomFormStatus}
                              onChange={(e) => setRoomFormStatus(e.target.value as any)}
                              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="Available">Available</option>
                              <option value="Occupied">Occupied</option>
                              <option value="Cleaning">Cleaning</option>
                              <option value="Maintenance">Maintenance</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Daily Rent (Price in INR) *</label>
                            <input
                              type="number"
                              required
                              min={0}
                              value={roomFormPricePerDay}
                              onChange={(e) => setRoomFormPricePerDay(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Adult Capacity (Number of Guests) *</label>
                            <input
                              type="number"
                              required
                              min={1}
                              value={roomFormCapacity}
                              onChange={(e) => setRoomFormCapacity(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Beds Specification *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 2 Single Beds or 1 King Bed"
                              value={roomFormBeds}
                              onChange={(e) => setRoomFormBeds(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Features & Amenities (Comma-separated List)</label>
                          <input
                            type="text"
                            placeholder="e.g. Air Conditioning, Shared Kitchen Setup, Smart TV, Balcony Access, RO Purifier"
                            value={roomFormAmenities}
                            onChange={(e) => setRoomFormAmenities(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Direct File Upload & Preview Section */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Direct Interior Photo Upload *</label>
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                            {/* Live preview container */}
                            <div className="sm:col-span-2 border border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center relative p-1.5 h-36">
                              {roomFormImgUrl ? (
                                <>
                                  <img 
                                    src={roomFormImgUrl} 
                                    alt="Live Room Preview" 
                                    className="w-full h-full object-cover rounded-lg"
                                    referrerPolicy="no-referrer"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setRoomFormImgUrl('')}
                                    className="absolute top-1.5 right-1.5 bg-slate-950/80 border border-slate-800 hover:bg-rose-900 text-slate-200 p-1 rounded-md text-xs transition"
                                    title="Clear image"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <div className="text-center text-slate-600 p-2">
                                  <svg className="w-7 h-7 mx-auto mb-1 opacity-30 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <span className="text-[9px] font-mono block">No photo specified</span>
                                </div>
                              )}
                            </div>

                            {/* Drag-and-drop upload zone */}
                            <div 
                              onDragOver={(e) => { e.preventDefault(); setRoomImgDragOver(true); }}
                              onDragLeave={() => setRoomImgDragOver(false)}
                              onDrop={handleRoomImgDrop}
                              onClick={() => document.getElementById('room-file-upload-input')?.click()}
                              className={`sm:col-span-3 border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                                roomImgDragOver 
                                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                                  : 'border-slate-800 bg-slate-950/45 hover:bg-slate-900/60 hover:border-slate-700 text-slate-400'
                              }`}
                            >
                              <input
                                type="file"
                                id="room-file-upload-input"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    processRoomImageFile(file);
                                  }
                                }}
                              />
                              <Upload className="w-5 h-5 mb-1 text-slate-500" />
                              <p className="text-[11px] font-semibold text-slate-200">
                                {roomImgDragOver ? 'Drop to upload!' : 'Drag & drop room image file'}
                              </p>
                              <p className="text-[9px] text-slate-500 mt-0.5">or click to pick from computer</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Detailed Marketing Description</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Cozy space adjacent to the active shared Bengali stove setup. Completely clean and dustbin cleared daily."
                            value={roomFormDescription}
                            onChange={(e) => setRoomFormDescription(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => setIsRoomFormOpen(false)}
                            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-350 px-4 py-2 rounded-xl text-xs font-semibold transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition"
                          >
                            {roomFormMode === 'create' ? 'Publish Room to Inventory' : 'Save Catalog Configuration'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Rooms Cards Inventory Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <div 
                        key={room.id}
                        className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700/80 transition flex flex-col"
                      >
                        {/* Room Visual Hero Card Header */}
                        <div className="relative h-44 w-full bg-slate-900 shrink-0">
                          <img 
                            src={room.imgUrl || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'} 
                            alt={`Room ${room.roomNumber}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-85"
                          />
                          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-800 px-2.5 py-1 rounded-lg">
                            <span className="text-sm font-black font-sans text-white">Room {room.roomNumber}</span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className={`px-2.5 py-1 text-[10px] font-mono rounded-lg font-black uppercase tracking-wider backdrop-blur bg-opacity-80 border ${
                              room.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              room.status === 'Occupied' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              room.status === 'Cleaning' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {room.status}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-sm p-2 rounded-xl border border-slate-850/40">
                            <p className="text-[11px] font-bold text-slate-300 truncate font-sans">{room.category}</p>
                          </div>
                        </div>

                        <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start gap-4 text-xs font-mono">
                              <div>
                                <p className="text-slate-500 text-[10px] uppercase font-semibold">Daily Rent</p>
                                <p className="font-bold text-white text-base mt-0.5">₹{room.pricePerDay}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-slate-500 text-[10px] uppercase font-semibold">Sleeping Layout</p>
                                <p className="text-slate-300 mt-0.5">{room.beds} (👥 Max {room.capacity})</p>
                              </div>
                            </div>

                            {room.description && (
                              <p className="text-slate-400 text-xs font-light font-sans line-clamp-2 leading-relaxed italic">
                                "{room.description}"
                              </p>
                            )}

                            {/* Amenities Tag Cloud */}
                            <div className="border-t border-slate-900 pt-3">
                              <p className="text-slate-505 uppercase font-semibold font-mono text-[9px] tracking-wider mb-1.5">Amenities Included</p>
                              <div className="flex flex-wrap gap-1">
                                {room.amenities.map((amenity, idx) => (
                                  <span 
                                    key={idx}
                                    className="bg-slate-900 border border-slate-850 text-slate-400 text-[9px] px-2 py-0.5 rounded"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-slate-900 shrink-0">
                            <div>
                              <p className="text-slate-500 uppercase font-semibold font-mono text-[10px] mb-1.5 font">Change Status</p>
                              <div className="grid grid-cols-4 gap-1 text-[9px] font-mono">
                                {(['Available', 'Occupied', 'Cleaning', 'Maintenance'] as const).map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => handleRoomStatusChange(room.id, st)}
                                    className={`py-1 rounded text-center transition cursor-pointer hover:font-bold ${
                                      room.status === st 
                                        ? 'bg-slate-850 text-emerald-400 border border-slate-700' 
                                        : 'bg-slate-900 text-slate-500 border border-transparent hover:border-slate-800'
                                    }`}
                                  >
                                    {st === 'Maintenance' ? 'Maint' : st}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Catalog Action buttons: Edit and Delete */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900/45">
                              <button
                                onClick={() => handleOpenEditRoom(room)}
                                className="bg-slate-900 hover:bg-slate-850 hover:text-emerald-400 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs transition flex items-center justify-center gap-1 flex-1 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Configure Catalog
                              </button>
                              <button
                                onClick={() => handleDeleteRoomFromCatalog(room.id)}
                                className="bg-slate-900 hover:bg-rose-950/40 hover:text-rose-400 text-slate-500 border border-slate-800 p-2 rounded-xl transition cursor-pointer"
                                title="Delete Room Completely"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SHUTTLE LOGISTICS COORDINATOR */}
              {activeTab === 'travel' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-sans text-white">Transit Logistics Coordinator</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Assign airport driver contacts and monitor emergency medical shuttle routes.</p>
                  </div>

                  <div className="space-y-4">
                    {travels.map((srv) => {
                      const isEditingThisDriver = editingDriverServiceId === srv.id;
                      return (
                        <div 
                          key={srv.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-slate-700 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white text-base font-sans">{srv.serviceName}</h3>
                              <span className="bg-slate-900 text-slate-400 border border-slate-800 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                {srv.coverage}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{srv.description}</p>
                            
                            <div className="flex gap-4 pt-2 text-xs text-slate-400">
                              <span className="font-mono">💵 Rates: <span className="text-emerald-400 font-bold">₹{srv.fixedRate > 0 ? srv.fixedRate : `${srv.ratePerKm}/km`}</span></span>
                              <span className="font-mono">🚗 Fleet: <span className="font-semibold text-slate-200">{srv.vehicleType}</span></span>
                            </div>
                          </div>

                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/50 min-w-[240px] space-y-2">
                            <p className="text-slate-500 uppercase tracking-widest font-mono text-[9px]">Driver Assignment</p>
                            
                            {isEditingThisDriver ? (
                              <div className="space-y-2 animate-scale-up">
                                <input
                                  type="text"
                                  placeholder="Driver Full Name"
                                  value={newDriverName}
                                  onChange={(e) => setNewDriverName(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-700 text-xs rounded px-2 py-1 text-white focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Driver Contact Line"
                                  value={newDriverContact}
                                  onChange={(e) => setNewDriverContact(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-700 text-xs rounded px-2 py-1 text-white focus:outline-none"
                                />
                                <div className="flex gap-2 justify-end pt-1">
                                  <button
                                    onClick={() => handleUpdateDriver(srv.id)}
                                    className="bg-emerald-500 text-slate-950 font-bold px-2.5 py-1 rounded text-xs transition cursor-pointer"
                                  >
                                    Save Driver
                                  </button>
                                  <button
                                    onClick={() => setEditingDriverServiceId(null)}
                                    className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs hover:bg-slate-700 transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start gap-4">
                                <div className="text-xs">
                                  <p className="font-bold text-slate-200">{srv.driverName || 'No Driver Assigned'}</p>
                                  <p className="font-mono text-slate-400 text-[10px] mt-0.5">{srv.driverContact || 'N/A'}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    setEditingDriverServiceId(srv.id);
                                    setNewDriverName(srv.driverName || '');
                                    setNewDriverContact(srv.driverContact || '');
                                  }}
                                  className="text-slate-400 hover:text-emerald-400 text-xs font-semibold flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" /> Edit
                                </button>
                              </div>
                            )}

                            <div className="flex justify-between items-center border-t border-slate-800/40 pt-2 text-[10px] font-mono mt-2">
                              <span className="text-slate-400">Driver Status</span>
                              <button
                                onClick={() => {
                                  dbService.updateTravelAvailability(srv.id, !srv.isAvailable);
                                  loadAllData();
                                }}
                                className={`px-2 py-0.5 rounded font-black ${
                                  srv.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                }`}
                              >
                                {srv.isAvailable ? 'ACTIVE / SHUTTLING' : 'ON-LEAVE'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: VISITOR INQUIRIES DESK */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-sans text-white">Guest Inquiry Inbox</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Contact forms sent directly by medical tourists and outpatient families on our landing page.</p>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="bg-slate-950 py-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-sm">
                      No customer inquiries have been submitted.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inq) => (
                        <div 
                          key={inq.id}
                          className={`border rounded-xl p-5 space-y-3 transition ${
                            inq.isRead 
                              ? 'bg-slate-950/40 border-slate-800/40 opacity-75' 
                              : 'bg-slate-950 border-emerald-500/30'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-white text-base">{inq.name}</h3>
                                {!inq.isRead && (
                                  <span className="bg-emerald-500 text-slate-950 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                    NEW MESSAGE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">Phone: {inq.phone} {inq.email && `| Email: ${inq.email}`}</p>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">{new Date(inq.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="p-3 bg-slate-900 border border-slate-800/40 rounded-lg text-xs">
                            <p className="font-bold text-slate-300 font-sans">{inq.subject}</p>
                            <p className="text-slate-400 font-light mt-1.5 leading-relaxed font-sans">{inq.message}</p>
                          </div>

                          <div className="flex justify-end gap-2 text-xs pt-1">
                            {!inq.isRead && (
                              <button
                                onClick={() => handleMarkInquiryRead(inq.id)}
                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 font-semibold px-3.5 py-1.5 rounded-lg transition text-[11px]"
                              >
                                Mark as Acknowledged
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 px-3 py-1.5 rounded-lg transition text-[11px]"
                            >
                              Delete Inquiry
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: STATIC CONTENT & REVIEWS EDITOR */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-sans text-white">Business Content & Review Control</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Control dynamic content blocks like customer trust testimonials shown on the landing page.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Add Guest Review form input */}
                    <form onSubmit={handleAddTestimonial} className="lg:col-span-5 bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div>
                        <h3 className="font-bold text-white text-base">Add Guest Review</h3>
                        <p className="text-xs text-slate-400">Add reviews from recovering families directly into your active database.</p>
                      </div>

                      {reviewSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-bold">
                          ✓ Review successfully inserted! Check it on the homepage testimonial catalog.
                        </div>
                      )}

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Daughter/Attendant Name *</label>
                          <input
                            type="text"
                            required
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            placeholder="e.g. S. Banik"
                            className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Relation to Patient *</label>
                          <select
                            value={newReviewRelation}
                            onChange={(e) => setNewReviewRelation(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Patient Relative">Patient Relative</option>
                            <option value="Self Outpatient">Self Outpatient</option>
                            <option value="Patient Spouse">Patient Spouse</option>
                            <option value="Hospital Guest Coordinator">Hospital Guest Coordinator</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Originated State *</label>
                          <input
                            type="text"
                            required
                            value={newReviewState}
                            onChange={(e) => setNewReviewState(e.target.value)}
                            placeholder="e.g. Tripura, IN or Bangladesh"
                            className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Review Statement *</label>
                          <textarea
                            required
                            rows={3}
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            placeholder="Type how hygiene kitchen setups or airport drivers supported recovery efforts..."
                            className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer"
                        >
                          Publish Guest Review
                        </button>
                      </div>
                    </form>

                    {/* Testimonials List view */}
                    <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div>
                        <h3 className="font-bold text-white text-base">Active Live Reviews List</h3>
                        <p className="text-xs text-slate-400">Currently active testimonials shown on website slider.</p>
                      </div>

                      <div className="space-y-3">
                        {testimonials.map((test) => (
                          <div 
                            key={test.id}
                            className="p-3 bg-slate-900/60 border border-slate-800/40 rounded-xl flex gap-3 items-start justify-between text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex gap-1 text-emerald-400">
                                {[...Array(test.rating)].map((_, i) => (
                                  <span key={i}>★</span>
                                ))}
                              </div>
                              <p className="text-slate-300 italic font-light leading-relaxed">"{test.text}"</p>
                              <p className="font-bold text-slate-400">{test.author} — <span className="text-slate-500">{test.relation}, {test.state}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
