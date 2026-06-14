/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { dbService } from '../services/dataService';
import { Calendar, User, Phone, MapPin, ClipboardList, Plane, CheckCircle2, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

interface BookingFormProps {
  onClose: () => void;
  onSuccess: () => void;
  selectedCategory?: string;
}

export default function BookingForm({ onClose, onSuccess, selectedCategory = 'Non-AC Single Room' }: BookingFormProps) {
  const [formType, setFormType] = useState<'instant' | 'google-form'>('instant');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestState, setGuestState] = useState('West Bengal');
  const [patientCardNo, setPatientCardNo] = useState('');
  const [roomCategory, setRoomCategory] = useState(selectedCategory);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [needTravel, setNeedTravel] = useState(false);
  const [pickupPoint, setPickupPoint] = useState<'Katpadi Railway Station' | 'Chennai Airport' | 'Bangalore Airport' | 'None'>('None');
  const [pickupTime, setPickupTime] = useState('');
  const [flightTrainNo, setFlightTrainNo] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roomCategories = [
    'Non-AC Single Room',
    'Non-AC Double Room',
    'Non-AC Double Room with Balcony',
    'AC Single Room',
    'AC Double Room'
  ];

  const StatesList = [
    'West Bengal',
    'Bangladesh (International)',
    'Kerala',
    'Karnataka',
    'Assam',
    'Tripura',
    'Odisha',
    'Andhra Pradesh',
    'Bihar',
    'Uttar Pradesh',
    'Other State'
  ];

  const handleInstantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (!guestName || !guestPhone || !checkInDate || !checkOutDate) {
      setErrorMsg('Please fill in all mandatory fields (Name, Phone, Dates).');
      setIsSubmitting(false);
      return;
    }

    try {
      // Find room price
      const rooms = dbService.getRooms();
      const matchedCat = rooms.find(r => r.category === roomCategory);
      const price = matchedCat ? matchedCat.pricePerDay : 300;

      // Calculate total amount with discounts: 15+ days = 10% off, 30+ days = 20% off
      const t1 = new Date(checkInDate).getTime();
      const t2 = new Date(checkOutDate).getTime();
      const diffDays = Math.max(1, Math.round((t2 - t1) / (1000 * 60 * 60 * 24)));
      const baseCost = price * diffDays;
      let discountPercent = 0;
      if (diffDays >= 30) {
        discountPercent = 20;
      } else if (diffDays >= 15) {
        discountPercent = 10;
      }
      
      const savedAmount = Math.round((baseCost * discountPercent) / 100);
      const calculatedAmt = baseCost - savedAmount;

      dbService.addBooking({
        guestName,
        guestPhone,
        guestEmail,
        guestState,
        patientCardNo,
        roomCategory,
        checkInDate,
        checkOutDate,
        status: 'Pending',
        totalAmount: calculatedAmt,
        needTravelAssistance: needTravel,
        travelDetails: needTravel ? {
          pickupPoint,
          pickupTime,
          flightOrTrainNo: flightTrainNo
        } : undefined,
        specialInstructions
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (e: any) {
      setErrorMsg('Something went wrong. Please check your date formats.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleFormSubmit = () => {
    const googleFormBaseUrl = "https://forms.gle/pCrZeoYRmyJ7TAx48";
    window.open(googleFormBaseUrl, '_blank');
  };

  const calculateLivePrice = () => {
    if (!checkInDate || !checkOutDate) return null;
    try {
      const rooms = dbService.getRooms();
      const matchedCat = rooms.find(r => r.category === roomCategory);
      if (!matchedCat) return null;
      const price = matchedCat.pricePerDay;

      const t1 = new Date(checkInDate).getTime();
      const t2 = new Date(checkOutDate).getTime();
      const diffDays = Math.max(1, Math.round((t2 - t1) / (1000 * 60 * 60 * 24)));
      const baseCost = price * diffDays;
      let discountPercent = 0;
      if (diffDays >= 30) {
        discountPercent = 20;
      } else if (diffDays >= 15) {
        discountPercent = 10;
      }

      const savedAmount = Math.round((baseCost * discountPercent) / 100);
      const finalCost = baseCost - savedAmount;

      return {
        diffDays,
        price,
        baseCost,
        discountPercent,
        savedAmount,
        finalCost
      };
    } catch {
      return null;
    }
  };

  const priceCalc = calculateLivePrice();

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-150 flex flex-col max-h-[90vh] overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-[#1e293b] text-white flex justify-between items-center relative shrink-0">
          <div>
            <span className="text-xs text-blue-400 font-mono tracking-widest uppercase font-semibold">
              Medical Lodging & Transit Care
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight mt-0.5">Book Stay & Airport Pickup</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer text-lg font-light animate-none"
          >
            &times;
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 shrink-0">
          <button
            onClick={() => setFormType('instant')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition cursor-pointer ${
              formType === 'instant' 
                ? 'border-blue-600 text-slate-900 bg-blue-50/20' 
                : 'border-transparent text-slate-500 hover:text-slate-905 bg-slate-50/50'
            }`}
          >
            ⚡ Instant Request (Test Admin Dashboard!)
          </button>
          <button
            onClick={() => setFormType('google-form')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition cursor-pointer ${
              formType === 'google-form' 
                ? 'border-blue-600 text-slate-900 bg-blue-50/20' 
                : 'border-transparent text-slate-500 hover:text-slate-905 bg-slate-50/50'
            }`}
          >
            📋 Live Google Form Connection
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="p-6 overflow-y-auto">
          {submitSuccess ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center rounded-full mb-4 animate-scale-up">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Request Lodged Successfully!</h2>
              <p className="text-slate-600 text-sm mt-2 max-w-md">
                Your guesthouse booking and travel assistance request has been recorded. Since this is in live test mode, you can immediately manage this check-in in our **Admin Dashboard**!
              </p>
            </div>
          ) : formType === 'google-form' ? (
            <div className="py-2 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-900">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Production Mode Integration:</p>
                  <p className="font-light mt-1">
                    To maintain zero maintenance server fees, we support connecting guest inquiries straight to your personal Google Sheet via a custom Google Form. This saves all entries securely on the cloud.
                  </p>
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl p-5 space-y-4 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-base">Steps in Google Forms Connection:</h4>
                <ol className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Set up your fields (Name, Phone, Selected Room, State, Train Number, Medical Care needs).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Paste your Google Form ID into your Environment Secrets.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>All submissions will automatically feed both into your Google Drive, and can optionally trigger instant SMS alerts to your phone.</span>
                  </li>
                </ol>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleFormSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-sm text-sm cursor-pointer"
                >
                  Launch Demo Google Form Inquiry
                </button>
                <p className="text-center text-xs text-slate-400 font-light">
                  Forms will open in a brand new browser tab safely.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInstantSubmit} className="space-y-5">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-800 text-sm flex gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Guest Details */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-blue-600 font-black mb-3 text-slate-500">
                  1. Contact & Patient Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-650 mb-1">
                      Guest / Primary Attendant Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Sujay Sen"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-655 mb-1">
                      WhatsApp/Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="e.g. +91 98300 12345"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-655 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. sujay@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-655 mb-1">
                      Origin State/Country *
                    </label>
                    <select
                      value={guestState}
                      onChange={(e) => setGuestState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500"
                    >
                      {StatesList.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-655 mb-1">
                      CMC OP UHID Card No (Optional - if already registered)
                    </label>
                    <div className="relative">
                      <ClipboardList className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. CMC-789012-K (Helps us coordinate hospital appointments)"
                        value={patientCardNo}
                        onChange={(e) => setPatientCardNo(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stay Dates */}
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold mb-3 text-slate-500">
                  2. Room Accommodation Preference
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-slate-655 mb-1">
                      Preferred Room Category
                    </label>
                    <select
                      value={roomCategory}
                      onChange={(e) => setRoomCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500"
                    >
                      {roomCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-655 mb-1">
                      Expected Check-In *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-655 mb-1">
                      Expected Check-Out *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Pricing Estimation Panel */}
                {priceCalc && (
                  <div className="mt-4 bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl space-y-2 text-slate-800 animate-scale-up">
                    <div className="flex justify-between items-center pb-2 border-b border-emerald-100/50">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        Live Stay Price Estimate
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-100">
                        {priceCalc.diffDays} {priceCalc.diffDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                    <div className="text-xs space-y-1 bg-white/40 p-2.5 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Daily Rate:</span>
                        <span className="font-semibold text-slate-850">₹{priceCalc.price} / day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Base total:</span>
                        <span className="font-semibold text-slate-850">₹{priceCalc.baseCost}</span>
                      </div>
                      {priceCalc.discountPercent > 0 && (
                        <div className="flex justify-between text-emerald-700 font-medium">
                          <span>Discount Applied ({priceCalc.discountPercent}%):</span>
                          <span>- ₹{priceCalc.savedAmount}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-2 font-sans font-bold text-[#111827]">
                      <span className="text-emerald-950 text-xs uppercase tracking-wider font-mono">Estimated Sum:</span>
                      <span className="text-lg text-emerald-600">₹{priceCalc.finalCost}</span>
                    </div>
                    {priceCalc.discountPercent > 0 ? (
                      <p className="text-[10px] text-emerald-700 text-right font-medium italic">
                        ✓ Long stay discount applied successfully! Saving ₹{priceCalc.savedAmount}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 text-right leading-none">
                        💡 Save 10% after 15 days or 20% after 30 days of medical lodging!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Travel Services */}

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold text-slate-500">
                    3. Travel & Logistics Assistance
                  </h4>
                  <label className="flex items-center gap-1.5 text-xs text-blue-900 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={needTravel}
                      onChange={(e) => setNeedTravel(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Requires Airport/Station Pickup
                  </label>
                </div>

                {needTravel && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 bg-blue-50/20 p-4 rounded-xl border border-blue-100/50 animate-scale-up">
                    <div>
                      <label className="block text-xs font-medium text-slate-800 mb-1">
                        Pickup Location
                      </label>
                      <select
                        value={pickupPoint}
                        onChange={(e) => setPickupPoint(e.target.value as any)}
                        className="w-full px-3 py-2 border border-blue-200/55 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="None">Select Terminal...</option>
                        <option value="Katpadi Railway Station">Katpadi Railway Station</option>
                        <option value="Chennai Airport">Chennai Airport (130 km)</option>
                        <option value="Bangalore Airport">Bangalore Airport (228 km)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-850 mb-1">
                        Expected Arrival Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5:30 AM or 14:00"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200/55 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-850 mb-1">
                        Train / National Flight no.
                      </label>
                      <div className="relative">
                        <Plane className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. 12841 Coromandel"
                          value={flightTrainNo}
                          onChange={(e) => setFlightTrainNo(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-blue-200/55 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Special Recovery or Companion Needs (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need low-floor room for wheelchair, support with kitchen utensils, oxygen backup support setup coordination..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-4 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition duration-150 text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition duration-200 shadow-sm text-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Registering Booking...' : 'Submit Stay Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
