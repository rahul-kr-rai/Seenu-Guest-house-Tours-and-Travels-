/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ChevronRight, Bus, Car, Train, Eye } from 'lucide-react';

interface RouteOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  distance: string;
  duration: string;
  desc: string;
  points: string[];
}

export default function InteractiveMap() {
  const [activeRoute, setActiveRoute] = useState<string>('walking-cmc');

  const routes: RouteOption[] = [
    {
      id: 'walking-cmc',
      label: 'Walking to CMC Main Gate',
      icon: <Compass className="w-5 h-5 text-blue-600" />,
      distance: '180 meters',
      duration: '2-3 mins walk',
      desc: 'Superb, flat straight walking path from our guesthouse alley to CMC Entrance Gate 1 (Scudder Road). Highly convenient for medical rehabilitation visits.',
      points: [
        'Exit guesthouse gate, turn left onto Babu Rao Street (Quiet Residential Alley)',
        'Walk 80 meters past Sri Murugan Provision Store',
        'Turn right at the Scudder Road junction',
        'CMC Hospital main entrance gate & OPD registration is right across the street'
      ]
    },
    {
      id: 'rail-katpadi',
      label: 'From Katpadi Junction',
      icon: <Train className="w-5 h-5 text-blue-600" />,
      distance: '5.8 km',
      duration: '12-15 mins auto/cab',
      desc: 'Fast express trains arrive here from Kolkata, Delhi, Mumbai, and Cochin. Perfect connection point.',
      points: [
        'Take Katpadi Main Rd towards Vellore City center',
        'Cross the Palar River Bridge',
        'Pass the Vellore Old Bus Stand, proceed toward Babu Rao Street near Scudder Road',
        'Our guesthouse is tucked safely in the quiet lane away from honking traffic'
      ]
    },
    {
      id: 'chennai-airport',
      label: 'From Chennai Airport (MAA)',
      icon: <Car className="w-5 h-5 text-indigo-600" />,
      distance: '130 km',
      duration: '2.5 hours via NH4',
      desc: 'The best airport option. Direct AC sedan pickups can be pre-arranged with our custom travel service.',
      points: [
        'Take Chennai - Bengaluru Highway (NH 48)',
        'Drive through Sriperumbudur and Kanchipuram bypasses',
        'Take the Vellore East Exit towards CMC Hospital Road',
        'We will coordinate driver-to-guest WhatsApp tracking for instant gate drop-off'
      ]
    },
    {
      id: 'bangalore-airport',
      label: 'From Bengaluru Airport (BLR)',
      icon: <Bus className="w-5 h-5 text-purple-600" />,
      distance: '228 km',
      duration: '4 hours via NH48',
      desc: 'Ideal for passengers landing from Western India, GCC states, or overseas. Beautiful highway route.',
      points: [
        'Head toward Hosur via Bengaluru Electronic City flyover',
        'Pass Krishnagiri and Ambur (famous for Biryani lunch stops!)',
        'Take the Vellore Central exit toward Scudder Road',
        'Safe arrivals under custom medical assist monitoring'
      ]
    }
  ];

  const selectedRoute = routes.find(r => r.id === activeRoute) || routes[0];

  const openInGoogleMaps = () => {
    // Open exact coordinate or CMC Vellore general location
    window.open('https://www.google.com/maps/dir/?api=1&destination=Christian+Medical+College,+Vellore,+Tamil+Nadu+632004', '_blank');
  };

  return (
    <div id="interactive-map-section" className="bg-white rounded-2xl shadow-sm border border-slate-150 overflow-hidden">
      <div className="p-6 md:p-8 bg-[#1e293b] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full font-mono uppercase tracking-wider font-semibold">
              Location & Proximity
            </span>
          </div>
          <h3 className="text-2xl font-bold font-sans tracking-tight">Walking Closeness to CMC Hospital</h3>
          <p className="text-slate-300 text-sm mt-1">
            Located in Babu Rao Street alley—peacefully insulated from noisy hospital traffic, yet just a 2-minute stroll to OPD.
          </p>
        </div>
        <button
          onClick={openInGoogleMaps}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition duration-200 shadow-md text-sm shrink-0 cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-blue-200" />
          Get Google Maps Directions
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Route Selectors */}
        <div className="lg:col-span-5 border-r border-slate-100 bg-[#f8fafc] p-4 md:p-6 flex flex-col gap-2">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold mb-2 px-2">
            Select Travel Route
          </p>
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setActiveRoute(route.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl transition text-left cursor-pointer border ${
                activeRoute === route.id
                  ? 'bg-white border-blue-500 shadow-sm text-slate-900'
                  : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${
                activeRoute === route.id ? 'bg-blue-50' : 'bg-slate-100'
              }`}>
                {route.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm md:text-base flex justify-between items-center pr-2">
                  <span>{route.label}</span>
                  {activeRoute === route.id && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                </div>
                <div className="flex gap-3 text-xs mt-1 text-slate-500">
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-medium">{route.distance}</span>
                  <span className="font-semibold text-blue-600">{route.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Route Info and Map Art */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between bg-white">
          <div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full mb-3 inline-block">
              Route Details: {selectedRoute.label}
            </span>
            <div className="flex gap-4 items-baseline mt-2">
              <span className="text-3xl font-bold font-sans text-slate-900">{selectedRoute.distance}</span>
              <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                ⏱ {selectedRoute.duration}
              </span>
            </div>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              {selectedRoute.desc}
            </p>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold mb-3">
                Step-by-step guidance
              </h4>
              <ul className="space-y-3">
                {selectedRoute.points.map((pt, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700 leading-relaxed font-light">
                    <span className="w-5 h-5 bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-xl p-4 border border-slate-200 flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-full shadow-sm border border-slate-100 text-blue-600 shrink-0">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-xs text-slate-800">
              <p className="font-semibold">Local Tip for Patients:</p>
              <p className="text-slate-600 font-light mt-0.5 leading-relaxed">
                Most outpatient queues open at 6:30 AM. Walking from our Guest House takes less than 3 minutes, giving you a quiet head start over outside visitors relying on autos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
