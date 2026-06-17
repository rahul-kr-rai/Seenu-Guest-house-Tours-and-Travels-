/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { dbService } from '../services/dataService';
import { Calendar, User, Phone, MapPin, ClipboardList, Plane, CheckCircle2, AlertCircle, Sparkles, HelpCircle, Copy, ExternalLink, QrCode, MessageCircle, Send } from 'lucide-react';
import QRCode from 'qrcode';

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
  const [generatedTicket, setGeneratedTicket] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  // Simulated WhatsApp Notification & Chat Engine states
  const [showMockWhatsAppNav, setShowMockWhatsAppNav] = useState(false);
  const [simulatedChatHistory, setSimulatedChatHistory] = useState<Array<{sender: 'bot' | 'user', text: string, time: string}>>([]);
  const [simulatedUserReply, setSimulatedUserReply] = useState('');
  const [isAutoReplying, setIsAutoReplying] = useState(false);

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

  const handleSendSimulatedReply = (textToSend?: string) => {
    const text = textToSend || simulatedUserReply;
    if (!text.trim() || isAutoReplying) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: text, time: userTime };
    
    setSimulatedChatHistory(prev => [...prev, userMsg]);
    setSimulatedUserReply('');
    setIsAutoReplying(true);

    // Simulate smart customer desk agent responding back dynamically in 1s
    setTimeout(() => {
      const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let replyText = '';
      const lowercaseMsg = text.toLowerCase();
      
      if (lowercaseMsg.includes('confirm') || lowercaseMsg.includes('✓')) {
        replyText = `✅ *STATUS UPDATED TO CONFIRMED*\n\nThank you, *${guestName}*! Your confirmation reply has been registered in our reservation cloud.\n\nOur property manager will expect your arrival on check-in date *${checkInDate}*. Travel safe!`;
      } else if (lowercaseMsg.includes('question') || lowercaseMsg.includes('help') || lowercaseMsg.includes('how')) {
        replyText = `👨‍💼 *HELP DESK AGENT ASSIGNED*\n\nHello, a customer support executive is reviewing your request. For immediate assistance with CMC Hospital entries or route layout, you can also text us directly on our official WhatsApp: *+91 93602 11223*.`;
      } else if (lowercaseMsg.includes('bed') || lowercaseMsg.includes('pillow') || lowercaseMsg.includes('extra') || lowercaseMsg.includes('request')) {
        replyText = `🛏️ *SPECIAL REQUEST REGISTERED*\n\nWe have automatically appended: _"${text}"_ to your reservation notes!\n\nOur front-desk team will prepare the room amenities accordingly before your QR check-in scan.`;
      } else {
        replyText = `📩 *MESSAGE ACKNOWLEDGED*\n\nWe have received your message: _"${text}"_.\n\nOur desk agent at Seenu Guest House will coordinate with you via WhatsApp shortly to finalize ID verification!`;
      }

      setSimulatedChatHistory(prev => [...prev, { sender: 'bot' as const, text: replyText, time: assistantTime }]);
      setIsAutoReplying(false);
    }, 1000);
  };

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

      // Persist in local database so Manager Office Dashboard can still track demo bookings correctly!
      const newBooking = dbService.addBooking({
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

      // Generate a unique check-in QR Code payload
      const qrPayload = `${window.location.origin}/?checkin=${newBooking.id}`;
      QRCode.toDataURL(qrPayload, {
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      })
        .then(url => {
          setQrCodeDataUrl(url);
        })
        .catch(err => {
          console.error('Failed to generate local QR code', err);
        });

      // Construct the formatted ticket
      const pickupTxt = needTravel ? 'Yes' : 'No';
      const cleanTerminal = needTravel && pickupPoint ? (pickupPoint.includes('(') ? pickupPoint.split('(')[0].trim() : pickupPoint) : 'N/A';
      const terminalTxt = cleanTerminal.substring(0, 14);
      const timeTxt = needTravel && pickupTime ? pickupTime.substring(0, 12) : 'N/A';
      const longStayDiscountTxt = discountPercent > 0 ? `${discountPercent}%` : '0%';

      const whatsappText = `\`\`\`============================
🎟️ SEENU GUEST HOUSE TICKET 🎟️
============================
 CONFIRMED MEDICAL LODGING  
============================

🏨 STAY OVERVIEW
────────────────────────────
  ▶ GUEST:  ${guestName.substring(0, 14)}
  ▶ ROOM:   ${roomCategory.replace(' Room', '').substring(0, 14)}
  ▶ DAYS:   ${diffDays} Day${diffDays > 1 ? 's' : ''}
  ▶ IN:     ${checkInDate}
  ▶ OUT:    ${checkOutDate}
────────────────────────────

🚗 ARRIVAL LOGISTICS
────────────────────────────
  ▶ CAB:    ${pickupTxt}
  ▶ TERM:   ${terminalTxt}
  ▶ TIME:   ${timeTxt}
  ▶ DRIVER: Assigned
────────────────────────────

💰 FARE BREAKDOWN
────────────────────────────
  • RATE:   ₹${price}/Day
  • LESS:   ${longStayDiscountTxt}
  ➔ TOTAL:  ₹${calculatedAmt}
  ➔ STATUS: [ PENDING ]
────────────────────────────

🍳 FREE UTILITIES
────────────────────────────
  ✔ Attached Private Bath
  ✔ Self-cook Kitchen
  ✔ Gas Stove & Utensils
  ✔ Pure RO Drink Water
────────────────────────────

⚠️ VITAL STAY POLICIES
────────────────────────────
  1. Self-service clean
  2. Paid options:
     • Can 20L: ₹50
     • Bisleri: ₹75-120
────────────────────────────

👉 REQUIRED FOR ENTRY:
Reply with photo of ID Proof
and Patient UHID Card.
============================\`\`\``;

      // Redirect to WhatsApp with encoded parameters to bypass database latency
      const encodedText = encodeURIComponent(whatsappText);
      const computedUrl = `https://wa.me/919360211223?text=${encodedText}`;
      
      setGeneratedTicket(whatsappText);
      setWhatsappUrl(computedUrl);
      setSubmitSuccess(true);

      // Prepare simulated Chat History for the user to view in real-time within the web interface
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSimulatedChatHistory([
        {
          sender: 'bot',
          text: `🔔 *BOOKING RECEIVED* 🏨\n\nDear *${guestName}*,\nWe have successfully received your booking request! Here is your reservation receipt.\n\n📋 *Reservation details:*\n▫️ Guest ID: *${newBooking.id}*\n▫️ Category: *${roomCategory}*\n▫️ Stay: *${checkInDate} to ${checkOutDate}*\n▫️ Estimated Fare: *₹${calculatedAmt}*\n▫️ Bed Status: *Provisioned (Awaiting Proofs)*\n\n🔑 *Next Action Needed:*\nPlease send us a photo of your Government ID Proof and Patient Medical card to secure key handover!`,
          time: timeStr
        }
      ]);
      setShowMockWhatsAppNav(true);

      // Attempt to immediately open WhatsApp tab (might be blocked by popup blocker, which is fine since we display the view!)
      try {
        window.open(computedUrl, '_blank');
      } catch (err) {
        console.error('Failed to auto-open WhatsApp due to popup blocker', err);
      }
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
            ⚡ Direct Booking via WhatsApp
          </button>
          <button
            onClick={() => setFormType('google-form')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition cursor-pointer ${
              formType === 'google-form' 
                ? 'border-blue-600 text-slate-900 bg-blue-50/20' 
                : 'border-transparent text-slate-500 hover:text-slate-905 bg-slate-50/50'
            }`}
          >
            📋 Alternative Google Form
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="p-6 overflow-y-auto">
          {submitSuccess ? (
            <div className="py-2 px-2 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center rounded-full mb-3 animate-scale-up">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Digital Ticket Voucher Ready!</h2>
              <p className="text-slate-500 text-xs mt-1 max-w-md">
                Your reservation details are compiled successfully. Copy your ticket below or open directly in WhatsApp to secure your booking instantly with Seenu Guest House.
              </p>

              {/* Unique Check-In QR Code Card */}
              {qrCodeDataUrl && (
                <div id="booking-success-qrcode-card" className="w-full mt-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm">
                  <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-200 shrink-0 flex items-center justify-center">
                    <img src={qrCodeDataUrl} alt="Check-In QR Code" className="w-32 h-32 sm:w-36 sm:h-36" />
                  </div>
                  <div className="text-left space-y-2 flex-1">
                    <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-full w-fit">
                      <QrCode className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase font-black tracking-widest font-mono">Check-In Passport QR</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Instant Front Desk Verification</h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed font-light">
                      This QR matches your cloud booking. Our front desk staff will scan this upon arrival at CMC Jubilee Gate or Seenu Guest House desk to instantly verify your ID and assign keys without manual paperwork.
                    </p>
                    <div className="pt-1.5 flex gap-2">
                      <button
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = qrCodeDataUrl;
                          a.download = `SeenuGuestHouse_CheckIn_QR.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg transition cursor-pointer border border-transparent flex items-center gap-1 shadow-sm"
                      >
                        Download Ticket QR
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Simulated Live WhatsApp Desk Status Monitor */}
              <div id="simulated-whatsapp-sandbox-desk" className="w-full mt-5 bg-[#efeae2]/90 border border-slate-200 rounded-2xl overflow-hidden shadow-md font-sans">
                {/* Simulated Chat Window Header */}
                <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm border border-emerald-500/50 shadow-inner">
                        💬
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075e54] rounded-full animate-ping" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075e54] rounded-full" />
                    </div>
                    <div className="text-left font-sans">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-50">Seenu Guest House (Official)</span>
                        <div className="bg-emerald-500 p-0.5 rounded-full flex items-center justify-center w-3 h-3 text-[7px]" title="Auto-Respond Verification Verified">✓</div>
                      </div>
                      <span className="text-[10px] text-emerald-200 font-medium block">Verification Auto-Response Agent (Online)</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-wider bg-emerald-900/40 text-emerald-100 px-2 py-0.5 rounded border border-emerald-800/30">WhatsApp Service</span>
                </div>

                {/* Simulated Chat Feed */}
                <div className="p-4 space-y-4 max-h-[290px] overflow-y-auto text-left relative flex flex-col justify-start">
                  <span className="text-[9px] bg-sky-100 text-sky-805 font-bold px-3 py-1 rounded-full mx-auto select-none font-mono uppercase text-center">
                    🔒 Messages are simulated end-to-end for verification demo
                  </span>

                  {simulatedChatHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm space-y-1 ${
                        chat.sender === 'bot'
                          ? 'bg-white text-slate-800 self-start rounded-tl-none border border-slate-100'
                          : 'bg-[#dcf8c6] text-slate-850 self-end rounded-tr-none border border-emerald-200/50'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed select-text font-light text-slate-800">
                        {chat.text}
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-[9px] text-slate-400 font-mono">
                        <span>{chat.time}</span>
                        {chat.sender === 'bot' && (
                          <span className="text-blue-500 font-bold" title="Message Received">✓✓</span>
                        )}
                        {chat.sender === 'user' && (
                          <span className="text-blue-500 font-bold">✓✓</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {isAutoReplying && (
                    <div className="bg-white/90 border border-slate-200 text-slate-600 rounded-full px-4 py-1.5 text-[10px] w-fit self-start animate-pulse flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10px] text-slate-500 font-medium">Property Desk Representative typing...</span>
                    </div>
                  )}
                </div>

                {/* Pre-made quick responses bar */}
                <div className="bg-white/80 border-t border-slate-200/60 px-3 py-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono mr-1">Quick Answer:</span>
                  <button
                    type="button"
                    disabled={isAutoReplying}
                    onClick={() => handleSendSimulatedReply("Confirm Details ✓")}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[10px] px-2.5 py-1 rounded-full cursor-pointer transition font-medium disabled:opacity-40"
                  >
                    Confirm Details ✓
                  </button>
                  <button
                    type="button"
                    disabled={isAutoReplying}
                    onClick={() => handleSendSimulatedReply("Is there a kitchen for patient meals? 🍳")}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-[10px] px-2.5 py-1 rounded-full cursor-pointer transition font-medium disabled:opacity-40"
                  >
                    Check Kitchen 🍳
                  </button>
                  <button
                    type="button"
                    disabled={isAutoReplying}
                    onClick={() => handleSendSimulatedReply("Request extra blankets/pillows 🛏️")}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 text-[10px] px-2.5 py-1 rounded-full cursor-pointer transition font-medium disabled:opacity-40"
                  >
                    Extra Pillows 🛏️
                  </button>
                </div>

                {/* Chat Custom Input Form */}
                <div className="bg-[#f0f0f0] px-3 py-2.5 border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={simulatedUserReply}
                    onChange={(e) => setSimulatedUserReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendSimulatedReply();
                      }
                    }}
                    placeholder="Type customized reply to Seenu Auto-Agent Desk..."
                    disabled={isAutoReplying}
                    className="flex-1 bg-white border border-slate-200 rounded-full px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendSimulatedReply()}
                    disabled={!simulatedUserReply.trim() || isAutoReplying}
                    className="bg-[#128c7e] hover:bg-[#075e54] text-white p-2 rounded-full cursor-pointer transition disabled:bg-slate-300 disabled:text-slate-400 flex items-center justify-center shrink-0 w-8 h-8"
                    title="Send Simulated Message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* High-fidelity visual mockup of the ticket voucher itself */}
              <div className="w-full mt-4 text-left bg-slate-950 text-[#10b981] p-4 rounded-xl font-mono text-[11px] sm:text-xs overflow-x-auto whitespace-pre border border-slate-800 shadow-inner max-h-[280px]">
                {generatedTicket.replace(/```/g, '').trim()}
              </div>

              {/* Double-action CTAs for robust performance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedTicket);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                    copied 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? '✓ Copied Ticket Text!' : 'Copy Ticket Code'}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba56] text-white py-3 px-4 rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Master close callback to dismiss modal */}
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full mt-3 border border-slate-200 hover:bg-slate-50 text-slate-500 font-semibold py-2 rounded-xl transition text-xs cursor-pointer"
              >
                Finished & Close Window
              </button>
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition duration-200 shadow-sm text-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Formatting Details...' : 'Book Now & Open on WhatsApp ⚡'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
