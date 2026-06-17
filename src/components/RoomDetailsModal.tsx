import React, { useState, useRef } from 'react';
import { 
  X, Check, Smartphone, Flame, BadgeAlert, Sparkles, CheckCircle2, 
  MapPin, Clock, ArrowRight, Video, Image as ImageIcon, Play, Pause, 
  Volume2, VolumeX, ShieldCheck, HeartPulse, Coffee, User, Layers
} from 'lucide-react';
import { GuestRoom } from '../types';

interface RoomDetailsModalProps {
  room: GuestRoom;
  onClose: () => void;
  onBookNow: (category: string) => void;
}

const ROOM_MEDIA: Record<string, { images: string[]; videoUrl: string }> = {
  'Non-AC Single Room': {
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hotel-room-with-double-bed-and-large-window-41584-large.mp4'
  },
  'Non-AC Double Room': {
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620626011161-997c51447094?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-and-modern-hotel-room-interior-41582-large.mp4'
  },
  'Non-AC Double Room with Balcony': {
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cozy-hotel-room-interior-41580-large.mp4'
  },
  'AC Single Room': {
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622723133-78d420424341?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-hotel-room-with-stylish-decor-41581-large.mp4'
  },
  'AC Double Room': {
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-hotel-room-with-panoramic-view-41585-large.mp4'
  }
};

