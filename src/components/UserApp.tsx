/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dataService';
import { GuestRoom, TravelService, Testimonial } from '../types';
import InteractiveMap from './InteractiveMap';
import BookingForm from './BookingForm';
import { 
  Building2, Utensils, Languages, ShieldCheck, 
  Tv, Wifi, Flame, HeartPulse, ChevronRight,
  Phone, Globe, CheckCircle2, Star, Send, 
  HelpCircle, MessageSquare, ClipboardCheck, ArrowRight, MapPin,
  MessageCircle, Menu, X, Calculator, Plus, Minus, Car, Award
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

  // Hero interactive stay planner states
  const [heroRoomCat, setHeroRoomCat] = useState('Non-AC Single Room');
  const [heroDays, setHeroDays] = useState(5);
  const [heroTransit, setHeroTransit] = useState('none');

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
            <button onClick={() => scrollToSection('features-section')} className="hover:text-blue-600 cursor-pointer">Amenities</button>
            <button onClick={() => scrollToSection('rooms-section')} className="hover:text-blue-600 cursor-pointer">Rooms & Pricing</button>
            <button onClick={() => scrollToSection('travel-section')} className="hover:text-blue-600 cursor-pointer">Airport Pickups</button>
            <button onClick={() => scrollToSection('interactive-map-section')} className="hover:text-blue-600 cursor-pointer">Location Guide</button>
            <button onClick={() => scrollToSection('testimonials-section')} className="hover:text-blue-600 cursor-pointer">Testimonials</button>
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
                onClick={() => { scrollToSection('features-section'); setIsMobileMenuOpen(false); }} 
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Amenities
              </button>
              <button 
                onClick={() => { scrollToSection('rooms-section'); setIsMobileMenuOpen(false); }} 
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Rooms & Pricing
              </button>
              <button 
                onClick={() => { scrollToSection('travel-section'); setIsMobileMenuOpen(false); }} 
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Airport Pickups
              </button>
              <button 
                onClick={() => { scrollToSection('interactive-map-section'); setIsMobileMenuOpen(false); }} 
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Location Guide
              </button>
              <button 
                onClick={() => { scrollToSection('testimonials-section'); setIsMobileMenuOpen(false); }} 
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Testimonials
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
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
        {/* Subtle decorative mesh background and glowing active elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-300/10 to-indigo-300/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Bold Typographic & Core Features Panel */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8 text-left lg:pt-4">
              
              {/* Distance announcement label */}
              <div className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-150 px-3.5 py-1.5 rounded-full shadow-xs">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span className="text-[11px] font-bold font-mono text-blue-700 tracking-wider uppercase">
                  180m Flat Walk to CMC Scudder Gate 1
                </span>
              </div>

              {/* Title & Introduction */}
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black font-sans tracking-tight text-slate-900 leading-tight">
                  Premium Patient Stay & <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
                    Multilingual Logistics
                  </span>
                </h2>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-xl">
                  We render spotless, noise-insulated lodgings tailored purposefully for recovering patients and accompanying relatives visiting Christian Medical College (CMC) Vellore. Relax with access to custom meal self-cooking kitchens, 24/7 airport dispatch desks, and fluent Bengali/Hindi support coordinators.
                </p>
              </div>

              {/* Key Trust Badges inline layout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xs">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Dietary Kitchens</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Induction stoves & pure RO water for user meals.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xs">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl h-fit">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Assistance Desk</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Speak fluent Bengali, Hindi, and Malayalam natively.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xs">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl h-fit">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Sanitized Rooms</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Deep sanitization before every check-in.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xs">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl h-fit">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Top Rated</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">4.9/5 patient satisfaction over 140+ bookings.</p>
                  </div>
                </div>
              </div>

              {/* Direct helpline buttons instead of standalone text */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={() => scrollToSection('rooms-section')}
                  className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  Browse Room Gallery
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-500">Helpline WhatsApp:</span>
                  <a href="https://wa.me/919444155662" target="_blank" rel="noopener noreferrer" className="font-extrabold text-slate-800 hover:text-blue-600 hover:underline">
                    +91 94441 55662
                  </a>
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
                  ].map((tier) => (
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
                        <span className="font-mono text-[10px] text-emerald-600">₹{tier.price}/d</span>
                      </div>
                      <p className="text-[9px] text-slate-450 leading-tight mt-1 font-light">{tier.info}</p>
                    </button>
                  ))}
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
                  <span>₹{heroRoomCat === 'Non-AC Single Room' ? 450 : heroRoomCat === 'Non-AC Family Room' ? 750 : heroRoomCat === 'Standard AC Room' ? 1150 : 1650} x {heroDays}d</span>
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
                    ₹{((heroRoomCat === 'Non-AC Single Room' ? 450 : heroRoomCat === 'Non-AC Family Room' ? 750 : heroRoomCat === 'Standard AC Room' ? 1150 : 1650) * heroDays + (heroTransit === 'none' ? 0 : heroTransit === 'katpadi' ? 350 : heroTransit === 'chennai' ? 3500 : 6000)).toLocaleString('en-IN')}
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

      {/* Trust & Location Stats Header */}
      <section className="bg-slate-50 border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-black text-blue-600 font-mono">180m</p>
            <p className="text-xs md:text-sm text-gray-500 font-light font-sans mt-0.5">Walk to CMC Gate 1</p>
          </div>
          <div className="border-l border-slate-200">
            <p className="text-2xl md:text-3xl font-black text-blue-600 font-mono">24/7</p>
            <p className="text-xs md:text-sm text-gray-500 font-light font-sans mt-0.5">Chennai & Bangalore Airport Cab</p>
          </div>
          <div className="border-l-0 md:border-l border-slate-200">
            <p className="text-2xl md:text-3xl font-black text-blue-600 font-mono">100%</p>
            <p className="text-xs md:text-sm text-gray-500 font-light font-sans mt-0.5">Self-Kitchen Friendly</p>
          </div>
          <div className="border-l md:border-l border-slate-200">
            <p className="text-2xl md:text-3xl font-black text-blue-600 font-mono">4 Lang</p>
            <p className="text-xs md:text-sm text-gray-500 font-light font-sans mt-0.5">Bengali, Hindi, Malayalam assistance</p>
          </div>
        </div>
      </section>

      {/* Facilities tailored specifically for medical patients */}
      <section id="features-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest">
            Humble Amenities
          </span>
          <h3 className="text-3xl font-extrabold font-sans text-slate-900 mt-3 leading-tight">
            Designed for Accompanying Relatives & Peace of Mind
          </h3>
          <p className="text-gray-500 text-sm mt-2 font-light leading-relaxed">
            We understand the challenges of medical travels. Our guesthouse facilities are designed by families, specifically focusing on food health, translation comfort, and safe recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl inline-block group-hover:bg-emerald-500 group-hover:text-white transition duration-200 mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Self-Cooking Kitchen access</h4>
            <p className="text-gray-500 font-light text-sm mt-2 leading-relaxed">
              Equipped with high-quality induction stoves, individual storage bins, clean utensils, and purified RO drinking water to cook custom home dietary food for recovering patients.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl inline-block group-hover:bg-blue-600 group-hover:text-white transition duration-200 mb-4">
              <Languages className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Bengali & Hindi Help Desk</h4>
            <p className="text-gray-500 font-light text-sm mt-2 leading-relaxed">
              Don't worry about local Tamil barriers. Our friendly coordination staff speaks fluent Bengali, Hindi, Malayalam, and English to help organize groceries or hospital token steps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="bg-indigo-50 text-indigo-700 p-3 rounded-xl inline-block group-hover:bg-indigo-500 group-hover:text-white transition duration-200 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Strict Medical Hygiene</h4>
            <p className="text-gray-500 font-light text-sm mt-2 leading-relaxed">
              Regular deep sanitization and hospital-grade disinfections are conducted between check-ins. Blackout drapes and premium noise-insulation panels protect recovery rest.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl inline-block group-hover:bg-blue-500 group-hover:text-white transition duration-200 mb-4">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Special Needs Support</h4>
            <p className="text-gray-500 font-light text-sm mt-2 leading-relaxed">
              Easy elevator lift access to all upper room floors, specific wheelchair ramps, wide door frames, and customized toilet setups with recovery-hold grab bars on demand.
            </p>
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
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition duration-300 relative"
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

                    <div className="aspect-[16/10] bg-gray-100 relative group overflow-hidden">
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
                        <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight flex items-center justify-between">
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
                          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest font-semibold mb-2">Room Amenities Included</p>
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
                          onClick={() => handleBookingStart(room.category)}
                          disabled={isUnderMaintenance}
                          className={`w-full py-2.5 rounded-xl text-center font-semibold text-sm transition tracking-tight flex items-center justify-center gap-1.5 ${
                            isUnderMaintenance 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                          }`}
                        >
                          {isUnderMaintenance ? 'Under Deep Sanitization' : 'Request Quick Room Check'}
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

      {/* Travel logistics transfers */}
      <section id="travel-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Safe Patient Transit Info
            </span>
            <h3 className="text-3xl font-extrabold font-sans text-slate-900 leading-tight">
              Pre-Booked Airport & Katpadi Station Cabs
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Arriving late at night with patient wheel-chairs or vulnerable kids is highly stressful. We provide highly courteous guesthouse drivers with pre-agreed fixed quotes. No surprise pricing, no passenger bargaining.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-emerald-800 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Pre-Flight Flight Monitoring</h4>
                  <p className="text-xs text-gray-500 font-light mt-0.5 leading-relaxed">
                    Our drivers monitor flight landings in Chennai/Bangalore in real-time. Simply walk out to the arrivals gate to find your driver holding a custom name card.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-emerald-800 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Hygienic Clean Air Cabs</h4>
                  <p className="text-xs text-gray-500 font-light mt-0.5 leading-relaxed">
                    Sedans are deep cleaned before pickups. Accommodates standard wheelchairs, walking support aids, and heavy oxygen canisters effortlessly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/20 border border-slate-200 rounded-xl p-5 flex items-center gap-4 text-slate-900">
              <div>
                <p className="text-xs font-mono font-bold uppercase text-blue-600">Support 24/7 Helpline</p>
                <p className="text-base font-bold mt-1 text-slate-900">WhatsApp / Call Logistics Support</p>
                <p className="text-xs font-semibold text-blue-600 mt-0.5">+91 95000 88771</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
            <h4 className="text-lg font-bold text-slate-900 mb-4 font-sans tracking-tight">Active Fixed Tariff Rates</h4>
            <div className="space-y-4">
              {travels.map((travel) => (
                <div
                  key={travel.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition duration-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm md:text-base">{travel.serviceName}</span>
                      <span className="bg-blue-50 text-blue-620 text-blue-600 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {travel.coverage}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-light leading-relaxed max-w-md">{travel.description}</p>
                    <p className="text-[11px] font-mono text-gray-400">Representative: {travel.driverName || 'Verified Crew'}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-lg font-black text-slate-900 font-mono block">
                      ₹{travel.fixedRate > 0 ? travel.fixedRate : `${travel.ratePerKm}/km`}
                    </span>
                    <span className="text-xs text-gray-400 font-light">All tolls included</span>
                    
                    <button
                      onClick={() => handleBookingStart('Non-AC Single Room')}
                      className="mt-2 block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      Book Driver
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              We have compiled detailed walking guidelines so patient attendants do not get lost in Scudder Road traffic. Look up the directional tracker details below.
            </p>
          </div>
          
          <InteractiveMap />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest font-semibold">
            Patient Stories
          </span>
          <h3 className="text-3xl font-extrabold font-sans text-slate-900 mt-3 leading-tight">
            Loved by Recovery Families
          </h3>
          <p className="text-gray-500 text-sm mt-2 font-light leading-relaxed">
            See the honest experiences shared by family members and attendants who stayed with us during their treatment phases in Christian Medical College.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all duration-200"
            >
              <div>
                <div className="flex gap-1 text-emerald-500 mb-3">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-500" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic font-light leading-relaxed">
                  "{test.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-mono">
                <div>
                  <p className="font-bold text-slate-900">{test.author}</p>
                  <p className="text-gray-400 font-light mt-0.5">{test.relation}</p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                  {test.state}
                </span>
              </div>
            </div>
          ))}
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
                How far is CMC Gate 1?
              </h4>
              <p className="text-gray-650 text-gray-600 font-light text-sm mt-2 leading-relaxed pl-7">
                We are exactly 180 meters away in Babu Rao Street. It is a completely flat road with no steep climbs or busy flyover crossings, taking less than 3 minutes to walk for a general adult. Highly suitable for patients with mild walking barriers.
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

      {/* Inquiry and Contact Footer Sections */}
      <section id="contact-section" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          <div className="lg:col-span-12 lg:col-span-5 space-y-6 col-span-1">
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-mono uppercase font-semibold">
              Get in touch
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight font-sans text-white">
              Have customized treatment lodging concerns?
            </h3>
            <p className="text-slate-300 font-light text-sm leading-relaxed">
              Fill in your questions. Whether you require specific ground-floor toilet configurations, long-term monthly discount rates, or language guide assistance, our warm support team will respond quickly.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-800 text-sm text-slate-200 font-light">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Babu Rao Street Lane, Near Scudder Road Scudder Circle, Vellore, Tamil Nadu, 632004</span>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Landline desk: 0416 - 2234005 | WhatsApp: +91 94441 55662</span>
              </div>
              <div className="flex gap-3">
                <Globe className="w-5 h-5 text-blue-400 shrink-0" />
                <span>English, Bengali, Malayalam Desk Coordinator</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl col-span-1">
            <h4 className="text-xl font-bold text-slate-900 mb-3 font-sans tracking-tight">Send Instant Inquiry Desk</h4>
            <p className="text-gray-500 text-xs font-light mb-6">Submitted questions immediately register under our active Operations Panel for review and scheduling.</p>

            {contactSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-semibold flex gap-2 items-center mb-6 animate-scale-up">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your query has been recorded successfully. Our desk coordinators will get back to you shortly!</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Mrs. Debolina Sen"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile/WhatsApp No *</label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="e.g. +91 94330 99001"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="e.g. debolina@gmail.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Query Subject (Optional)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Looking for wheelchair ground floor room prices"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Message *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your patient situation, treatment duration or airport cab timing..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-gray-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-200 text-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-300" />
                Submit Inquiries
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Branding Bar */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 text-xs text-center z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="font-medium text-slate-300">
            © {new Date().getFullYear()} Seenu Guest House, Tour's and Travels. All hospital assistance, pickup logs, room statuses, and schedules managed securely in real-time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-slate-500">
            <span>Walking distance to Christian Medical College (CMC), Vellore | Near Gate 1</span>
            <span className="hidden sm:inline">•</span>
            <button 
              onClick={onOpenAdmin} 
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer font-mono font-semibold"
            >
              Manager Office Login &rarr;
            </button>
          </div>
        </div>
      </footer>

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

      {/* Floating real-time WhatsApp action button */}
      <a 
        href="https://wa.me/919360211223?text=Hello%20Seenu%20Guest%20House%2C%20I%20am%20inquiring%20about%20room%20availability%20and%20travel%20assistance."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3 sm:py-3.5 sm:px-4.5 rounded-full sm:rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        title="Chat on WhatsApp"
        id="whatsapp-floating-action"
      >
        <div className="relative flex items-center">
          <MessageCircle className="w-5 h-5 text-white fill-white" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>
        <div className="hidden sm:flex flex-col text-left leading-none">
          <p className="text-[9px] font-mono font-bold text-slate-950 uppercase tracking-wider">Instant Support</p>
          <p className="text-xs font-bold text-white mt-0.5">Chat on WhatsApp</p>
        </div>
      </a>
    </div>
  );
}
