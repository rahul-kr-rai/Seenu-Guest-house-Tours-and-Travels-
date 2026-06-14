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
  Maximize2, Plus, Edit2, Check, X, ShieldAlert 
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

  // Pre-configured list of states to filter booking sources
  const activeBookings = bookings.filter((b) => {
    if (bookingFilterStatus === 'All') return true;
    return b.status === bookingFilterStatus;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
      
      {/* Admin header */}
      <header className="bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-slate-900 p-2.5 rounded-xl shadow">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">Guesthouse Operations & Back Office</h1>
                <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded border border-emerald-500/30">
                  Production Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">Seenu Guest House, Tour's and Travels Operations Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2.5 rounded-lg transition"
              title="Refresh real-time data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onBackToWebsite}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm shadow transition duration-200 cursor-pointer"
            >
              &larr; Exit to Public Website
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Structure */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 gap-6">
        
        {/* Left Side menu rail */}
        <nav className="w-full lg:w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col gap-2 shrink-0">
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black mb-3 px-3 sm:col-span-2 md:col-span-3 lg:col-span-1">
            Management Modules
          </p>
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'overview' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4.5 h-4.5" />
            Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
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
            onClick={() => setActiveTab('rooms')}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'rooms' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <KeyRound className="w-4.5 h-4.5" />
            Rooms Status Matrix
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'travel' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Truck className="w-4.5 h-4.5" />
            Transit Shuttles Desk
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
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
            onClick={() => setActiveTab('content')}
            className={`w-full text-left font-medium text-sm px-4 py-3 rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'content' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Plus className="w-4.5 h-4.5" />
            Content & Reviews Editor
          </button>

          <div className="border-t border-slate-800 pt-4 p-2 text-[11px] text-slate-500 font-mono leading-relaxed space-y-1 sm:col-span-2 md:col-span-3 lg:col-span-1 lg:mt-auto">
            <p>Database: localStorage</p>
            <p>Admin: rr493377@gmail.com</p>
            <p>Server Status: Active</p>
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h2 className="text-xl font-bold font-sans text-white">Residency Bookings Ledger</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Filter, approve, clean assign, and manage all patient stays near CMC.</p>
                    </div>
                    
                    {/* Status Tabs filter */}
                    <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                      {['All', 'Pending', 'Confirmed', 'CheckedIn', 'Completed', 'Cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setBookingFilterStatus(st)}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                            bookingFilterStatus === st ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

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
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-sans text-white">Guest Room Matrix Controls</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Toggle live status parameters, manage cleaning tasks and update room pricing.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <div 
                        key={room.id}
                        className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-md"
                      >
                        <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-slate-800/50">
                          <div>
                            <span className="text-lg font-black font-sans text-white">Room {room.roomNumber}</span>
                            <span className="text-[10px] font-mono text-slate-400 ml-2">({room.category})</span>
                          </div>

                          <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-black uppercase text-center ${
                            room.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' :
                            room.status === 'Occupied' ? 'bg-amber-500/20 text-amber-400' :
                            room.status === 'Cleaning' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {room.status}
                          </span>
                        </div>

                        <div className="p-4 space-y-4">
                          <div className="flex gap-4 text-xs font-mono">
                            <div>
                              <p className="text-slate-500 text-[10px] uppercase">Daily Rent</p>
                              {editingRoomId === room.id ? (
                                <div className="flex items-center gap-1.5 mt-1 animate-scale-up">
                                  <span className="text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={newRoomPrice}
                                    onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-700 rounded text-xs px-1.5 py-0.5 w-16 text-white text-center focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handlePriceUpdate(room.id)}
                                    className="bg-emerald-500 text-slate-950 p-1 rounded hover:bg-emerald-400 transition"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <p className="font-bold text-white flex items-center gap-1.5 mt-1">
                                  ₹{room.pricePerDay}
                                  <button
                                    onClick={() => {
                                      setEditingRoomId(room.id);
                                      setNewRoomPrice(room.pricePerDay);
                                    }}
                                    className="text-slate-500 hover:text-emerald-400"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="text-slate-500 text-[10px] uppercase font-mono">Beds & capacity</p>
                              <p className="text-slate-300 mt-1">{room.beds} (👥 Max {room.capacity})</p>
                            </div>
                          </div>

                          <div className="border-t border-slate-900 pt-3">
                            <p className="text-slate-500 uppercase font-mono text-[10px] mb-2">Manual Service Status Override</p>
                            <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                              {(['Available', 'Occupied', 'Cleaning', 'Maintenance'] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleRoomStatusChange(room.id, st)}
                                  className={`py-1 rounded text-center transition cursor-pointer hover:font-bold ${
                                    room.status === st 
                                      ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                                      : 'bg-slate-900 text-slate-400 border border-transparent hover:border-slate-800'
                                  }`}
                                >
                                  {st === 'Maintenance' ? 'Maint' : st}
                                </button>
                              ))}
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