export default function RoomDetailsModal({ room, onClose, onBookNow }: RoomDetailsModalProps) {
  const media = ROOM_MEDIA[room.category] || {
    images: [room.imgUrl],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cozy-hotel-room-interior-41580-large.mp4'
  };

  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos');
  const [selectedImage, setSelectedImage] = useState(media.images[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Safe estimate calculation
  const [estDays, setEstDays] = useState(3);
  const totalCost = room.pricePerDay * estDays;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log('Video play error:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row transform transition-all duration-300">
          
          {/* Close button wrapper */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-40 bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md text-white p-2 rounded-full transition-colors cursor-pointer"
            id="close-room-details-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT PANEL: Media Gallery & Virtual Walkthrough */}
          <div className="w-full md:w-3/5 bg-slate-950 flex flex-col justify-between relative min-h-[350px] md:min-h-[550px]">
            {/* Tab switchers top overlay */}
            <div className="absolute top-4 left-4 z-30 flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('photos');
                  if (videoRef.current) videoRef.current.pause();
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'photos' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' 
                    : 'bg-slate-900/60 backdrop-blur-md text-slate-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({media.images.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'video' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' 
                    : 'bg-slate-900/60 backdrop-blur-md text-slate-300 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Walkthrough Video</span>
              </button>
            </div>

            {/* Media Content Stage */}
            <div className="flex-1 flex items-center justify-center relative bg-slate-950 min-h-[280px] md:min-h-0">
              {activeTab === 'photos' ? (
                <div className="w-full h-full relative flex items-center justify-center">
                  <img 
                    src={selectedImage} 
                    alt={room.category}
                    className="w-full h-full object-cover max-h-[480px] md:max-h-[550px] transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/30 pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-full relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={media.videoUrl}
                    className="w-full h-full object-cover max-h-[480px] md:max-h-[550px]"
                    loop
                    muted={isMuted}
                    playsInline
                    onClick={handlePlayPause}
                  />
                  
                  {/* Custom video overlays */}
                  <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center pointer-events-none">
                    {!isPlaying && (
                      <button 
                        onClick={handlePlayPause}
                        className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-full shadow-lg shadow-blue-500/30 transform hover:scale-105 active:scale-95 transition duration-200 cursor-pointer"
                      >
                        <Play className="w-8 h-8 fill-current translate-x-0.5" />
                      </button>
                    )}
                  </div>

                  {/* Video Controls Bar */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handlePlayPause}
                        className="text-white hover:text-blue-400 transition cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      <span className="text-[10px] text-slate-300 font-mono tracking-wider font-semibold uppercase">Walkthrough Walk</span>
                    </div>
                    <button 
                      onClick={handleMuteToggle}
                      className="text-white hover:text-blue-400 transition cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Photo Thumbnails gallery row */}
            {activeTab === 'photos' && (
              <div className="bg-slate-900/90 border-t border-slate-800 p-4 flex gap-2.5 overflow-x-auto w-full">
                {media.images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      selectedImage === image ? 'border-blue-500 scale-102 shadow' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt="Thumbnail view" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Room specifications and booking summary */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-white max-h-[90vh] overflow-y-auto">
            <div>
              {/* Category / Title */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-mono text-[10px] font-black uppercase tracking-wider">
                    Room {room.roomNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono rounded-full font-bold uppercase tracking-wider ${
                    room.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                    room.status === 'Occupied' ? 'bg-amber-50 text-amber-600' :
                    room.status === 'Cleaning' ? 'bg-blue-50 text-blue-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {room.status}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {room.category}
                </h3>
                
                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>Seenu Guest House, CMC Jubilee Gate 2 mins Walk</span>
                </div>
              </div>

              {/* Price Details */}
              <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">Pricing rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-950">₹{room.pricePerDay}</span>
                    <span className="text-xs text-slate-500">/ night</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-emerald-100/60 text-emerald-800 text-[10px] rounded font-bold uppercase tracking-wide">
                    No Hidden Taxes
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Electricity & RO Water Included</p>
                </div>
              </div>

              {/* Core quick details (Beds, Capacity) */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none">Beds Layout</span>
                    <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 inline-block">{room.beds}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none">Max Capacity</span>
                    <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 inline-block">{room.capacity} Attendants</span>
                  </div>
                </div>
              </div>

              {/* Complete Amenities Checklist */}
              <div className="mt-5 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
                  Provided Amenities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 bg-emerald-50 rounded-full p-0.5" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 bg-emerald-50 rounded-full p-0.5" />
                    <span>24/7 Power Backup</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 bg-emerald-50 rounded-full p-0.5" />
                    <span>Pure Water Dispenser</span>
                  </div>
                </div>
              </div>

              {/* Patient Care Highlights block */}
              <div className="mt-6 p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-2 text-xs text-blue-800">
                <p className="font-extrabold flex items-center gap-1.5 font-sans">
                  <HeartPulse className="w-4 h-4 text-blue-600 shrink-0 animate-pulse" />
                  Optimized for Patient Companions
                </p>
                <p className="font-light leading-relaxed text-blue-700">
                  This room features clean tiled floors to sustain critical infection-control practices, bilingual support staff, and direct coordination for medical lab deliveries.
                </p>
              </div>

              {/* Estimate stay calculator */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-slate-700">Estimate Stay Duration</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEstDays(Math.max(1, estDays - 1))}
                      className="bg-slate-100 text-slate-600 hover:bg-slate-200 w-7 h-7 flex items-center justify-center rounded-lg font-bold text-sm cursor-pointer transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold font-mono">{estDays} days</span>
                    <button
                      onClick={() => setEstDays(estDays + 1)}
                      className="bg-slate-100 text-slate-600 hover:bg-slate-200 w-7 h-7 flex items-center justify-center rounded-lg font-bold text-sm cursor-pointer transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-xl">
                  <span className="text-xs text-slate-400 font-mono">Estimated Booking Cost:</span>
                  <span className="text-base font-black font-mono">₹{totalCost}</span>
                </div>
              </div>
            </div>

            {/* Direct Book CTA */}
            <div className="mt-8">
              <button
                onClick={() => {
                  onBookNow(room.category);
                  onClose();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] duration-200 text-white py-4 rounded-xl text-center font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
                id="modal-confirm-book-btn"
              >
                <span>Book This Room Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[10px] text-slate-400 font-mono mt-2.5">
                Instant confirmation details dispatched to WhatsApp
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
