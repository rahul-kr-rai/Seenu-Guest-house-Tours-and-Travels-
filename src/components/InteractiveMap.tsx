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
      label: 'Walking to CMC Jubilee Gate Bus Stop',
      icon: <Compass className="w-5 h-5 text-blue-600" />,
      distance: '350 meters',
      duration: '4-5 mins walk',
      desc: 'Superb, flat straight walking path from our guesthouse alley to CMC Jubilee Gate Bus Stop. Highly convenient for medical rehabilitation visits.',
      points: [
        'Exit guesthouse gate, turn left onto Babu Rao Street (Quiet Residential Alley)',
        'Walk 250 meters past Sri Murugan Provision Store',
        'Turn right at the Jubilee Gate intersection',
        'CMC Jubilee Gate Bus Stop & hospital registration desk is conveniently reachable right across the street'
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
        'Pass the Vellore Old Bus Stand, proceed toward Babu Rao Street near CMC Jubilee Gate',
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
        'Take the Vellore Central exit toward CMC Jubilee Gate Bus Stop',
        'Safe arrivals under custom medical assist monitoring'
      ]
    }
  ];

  const mapEmbedUrls: Record<string, string> = {
    'walking-cmc': 'https://maps.google.com/maps?q=Christian%20Medical%20College%20Vellore&t=&z=16&ie=UTF8&iwloc=&output=embed',
    'rail-katpadi': 'https://maps.google.com/maps?q=Katpadi%20Junction%20Railway%20Station%20Vellore&t=&z=14&ie=UTF8&iwloc=&output=embed',
    'chennai-airport': 'https://maps.google.com/maps?q=Chennai%20International%20Airport&t=&z=10&ie=UTF8&iwloc=&output=embed',
    'bangalore-airport': 'https://maps.google.com/maps?q=Kempegowda%20International%20Airport%20Bengaluru&t=&z=10&ie=UTF8&iwloc=&output=embed'
  };

  const selectedRoute = routes.find(r => r.id === activeRoute) || routes[0];

  const openInGoogleMaps = () => {
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
            Located in Babu Rao Street alley—peacefully insulated from noisy hospital traffic, yet just a 4-minute stroll to OPD.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Route Selectors */}
        <div className="lg:col-span-4 border-r border-slate-100 bg-[#f8fafc] p-4 md:p-6 flex flex-col gap-2">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold mb-2 px-2">
            Select Travel Route
          </p>
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setActiveRoute(route.id)}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl transition text-left cursor-pointer border ${
                activeRoute === route.id
                  ? 'bg-white border-blue-500 shadow-sm text-slate-900'
                  : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${
                activeRoute === route.id ? 'bg-blue-50' : 'bg-slate-100'
              }`}>
                {route.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm flex justify-between items-center pr-1 leading-snug">
                  <span className="truncate">{route.label}</span>
                  {activeRoute === route.id && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 ml-1" />}
                </div>
                <div className="flex gap-2 text-[11px] mt-0.5 text-slate-500">
                  <span className="font-mono bg-slate-100 px-1 py-0.2 rounded font-medium">{route.distance}</span>
                  <span className="font-semibold text-blue-600">{route.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Route Info */}
        <div className="lg:col-span-4 p-5 md:p-6 flex flex-col justify-between bg-white border-r border-slate-100">
          <div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full mb-3 inline-block">
              Route Details: {selectedRoute.label}
            </span>
            <div className="flex gap-4 items-baseline mt-1">
              <span className="text-2xl font-bold font-sans text-slate-900">{selectedRoute.distance}</span>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                ⏱ {selectedRoute.duration}
              </span>
            </div>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              {selectedRoute.desc}
            </p>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2">
                Step-by-step guidance
              </h4>
              <ul className="space-y-2">
                {selectedRoute.points.map((pt, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-slate-700 leading-relaxed font-light">
                    <span className="w-4 h-4 bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-xl p-3 border border-slate-200/80 flex items-start gap-3">
            <div className="bg-white p-2 rounded-full shadow-xs border border-slate-100 text-blue-600 shrink-0 mt-0.5 animate-bounce">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-[11px] text-slate-800">
              <p className="font-semibold">Local Tip for Patients:</p>
              <p className="text-slate-600 font-light mt-0.5 leading-normal">
                Most outpatient queues open at 6:30 AM. Walking takes less than 3 minutes, giving you a quiet head start over outside visitors relying on autos.
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Live Google Map */}
        <div className="lg:col-span-4 p-4 bg-slate-50 flex flex-col h-full min-h-[350px] lg:min-h-0">
          <div className="w-full flex-1 rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-200 relative">
            <iframe
              src={mapEmbedUrls[activeRoute]}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
          <div className="flex justify-between items-center mt-2.5 px-1 text-[10px] text-slate-400 font-mono">
            <span>© Google Maps Live Feed</span>
            <button 
              onClick={openInGoogleMaps} 
              className="text-blue-500 hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <Eye className="w-3 h-3" /> External View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
