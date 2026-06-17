/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dataService';
import { GuestRoom, TravelService, Testimonial } from '../types';
import InteractiveMap from './InteractiveMap';
import BookingForm from './BookingForm';
import RoomDetailsModal from './RoomDetailsModal';
import { 
  Building2, Utensils, Languages, ShieldCheck, 
  Tv, Wifi, Flame, HeartPulse, ChevronRight,
  Phone, Globe, CheckCircle2, Star, Send, 
  HelpCircle, MessageSquare, ClipboardCheck, ArrowRight, MapPin,
  MessageCircle, Menu, X, Calculator, Plus, Minus, Car, Award,
  QrCode, Calendar, ClipboardList, ArrowUp
} from 'lucide-react';

interface UserAppProps {
  onOpenAdmin: () => void;
}

export default function UserApp({ onOpenAdmin }: UserAppProps) {
  const [rooms, setRooms] = useState<GuestRoom[]>([]);
  const [travels, setTravels] = useState<TravelService[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomCat, setSelectedRoomCat] = useState('Non-AC Single Room');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Room comparison states
  const [selectedComparisonRooms, setSelectedComparisonRooms] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<GuestRoom | null>(null);

  // Guest QR Check-In Redirection Handler States
  const [scannedBookingId, setScannedBookingId] = useState<string | null>(null);
  const [scannedBookingData, setScannedBookingData] = useState<any | null>(null);
  const [showCheckInSuccessModal, setShowCheckInSuccessModal] = useState(false);
  const [whatsAppCheckInConfirmed, setWhatsAppCheckInConfirmed] = useState(false);
  const [scannedRoomNo, setScannedRoomNo] = useState<string>('TBD');
  const [isConfirmingWA, setIsConfirmingWA] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleToggleCompare = (roomId: string) => {
    setSelectedComparisonRooms(prev => {
      const isSelected = prev.includes(roomId);
      let next: string[];
      if (isSelected) {
        next = prev.filter(id => id !== roomId);
      } else {
        if (prev.length >= 2) {
          next = [prev[1], roomId];
        } else {
          next = [...prev, roomId];
        }
      }
      
      // Auto open modal when 2 rooms are selected
      if (next.length === 2 && !isSelected) {
        setTimeout(() => setIsCompareModalOpen(true), 250);
      }
      return next;
    });
  };

  // Hero interactive stay planner states
  const [heroRoomCat, setHeroRoomCat] = useState('Non-AC Single Room');
  const [heroDays, setHeroDays] = useState(5);
  const [heroTransit, setHeroTransit] = useState('none');

  // Helper to dynamically resolve the price of calculator categories based on current rooms loaded in state
  const getCalculatorRoomPrice = (cat: string, fallbackPrice: number): number => {
    // 1. Try exact category name match
    const exactMatch = rooms.find(r => r.category.toLowerCase() === cat.toLowerCase());
    if (exactMatch) return exactMatch.pricePerDay;

    // 2. Try partial matching based on common search strings
    let substringMatch: typeof exactMatch | undefined;
    if (cat === 'Non-AC Single Room') {
      substringMatch = rooms.find(r => r.category.toLowerCase().includes('non-ac single') || r.category.toLowerCase().includes('single non-ac'));
    } else if (cat === 'Non-AC Family Room') {
      substringMatch = rooms.find(r => r.category.toLowerCase().includes('family') || r.category.toLowerCase().includes('double') || r.category.toLowerCase().includes('balcony'));
    } else if (cat === 'Standard AC Room') {
      substringMatch = rooms.find(r => r.category.toLowerCase().includes('standard ac') || r.category.toLowerCase().includes('ac double') || r.category.toLowerCase().includes('ac single'));
    } else if (cat === 'Premium Kitchen Suite') {
      substringMatch = rooms.find(r => r.category.toLowerCase().includes('suite') || r.category.toLowerCase().includes('kitchen') || r.category.toLowerCase().includes('premium'));
    }

    if (substringMatch) return substringMatch.pricePerDay;

    // 3. Absolute fallback
    return fallbackPrice;
  };

  // Contact form state
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    setRooms(dbService.getRooms());
    setTravels(dbService.getTravelServices());
    setTestimonials(dbService.getTestimonials());

    // Process check-in QR scan landing
    const params = new URLSearchParams(window.location.search);
    const checkinId = params.get('checkin');
    if (checkinId) {
      const allBookings = dbService.getBookings();
      const found = allBookings.find(b => b.id === checkinId);
      if (found) {
        setScannedBookingId(checkinId);
        
        // Auto assign a room if none is assigned as of now
        let assignedRoom = found.assignedRoomId;
        if (!assignedRoom) {
          const availRooms = dbService.getRooms().filter(r => r.category === found.roomCategory && r.status === 'Available');
          if (availRooms.length > 0) {
            assignedRoom = availRooms[0].id;
          } else {
            assignedRoom = 'room-101'; // Fallback
          }
        }
        
        // Determine room number representation
        const roomObj = dbService.getRooms().find(r => r.id === assignedRoom);
        const roomNumText = roomObj ? roomObj.roomNumber : '101';
        setScannedRoomNo(roomNumText);

        // Advance reservation status safely to CheckedIn
        dbService.updateBookingStatus(checkinId, 'CheckedIn', assignedRoom);
        
        // Load the finalized updated record
        const refreshed = dbService.getBookings().find(b => b.id === checkinId);
        setScannedBookingData(refreshed || found);
        setShowCheckInSuccessModal(true);

        // Sanitize search parameters silently to maintain pristine browsing state
        try {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, []);

  const handleBookingStart = (category: string) => {
    setSelectedRoomCat(category);
    setIsBookingOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderPhone || !message) return;

    dbService.addInquiry({
      name: senderName,
      phone: senderPhone,
      email: senderEmail || undefined,
      subject: subject || 'General Accommodation Query',
      message: message
    });

    setContactSuccess(true);
    setSenderName('');
    setSenderPhone('');
    setSenderEmail('');
    setSubject('');
    setMessage('');

    setTimeout(() => {
      setContactSuccess(false);
    }, 4000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans">
      {/* Nav */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2 rounded-xl shadow-md shrink-0 flex items-center justify-center border border-white/10" id="seenu-brand-logo">
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
              <div className="mt-1 flex items-center">
                <span className="text-[9px] sm:text-[10px] bg-blue-50 text-blue-700 border border-blue-150 py-0.5 px-2.5 rounded-full font-mono uppercase font-semibold shrink-0">Tours & Travels</span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 shrink-0">
            <button onClick={() => scrollToSection('rooms-section')} className="hover:text-blue-600 cursor-pointer">Rooms & Pricing</button>
            <button onClick={() => scrollToSection('interactive-map-section')} className="hover:text-blue-600 cursor-pointer">Location Guide</button>
            <button onClick={() => scrollToSection('faq-section')} className="hover:text-blue-600 cursor-pointer">Support FAQs</button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => handleBookingStart('Non-AC Single Room')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
            >
              Book Now
            </button>
            <button
              onClick={onOpenAdmin}
              className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold font-mono tracking-tight transition cursor-pointer hidden sm:block shrink-0"
            >
              Office Login
            </button>
            
            {/* Hamburger Toggle for Mobile/Tablet */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-650 hover:text-blue-600 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              id="hamburger-menu-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-[26px] h-[26px] sm:w-[32px] sm:h-[32px]" />
              ) : (
                <Menu className="w-[26px] h-[26px] sm:w-[32px] sm:h-[32px]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-xl space-y-4 animate-fade-in" id="mobile-navigation-dropdown">
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => { scrollToSection('rooms-section'); setIsMobileMenuOpen(false); }} 
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Rooms & Pricing
              </button>
              <button 
                onClick={() => { scrollToSection('interactive-map-section'); setIsMobileMenuOpen(false); }} 
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Location Guide
              </button>
              <button 
                onClick={() => { scrollToSection('faq-section'); setIsMobileMenuOpen(false); }} 
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Support FAQs
              </button>
            </div>
            
            {/* Admin toggle for simple screens */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => { handleBookingStart('Non-AC Single Room'); setIsMobileMenuOpen(false); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-xl font-semibold text-sm transition shadow-xs flex items-center justify-center gap-1.5"
              >
                Book Now
              </button>
              <button
                onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }}
                className="w-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 text-center py-2.5 rounded-xl text-xs font-semibold font-mono tracking-tight transition"
              >
                Office Login
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Redesigned Premium Hero Section with Split-interactive design */}
      <section className="relative overflow-hidden pt-0 pb-20 lg:pb-28 bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
        {/* Subtle decorative mesh background and glowing active elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-300/10 to-indigo-300/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-40 pointer-events-none" />

        {/* Premium full-width background image banner touching the navbar with 0 gap */}
        <div className="relative w-full h-[380px] sm:h-[450px] overflow-hidden bg-slate-950 mb-12 border-b border-slate-200">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-900/20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10 flex flex-col justify-end items-center pb-8 sm:pb-12 text-center">
            {/* Floating Distance Badge inside the banner */}
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3.5 py-1.5 rounded-full text-[10px] font-black font-mono tracking-wider uppercase w-fit mb-4 shadow-md border border-blue-400/20">
              <MapPin className="w-3.5 h-3.5 animate-pulse" />
              350m Flat Walk to CMC Jubilee Gate Bus Stop
            </div>

            {/* Banner Content */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4.5xl lg:text-5xl font-black font-sans tracking-tight text-white leading-tight drop-shadow-md">
                Get rooms at <br className="hidden sm:inline"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 font-extrabold">
                  Most affordable price.
                </span>
              </h2>
              
              <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed font-light drop-shadow-sm max-w-xl mx-auto">
                Seenu Guest House delivers spotless, noise-insulated lodging accommodations optimized specifically for patients & relatives visiting Christian Medical College (CMC) Vellore. Relax with pristine home-style cooking access, 24/7 pure RO water, bilingual translation, and seamless railway transit.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button 
                  onClick={() => scrollToSection('rooms-section')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold px-6 py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 border border-blue-400/25 hover:scale-[1.02] active:scale-[0.98] duration-200"
                >
                  Book Now
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a 
                  href="https://wa.me/919500292806?text=Hello%20Seenu%20Guest%20House%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20peaceful%20room%20near%20CMC%20Vellore.%20Please%20let%20me%20know%20the%20availability%20and%20pricing%20details.%20Thank%20you!" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-900/80 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md border border-slate-800 backdrop-blur-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Contact Desk WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Bold Typographic & Core Features Panel */}
            <div className="lg:col-span-6 space-y-8 text-left">

              {/* Amenities Card: Top 6 Amenities organized in 2-column rows inside an elegant card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-lg shadow-slate-100/40 space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest font-mono">Premium On-Site Integrity</h4>
                  <p className="text-sm font-black text-slate-800 mt-0.5">Top Patient & Relative Conveniences</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {/* Row 1 / Col 1: Dietary Kitchen */}
                  <div className="flex gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl h-fit shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Dietary Kitchen</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Gas stoves, cookware, and full utensils for customized healing diets.</p>
                    </div>
                  </div>

                  {/* Row 1 / Col 2: Multilingual Help */}
                  <div className="flex gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl h-fit shrink-0">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Caring Assistance</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Native ground translators fluent in Bengali, Hindi, & English.</p>
                    </div>
                  </div>

                  {/* Row 2 / Col 1: Hygiene */}
                  <div className="flex gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl h-fit shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Clinical Hygiene</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Rigorous multi-point sanitization and deep clean before check-in.</p>
                    </div>
                  </div>

                  {/* Row 2 / Col 2: Pure RO Drinking Water */}
                  <div className="flex gap-2.5">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl h-fit shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">RO Pure Water</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Safe reverse-osmosis mineral-drinking water tape open 24/7.</p>
                    </div>
                  </div>

                  {/* Row 3 / Col 1: Distance to Gate */}
                  <div className="flex gap-2.5">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl h-fit shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Direct CMC Walk</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Only 350 meters short, flat walk to the CMC Jubilee Gate Bus Stop.</p>
                    </div>
                  </div>

                  {/* Row 3 / Col 2: Transit Assistant */}
                  <div className="flex gap-2.5">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl h-fit shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Transit Support</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Direct 24/7 airport and railway shuttle coordination desk.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: High-fidelity interactive stay calculator planner */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl relative w-full">
              
              {/* Decorative top title for the interactive assistant */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Instant Estimate Calculator</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Set values to view dynamic calculations</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-full font-mono uppercase font-black tracking-wider animate-pulse whitespace-nowrap inline-block">
                    Live Rates
                  </span>
                </div>
              </div>

              {/* Step 1: Room Category selection */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">1. Select Room Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { cat: 'Non-AC Single Room', label: 'Single Non-AC', price: 450, info: 'Perfect for patient + 1 guest' },
                    { cat: 'Non-AC Family Room', label: 'Family Non-AC', price: 750, info: 'Spacious, induction cook' },
                    { cat: 'Standard AC Room', label: 'Standard AC', price: 1150, info: 'Cool recovery, geyser, TV' },
                    { cat: 'Premium Kitchen Suite', label: 'Kitchen Suite', price: 1650, info: 'Exclusive private kitchen' }
                  ].map((tier) => {
                    const currentPrice = getCalculatorRoomPrice(tier.cat, tier.price);
                    return (
                      <button
                        key={tier.cat}
                        onClick={() => setHeroRoomCat(tier.cat)}
                        className={`text-left p-3 rounded-2xl border text-xs transition duration-250 cursor-pointer ${
                          heroRoomCat === tier.cat
                            ? 'bg-blue-50/65 border-blue-500 ring-2 ring-blue-500/10'
                            : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center font-bold">
                          <span className={heroRoomCat === tier.cat ? 'text-blue-700 font-bold' : 'text-slate-700 font-semibold'}>{tier.label}</span>
                          <span className="font-mono text-[10px] text-emerald-600">₹{currentPrice}/d</span>
                        </div>
                        <p className="text-[9px] text-slate-450 leading-tight mt-1 font-light">{tier.info}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Duration slider/selector */}
              <div className="space-y-2.5 mb-4 p-3.5 bg-slate-50/70 border border-slate-105 rounded-2xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider font-mono">2. Stay Duration</span>
                  <span className="font-mono font-black text-blue-600 bg-white border border-blue-100 px-2.5 py-0.5 rounded-lg text-xs">
                    {heroDays} Days
                  </span>
                </div>
                
                {/* Range bar plus button increments */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setHeroDays(Math.max(1, heroDays - 1))}
                    className="p-1 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-black shadow-xs hover:bg-slate-100 cursor-pointer select-none"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    value={heroDays}
                    onChange={(e) => setHeroDays(parseInt(e.target.value) || 1)}
                    className="flex-1 accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                  <button 
                    onClick={() => setHeroDays(Math.min(90, heroDays + 1))}
                    className="p-1 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-black shadow-xs hover:bg-slate-100 cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>
                
                {/* Duration Pre-selectors for easy clicking */}
                <div className="flex gap-1.5 justify-between">
                  {[3, 7, 14, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => setHeroDays(days)}
                      className={`flex-1 text-[10px] font-semibold py-1 rounded-lg border transition cursor-pointer ${
                        heroDays === days 
                          ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                          : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      {days} {days === 30 ? 'Days (Month)' : `Days`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Airport Transit Pickup select */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">3. Add Private Station/Airport Cab</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { key: 'none', label: 'No Cab', info: 'Self Transit' },
                    { key: 'katpadi', label: 'Katpadi', info: '₹350 Cab' },
                    { key: 'chennai', label: 'Chennai', info: '₹3.5k Taxi' },
                    { key: 'bangalore', label: 'Bangalore', info: '₹6k Taxi' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setHeroTransit(opt.key)}
                      className={`text-center py-2.5 px-1 rounded-xl border transition cursor-pointer ${
                        heroTransit === opt.key 
                          ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/5 font-bold' 
                          : 'bg-slate-50/40 border-slate-150 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`text-[11px] ${heroTransit === opt.key ? 'text-emerald-800 font-bold' : 'text-slate-800'}`}>{opt.label}</div>
                      <div className="text-[8px] text-slate-400 font-mono mt-0.5">{opt.info}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time breakdown receipt receipt */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs space-y-1.5 shadow-inner">
                <div className="flex justify-between text-slate-400">
                  <span>Stay Code: {heroRoomCat}</span>
                  <span>₹{getCalculatorRoomPrice(heroRoomCat, heroRoomCat === 'Non-AC Single Room' ? 450 : heroRoomCat === 'Non-AC Family Room' ? 750 : heroRoomCat === 'Standard AC Room' ? 1150 : 1650)} x {heroDays}d</span>
                </div>
                {heroTransit !== 'none' && (
                  <div className="flex justify-between text-slate-400">
                    <span>Private Pickup ({heroTransit === 'katpadi' ? 'Katpadi Stn' : heroTransit === 'chennai' ? 'Chennai Airport' : 'Blr Airport'})</span>
                    <span>+ ₹{heroTransit === 'katpadi' ? 350 : heroTransit === 'chennai' ? 3500 : 6000}</span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-1.5 flex justify-between items-center text-sm font-bold text-white">
                  <span className="flex items-center gap-1">
                    <span>Estimated Total:</span>
                    <span className="text-[10px] text-blue-400 font-light normal-case">(Pay on check-in)</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-base font-black">
                    ₹{(getCalculatorRoomPrice(heroRoomCat, heroRoomCat === 'Non-AC Single Room' ? 450 : heroRoomCat === 'Non-AC Family Room' ? 750 : heroRoomCat === 'Standard AC Room' ? 1150 : 1650) * heroDays + (heroTransit === 'none' ? 0 : heroTransit === 'katpadi' ? 350 : heroTransit === 'chennai' ? 3500 : 6000)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Reserve trigger */}
              <div className="mt-4">
                <button
                  onClick={() => handleBookingStart(heroRoomCat)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl shadow-lg shadow-blue-600/10 transition duration-250 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  Confirm Choice & Pre-Book Stay
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-2 font-light">
                  Pre-booking secures the lodging assignments. Changes are acceptable at any point with instant coordination fluent in your language.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>





      {/* Guest Rooms & Rates Catalog */}
      <section id="rooms-section" className="py-16 bg-slate-100 border-t border-b border-slate-205 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Available Lodgings
            </span>
            <h3 className="text-3xl font-extrabold font-sans text-slate-900 mt-3 leading-tight">
              Calm, Clean, and Economical Room Choices
            </h3>
            <p className="text-gray-500 text-sm mt-2 font-light leading-relaxed">
              We offer several transparent tiers to match budget-sensitive accompanying patient groups. From standard non-AC twin layouts to large kitchenette family suites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-400">Loading guest room statuses...</div>
            ) : (
              rooms.map((room) => {
                const isUnderMaintenance = room.status === 'Maintenance';
                return (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedRoomForDetails(room)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition duration-300 relative cursor-pointer group hover:border-blue-200"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className={`px-2.5 py-1 text-xs font-mono rounded-full font-semibold shadow-sm ${
                        room.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                        room.status === 'Occupied' ? 'bg-amber-100 text-amber-800' :
                        room.status === 'Cleaning' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        ● {room.status}
                      </span>
                    </div>

                    {/* Compare Checkbox */}
                    <div 
                      className="absolute top-4 right-4 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-md text-[11px] font-extrabold text-slate-800 cursor-pointer border border-slate-200 select-none hover:bg-slate-50 transition active:scale-95 duration-150">
                        <input 
                          type="checkbox"
                          checked={selectedComparisonRooms.includes(room.id)}
                          onChange={() => handleToggleCompare(room.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer accent-blue-600"
                        />
                        <span>Compare</span>
                      </label>
                    </div>

                    <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                      <img 
                        src={room.imgUrl} 
                        alt={room.category}
                        className="w-full h-full object-cover transition duration-350 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-4 right-4 bg-slate-900/95 text-white/95 text-sm font-semibold font-mono px-3.5 py-1.5 rounded-lg border border-slate-700">
                        ₹{room.pricePerDay} <span className="text-xs font-light text-blue-400">/ Day</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight flex items-center justify-between group-hover:text-blue-600 transition duration-150">
                          <span>{room.category}</span>
                          <span className="text-xs font-mono text-gray-400">Room {room.roomNumber}</span>
                        </h4>
                        
                        <p className="text-gray-500 font-light text-xs mt-2 leading-relaxed min-h-[48px]">
                          {room.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="text-xs font-light text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono">🛏 {room.beds}</span>
                          <span className="text-xs font-light text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono">👥 Max {room.capacity}</span>
                        </div>

                        {/* List of Amenities */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest font-semibold mb-2 font-mono">Room Amenities Included</p>
                          <div className="grid grid-cols-2 gap-y-1.5 text-xs text-gray-600 font-light">
                            {room.amenities.slice(0, 4).map((amen, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">{amen}</span>
                              </div>
                            ))}
                            {room.amenities.length > 4 && (
                              <div className="text-teal-700 text-xs font-semibold hover:underline mt-1 cursor-help">
                                + {room.amenities.length - 4} more amenities
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4">
                        <button
                          disabled={isUnderMaintenance}
                          className={`w-full py-2.5 rounded-xl text-center font-bold text-sm transition tracking-tight flex items-center justify-center gap-1.5 ${
                            isUnderMaintenance 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 group-hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                          }`}
                        >
                          {isUnderMaintenance ? 'Under Deep Sanitization' : 'Book Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>



      {/* Map Direction Guide */}
      <section className="bg-slate-100 py-16 border-t border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Walking Track map
            </span>
            <h3 className="text-3xl font-extrabold font-sans text-slate-900 mt-3 leading-tight">
              Hospital Transit & Street Access Guide
            </h3>
            <p className="text-gray-500 text-sm mt-2 font-light leading-relaxed">
              We have compiled detailed walking guidelines so patient attendants do not get lost in Jubilee Gate traffic. Look up the directional tracker details below.
            </p>
          </div>
          
          <InteractiveMap />
        </div>
      </section>



      {/* FAQs */}
      <section id="faq-section" className="py-16 bg-slate-100 border-t border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest font-semibold">
              Common Questions
            </span>
            <h3 className="text-3xl font-extrabold font-sans text-slate-900 mt-3 leading-tight">
              Answering All Your Comfort Queries
            </h3>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                Are there clean kitchens to cook meals?
              </h4>
              <p className="text-gray-600 font-light text-sm mt-2 leading-relaxed pl-7">
                Yes. We offer robust facilities for self-cooking (highly requested for patients' recovery diets). Our common kitchen is equipped with a pot, a gas stove with a gas cylinder, and a shared refrigerator for water and cooking storage. We also provide 20L Filter Water Cans for ₹50, and Bisleri bottled water (5L for ₹75, 10L for ₹120).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                How far is CMC Jubilee Gate Bus Stop?
              </h4>
              <p className="text-gray-650 text-gray-600 font-light text-sm mt-2 leading-relaxed pl-7">
                We are exactly 350 meters away in Babu Rao Street. It is a completely flat road with no steep climbs or busy flyover crossings, taking less than 5 minutes to walk for a general adult. Highly suitable for patients with mild walking barriers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                What if my treatment dates get extended at the hospital?
              </h4>
              <p className="text-gray-600 font-light text-sm mt-2 leading-relaxed pl-7">
                Treatment durations at CMC can vary unpredictably. We prioritize extension requests for already staying patient families. Simply notify the admin desk 48 hours in advance so we can adjust room allocations inside our backend matrix.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                Do you coordinate wheelchair transport across cities?
              </h4>
              <p className="text-gray-600 font-light text-sm mt-2 leading-relaxed pl-7">
                Yes, our customized SUV (such as Toyota Innova Crysta/Car/Auto/Bus/Train/Airplane options depends on distance and time) can fit foldable wheelchairs. Extra medical attendant guides can be requested to sit alongside the patient on intercity drives from Chennai Airport straight to Vellore.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                What is the daily cleaning policy?
              </h4>
              <p className="text-gray-600 font-light text-sm mt-2 leading-relaxed pl-7">
                To respect absolute patient privacy and medical infection protocols, room cleaning is self-service only. Clean dustbins are provided in all rooms, and our staff clears them daily from the hallways.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Footer Branding Bar with Full Corporate, Location, and Patient Assistance Columns */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 text-xs z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
            {/* Column 1: Brand & Compassionate Philosophy */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-lg p-1.5 font-bold tracking-tight text-sm font-sans">SGH</span>
                <span className="font-extrabold text-white text-base font-sans tracking-tight">Seenu Guest House</span>
              </div>
              <p className="text-slate-400 font-light leading-relaxed">
                A highly trusted, quiet patient lodging service situated just 350 meters from the Christian Medical College (CMC) Vellore Jubilee Gate. We specialize in providing sterile, peaceful, and fully comfortable accommodations for outstation families undergoing medical recovery.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Established for Medical Care Support
              </div>
            </div>

            {/* Column 2: Easy Navigation & Resources */}
            <div className="space-y-4">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Lodging Navigation</h4>
              <ul className="space-y-2.5">
                <li>
                  <button 
                    onClick={() => scrollToSection('rooms-section')} 
                    className="hover:text-blue-400 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                    Rooms & Pricing Tiers
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('interactive-map-section')} 
                    className="hover:text-blue-400 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                    Distance & Location Guide
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('faq-section')} 
                    className="hover:text-blue-400 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                    Support & Amenities FAQs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onOpenAdmin} 
                    className="hover:text-blue-400 transition flex items-center gap-1.5 cursor-pointer text-blue-400 font-medium"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    Manager Office Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Patient Care Conveniences */}
            <div className="space-y-4">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Patient Conveniences</h4>
              <ul className="space-y-2.5 font-light">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Shared clean kitchen (Cook own diet food)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  20L Clean Filter Water Cans (₹50)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Foldable physical wheelchair assistance
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Pre-ordered railway/airport AC cabs
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Helpdesk & Location */}
            <div className="space-y-4">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Contact & Address</h4>
              <ul className="space-y-3 font-light text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>No. 12, Babu Rao Street Lane, near CMC Jubilee Gate, Vellore, Tamil Nadu, 632004</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Call Desk: <a href="tel:+919500292806" className="hover:text-blue-500 hover:underline font-semibold transition duration-150">+91 95002 92806</a></span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>WhatsApp Logistics: <a href="https://wa.me/919500292806?text=Hello%20Seenu%20Guest%20House%2C%20I%20have%20a%20query%20regarding%20airport%20or%20railway%20station%20transfers%20or%20local%20travel%20logistics.%20Please%20guide%20me.%20Thank%20you!" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline font-semibold transition duration-150">+91 95002 92806</a></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 font-light">
            <div className="text-center md:text-left space-y-1">
              <p className="font-medium text-slate-400">
                © {new Date().getFullYear()} Seenu Guest House Town & Travels. All rights reserved.
              </p>
              <p className="text-[11px] text-slate-600">
                All patient support programs, airport logistics transfers, booking records, and room keys are organized under dynamic admin supervision.
              </p>
            </div>
            
            {/* Accepted Payments Display */}
            <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-600">Accepted Safe Payments</span>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold select-none justify-center md:justify-end">
                {/* Google Pay logo badge */}
                <span className="px-2 py-0.5 bg-white text-slate-900 border border-slate-200 rounded font-black tracking-tight text-[10px] shadow-xs flex items-center">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-slate-500 font-bold ml-0.5">Pay</span>
                </span>
                
                {/* PhonePe logo badge */}
                <span className="px-2.5 py-0.5 bg-[#5f259f] text-white rounded font-extrabold tracking-wide text-[10px] shadow-xs border border-[#551d91]">
                  PhonePe
                </span>
                
                {/* Paytm logo badge */}
                <span className="px-2 py-0.5 bg-white text-slate-900 border border-slate-200 rounded font-black tracking-tighter text-[10px] shadow-xs flex items-center">
                  <span className="text-[#00b9f5]">pay</span>
                  <span className="text-[#002e6e]">tm</span>
                </span>
                
                {/* UPI logo badge */}
                <span className="px-2 py-0.5 bg-gradient-to-r from-[#005e3a] to-[#2e7d32] text-white rounded font-black tracking-widest text-[9px] shadow-xs italic border border-emerald-800">
                  UPI
                </span>

                {/* Cash badge */}
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-emerald-400 rounded font-bold tracking-wider text-[9px] shadow-xs flex items-center gap-1">
                  💵 CASH
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Room Details walkthrough Modal */}
      {selectedRoomForDetails && (
        <RoomDetailsModal
          room={selectedRoomForDetails}
          onClose={() => setSelectedRoomForDetails(null)}
          onBookNow={(category) => {
            setSelectedRoomForDetails(null);
            handleBookingStart(category);
          }}
        />
      )}

      {/* Booking Form modal overlay */}
      {isBookingOpen && (
        <BookingForm
          onClose={() => setIsBookingOpen(false)}
          onSuccess={() => {
            // Hotreload State of Room listing
            setRooms(dbService.getRooms());
          }}
          selectedCategory={selectedRoomCat}
        />
      )}

      {/* Floating Comparison Tray */}
      {selectedComparisonRooms.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl bg-slate-900/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-4 animate-slide-up">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-extrabold">Room Comparison</span>
            <span className="text-xs sm:text-sm font-semibold mt-0.5">
              {selectedComparisonRooms.length === 1 
                ? '1 room selected (Choose 1 more)' 
                : '2 rooms selected! Ready to compare'}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setSelectedComparisonRooms([])}
              className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 transition cursor-pointer"
            >
              Clear
            </button>
            <button 
              onClick={() => setIsCompareModalOpen(true)}
              disabled={selectedComparisonRooms.length < 2}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition uppercase tracking-wider cursor-pointer ${
                selectedComparisonRooms.length === 2 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 border border-blue-400/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && rooms.filter(r => selectedComparisonRooms.includes(r.id)).length === 2 && (() => {
        const comparedRoomsList = rooms.filter(r => selectedComparisonRooms.includes(r.id));
        const unionAmenitiesList = Array.from(
          new Set(comparedRoomsList.flatMap(r => r.amenities))
        );
        return (
          <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-scale-up">
              {/* Header */}
              <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-sans tracking-tight">Side-by-Side Room Comparison</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-light mt-0.5">Compare pricing, config, and amenities to select the perfect room</p>
                </div>
                <button 
                  onClick={() => setIsCompareModalOpen(false)}
                  className="p-1.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 sm:space-y-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 items-stretch border-b border-slate-100 pb-5">
                  {/* Column 1: Feature label */}
                  <div className="hidden sm:flex items-center text-slate-400 text-[10px] uppercase tracking-wider font-mono font-bold">
                    Overview Tiers
                  </div>
                  <div className="sm:hidden flex items-center text-slate-400 text-[9px] uppercase tracking-wider font-mono font-bold">
                    Rooms
                  </div>
                  {/* Column 2: Room 1 Card */}
                  <div className="space-y-2">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/65">
                      <img src={comparedRoomsList[0].imgUrl} alt={comparedRoomsList[0].category} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-extrabold text-slate-950 text-xs sm:text-sm leading-tight line-clamp-1">{comparedRoomsList[0].category}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Room {comparedRoomsList[0].roomNumber}</p>
                  </div>
                  {/* Column 3: Room 2 Card */}
                  <div className="space-y-2">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/65">
                      <img src={comparedRoomsList[1].imgUrl} alt={comparedRoomsList[1].category} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-extrabold text-slate-950 text-xs sm:text-sm leading-tight line-clamp-1">{comparedRoomsList[1].category}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Room {comparedRoomsList[1].roomNumber}</p>
                  </div>
                </div>

                {/* Specs Table */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] sm:text-xs font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded w-fit uppercase tracking-widest">
                    Core Specifications
                  </h4>
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50">
                    {/* Daily Rate Row */}
                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-600">Price Per Day</span>
                      <span className="text-xs sm:text-sm font-black text-blue-600 font-mono">₹{comparedRoomsList[0].pricePerDay}</span>
                      <span className="text-xs sm:text-sm font-black text-blue-600 font-mono">₹{comparedRoomsList[1].pricePerDay}</span>
                    </div>
                    {/* Beds Row */}
                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-600">Beds</span>
                      <span className="text-xs text-slate-800 font-mono truncate">{comparedRoomsList[0].beds}</span>
                      <span className="text-xs text-slate-800 font-mono truncate">{comparedRoomsList[1].beds}</span>
                    </div>
                    {/* Capacity Row */}
                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-600">Capacity</span>
                      <span className="text-xs text-slate-800 font-mono truncate">Max {comparedRoomsList[0].capacity} guests</span>
                      <span className="text-xs text-slate-800 font-mono truncate">Max {comparedRoomsList[1].capacity} guests</span>
                    </div>
                    {/* Availability Row */}
                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-600">Status</span>
                      <span className="text-xs font-bold text-slate-800 font-mono flex items-center gap-1">
                        <span className={`h-2.5 w-2.5 rounded-full ${comparedRoomsList[0].status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {comparedRoomsList[0].status}
                      </span>
                      <span className="text-xs font-bold text-slate-800 font-mono flex items-center gap-1">
                        <span className={`h-2.5 w-2.5 rounded-full ${comparedRoomsList[1].status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {comparedRoomsList[1].status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amenities Comparison */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] sm:text-xs font-mono font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded w-fit uppercase tracking-widest">
                    Amenities Comparison Matrix
                  </h4>
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
                    {unionAmenitiesList.map((amenity, idx) => {
                      const hasR1 = comparedRoomsList[0].amenities.includes(amenity);
                      const hasR2 = comparedRoomsList[1].amenities.includes(amenity);
                      return (
                        <div key={idx} className="grid grid-cols-3 p-2.5 sm:p-3 items-center hover:bg-slate-50/55 duration-100">
                          <span className="text-[11px] sm:text-xs font-medium text-slate-700 font-sans line-clamp-1">{amenity}</span>
                          <span className="text-xs">
                            {hasR1 ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-extrabold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                                <X className="w-3.5 h-3.5 shrink-0" /> No
                              </span>
                            )}
                          </span>
                          <span className="text-xs">
                            {hasR2 ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-extrabold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                                <X className="w-3.5 h-3.5 shrink-0" /> No
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedComparisonRooms([]);
                    setIsCompareModalOpen(false);
                  }}
                  className="px-4 py-2.5 text-slate-500 hover:text-slate-850 text-xs font-semibold uppercase tracking-wider text-center cursor-pointer transition border border-transparent rounded-xl"
                >
                  Clear Selections
                </button>
                
                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      handleBookingStart(comparedRoomsList[0].category);
                      setIsCompareModalOpen(false);
                    }}
                    className="flex-1 sm:flex-none px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
                  >
                    Book Room {comparedRoomsList[0].roomNumber}
                  </button>
                  <button
                    onClick={() => {
                      handleBookingStart(comparedRoomsList[1].category);
                      setIsCompareModalOpen(false);
                    }}
                    className="flex-1 sm:flex-none px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
                  >
                    Book Room {comparedRoomsList[1].roomNumber}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Dynamic Digital Check-In Verification Success Modal */}
      {showCheckInSuccessModal && scannedBookingData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-5 shadow-2xl relative text-center">
            <button
              onClick={() => setShowCheckInSuccessModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mx-auto w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-white font-extrabold text-lg sm:text-xl">Check-In Successfully Verified!</h3>
              <p className="text-xs text-slate-400 mt-1">Thank you for choosing Seenu Guest House. Your digital key register is activated.</p>
            </div>

            {/* Receipt Summary details pane in mono format */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-500 font-bold uppercase text-[10px]">RESERVATION ID:</span>
                <span className="text-emerald-400 font-bold">{scannedBookingData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase text-[10px]">GUEST NAME:</span>
                <span className="text-slate-200">{scannedBookingData.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase text-[10px]">CONTACT NO:</span>
                <span className="text-slate-200">{scannedBookingData.guestPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">ROOM CATEGORY:</span>
                <span className="text-indigo-300">{scannedBookingData.roomCategory}</span>
              </div>
              <div className="flex justify-between bg-emerald-950 border-y border-emerald-555/10 py-1.5 px-1 my-1">
                <span className="text-emerald-500 font-black uppercase text-[10px]">ASSIGNED ROOM:</span>
                <span className="text-emerald-400 font-black">ROOM #{scannedRoomNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase text-[10px]">STAY PERIOD:</span>
                <span className="text-slate-200">{scannedBookingData.checkInDate} to {scannedBookingData.checkOutDate}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500 font-bold uppercase text-[10px]">ESTIMATED FARE:</span>
                <span className="text-slate-100">₹{scannedBookingData.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold">CURRENT STATUS:</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Checked In ✅</span>
              </div>
            </div>

            {/* Simulated Live Action Status */}
            <div className="text-left bg-[#efeae2]/10 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5 font-bold">
                  💬
                </div>
                <div className="flex-1 text-slate-300">
                  <p className="font-bold text-[11px] text-emerald-400 flex items-center gap-1">
                    WhatsApp Desk Auto-Confirm Receipt Agent
                  </p>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                    Click confirm to instantly coordinate room key handover with Seenu Desk via physical WhatsApp chat.
                  </p>
                </div>
              </div>

              {whatsAppCheckInConfirmed ? (
                <div className="bg-[#128c7e]/20 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <span className="text-emerald-400">✓ Check-In Confirmed & WhatsApp chat opened!</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsConfirmingWA(true);
                      const messageStr = `🏨 *SEENU GUEST HOUSE - PASSENGER CHECK-IN VERIFIED* 🔑\n\nHello Seenu Desk,\nI have successfully scanned my QR code at the reception desk to check in!\n\n📋 *My Checked-In Details:*\n▪️ Booking ID: *${scannedBookingData.id}*\n▪️ Guest Name: *${scannedBookingData.guestName}*\n▪️ Category: *${scannedBookingData.roomCategory}*\n▪️ Assigned Room: *Room ${scannedRoomNo}*\n▪️ Dates: *${scannedBookingData.checkInDate} to ${scannedBookingData.checkOutDate}*\n▪️ Fare Total: *₹${scannedBookingData.totalAmount}*\n\nPlease confirm key handover. Thank you!`;
                      const waUrl = `https://wa.me/919500292806?text=${encodeURIComponent(messageStr)}`;
                      
                      setTimeout(() => {
                        setIsConfirmingWA(false);
                        setWhatsAppCheckInConfirmed(true);
                        try {
                          window.open(waUrl, '_blank');
                        } catch (err) {
                          console.error(err);
                        }
                      }, 800);
                    }}
                    disabled={isConfirmingWA}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2 px-3 rounded-lg transition shrink-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/10 disabled:opacity-50"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                    {isConfirmingWA ? 'Opening WhatsApp...' : 'Confirm Check-In via WhatsApp'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowCheckInSuccessModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-705 border border-slate-700 hover:border-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                Close & View Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll To Top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 sm:p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-blue-400/20"
          title="Scroll to Top"
          id="scroll-to-top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
}
