import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Headphones, 
  FileCheck2, 
  SlidersHorizontal, 
  LifeBuoy, 
  MapPin, 
  Search,
  Users,
  IndianRupee,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { Destination } from '../../types';

interface HeroSectionProps {
  destinations: Destination[];
  onExplorePackages: (destinationFilter?: string) => void;
}

interface HeroSlide {
  id: string;
  destination: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  duration: string;
  originalPrice: number;
  offerPrice: number;
  image: string;
  highlights: string[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'kashmir',
    destination: 'Kashmir',
    badge: '35% SPECIAL OFF',
    badgeColor: 'from-amber-500 to-orange-600',
    title: 'Heavenly Kashmir',
    subtitle: 'Glide across mirror-still Dal Lake waters on private Shikaras and touch the clouds in snow-clad Gulmarg.',
    duration: '9 Days • 8 Nights',
    originalPrice: 27500,
    offerPrice: 17999,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2000&q=85',
    highlights: ['Dal Lake Houseboat Stay', 'Gulmarg Gondola Ride', 'Betaab Valley & Sonmarg', 'Private Dedicated Chauffeur'],
  },
  {
    id: 'rajasthan',
    destination: 'Rajasthan',
    badge: 'ROYAL HERITAGE',
    badgeColor: 'from-amber-600 to-yellow-600',
    title: 'Majestic Rajasthan',
    subtitle: 'Relive royal history across amber-lit palaces, lakefront havelis, and starlit Thar desert sand dunes.',
    duration: '6 Days • 5 Nights',
    originalPrice: 36000,
    offerPrice: 28500,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=85',
    highlights: ['Amber Fort Elephant Walk', 'Lake Pichola Sunset Cruise', 'Sam Dunes Luxury Desert Camp', 'Jaipur Pink City Tour'],
  },
  {
    id: 'kerala',
    destination: 'Kerala',
    badge: 'NATURE RETREAT',
    badgeColor: 'from-emerald-500 to-teal-600',
    title: 'Verdant Kerala Backwaters',
    subtitle: 'Awake to rolling mist over emerald tea estates in Munnar and drift along serene palm-fringed lagoons.',
    duration: '5 Days • 4 Nights',
    originalPrice: 29000,
    offerPrice: 21999,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=85',
    highlights: ['Private Traditional Houseboat', 'Munnar Tea Valley Trek', 'Authentic Ayurvedic Spa', 'Kovalam Coastal Sunset'],
  },
  {
    id: 'dubai',
    destination: 'Dubai',
    badge: 'INTERNATIONAL FLAGSHIP',
    badgeColor: 'from-blue-600 to-indigo-700',
    title: 'Futuristic Dubai Wonders',
    subtitle: 'From the glittering glass towers of Downtown to thrilling 4x4 red dune desert bashing and marina yacht cruises.',
    duration: '6 Days • 5 Nights',
    originalPrice: 58000,
    offerPrice: 46999,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85',
    highlights: ['Burj Khalifa 124th Floor Deck', 'Red Dune 4x4 Safari & BBQ', 'Marina Dhow Dinner Cruise', 'All Sightseeing & Transfers'],
  },
  {
    id: 'bali',
    destination: 'Bali',
    badge: 'TROPICAL PARADISE',
    badgeColor: 'from-cyan-600 to-blue-600',
    title: 'Enchanting Bali & Islands',
    subtitle: 'Explore sacred cliffside temples, cascading rice terraces of Ubud, and turquoise lagoons of Nusa Penida.',
    duration: '7 Days • 6 Nights',
    originalPrice: 65000,
    offerPrice: 52500,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=85',
    highlights: ['Private Pool Villa', 'Nusa Penida Island Tour', 'Uluwatu Cliff Sunset Dance', 'Tegalalang Rice Terraces'],
  },
  {
    id: 'goa',
    destination: 'Goa',
    badge: 'COASTAL LEISURE',
    badgeColor: 'from-orange-500 to-pink-600',
    title: 'Golden Goa Shores',
    subtitle: 'Stroll cobblestone Latin quarter streets, sail on a private catamaran, and soak up tranquil beach breezes.',
    duration: '4 Days • 3 Nights',
    originalPrice: 20000,
    offerPrice: 14999,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=85',
    highlights: ['Fontainhas Heritage Walk', 'Sunset Catamaran Cruise', 'Boutique Beachfront Resort', 'Airport Pickup & Drop'],
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ destinations, onExplorePackages }) => {
  const { openPlanTripPopup, getWhatsAppUrl, config } = useAgency();
  
  // Slider State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Search Filter Form State
  const [selectedDest, setSelectedDest] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTourType, setSelectedTourType] = useState('Group Tour');

  const activeSlide = HERO_SLIDES[currentSlideIndex];
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance interval
  useEffect(() => {
    if (isPaused) {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      return;
    }

    slideTimerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isPaused, currentSlideIndex]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNextSlide();
    } else if (diff < -50) {
      handlePrevSlide();
    }
    setTouchStartX(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onExplorePackages(selectedDest);
  };

  return (
    <div 
      className="relative bg-[#071224] text-white overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Background Image Slider with Cross-Fade & Gentle Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Cinematic Luxury Dark Gradients for Maximum Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071224] via-[#071224]/75 to-[#071224]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071224]/95 via-[#071224]/70 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Slide Top Progress Bar */}
      <div className="relative z-20 w-full bg-white/10 h-1">
        <div 
          key={currentSlideIndex}
          className={`h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all ${
            isPaused ? 'w-full' : 'animate-[progress_5.5s_linear_infinite]'
          }`}
          style={{ width: isPaused ? undefined : undefined }}
        />
      </div>

      {/* Main Slide Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-14 sm:pb-16 min-h-[640px] sm:min-h-[720px] flex flex-col justify-between">
        
        {/* Top Floating Badge & Slider Index Navigation */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-400 shadow-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>An Wonder Co • Independent & Tailored Holidays</span>
          </div>

          {/* Slide Numeric Indicator & Pause Toggle */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 text-xs text-white/90">
            <span className="font-mono font-bold text-amber-400">0{currentSlideIndex + 1}</span>
            <span className="text-white/40">/</span>
            <span className="font-mono text-white/60">0{HERO_SLIDES.length}</span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="ml-2 text-white/70 hover:text-white transition cursor-pointer p-0.5"
              title={isPaused ? 'Resume Auto Slider' : 'Pause Slider'}
            >
              {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Center: Slide Details & Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          
          {/* Left Hero Typography (7 Cols) */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5 text-left">
            
            {/* Offer / Category Badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider text-white bg-gradient-to-r ${activeSlide.badgeColor} shadow-md`}>
                {activeSlide.badge}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-950/40 px-3 py-1 rounded-md border border-amber-500/30 backdrop-blur-xs">
                <Clock className="w-3.5 h-3.5" />
                {activeSlide.duration}
              </span>
            </div>

            {/* Slide Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-md">
              {activeSlide.title}
            </h1>

            {/* Subtitle / Experience Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow-xs">
              {activeSlide.subtitle}
            </p>

            {/* Highlights Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeSlide.highlights.map((h, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-xs text-white/90 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              
              {/* Dynamic Price Display */}
              <div className="bg-black/50 backdrop-blur-md border border-amber-400/40 rounded-xl px-4 py-2.5 shadow-lg">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starting From</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-400 line-through">₹{activeSlide.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400">₹{activeSlide.offerPrice.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-300">/ person</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => openPlanTripPopup({ 
                  destinationName: activeSlide.destination, 
                  packageTitle: `${activeSlide.title} (${activeSlide.duration})` 
                })}
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#0A192F] bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition shadow-xl hover:shadow-amber-400/20 flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Book This Tour</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Talk to Expert on WhatsApp */}
              <a
                href={getWhatsAppUrl(`Hello ${config.agencyName}, I am interested in booking the ${activeSlide.title} (${activeSlide.duration}) starting at ₹${activeSlide.offerPrice}. Please share the detailed itinerary.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-slate-800/90 hover:bg-slate-750 border border-slate-600/80 backdrop-blur-md transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Talk to Expert</span>
              </a>

            </div>

          </div>

          {/* Right Column: Slide Controls & Destination Quick Switcher (4 Cols) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end gap-4">
            
            {/* Arrow Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:text-amber-400 transition cursor-pointer shadow-lg active:scale-95"
                title="Previous Destination"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:text-amber-400 transition cursor-pointer shadow-lg active:scale-95"
                title="Next Destination"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Destination Cards Switcher */}
            <div className="space-y-2 w-full max-w-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right pr-1">
                Featured Destinations
              </div>
              {HERO_SLIDES.slice(0, 4).map((slide, idx) => {
                const isSelected = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition cursor-pointer text-left border ${
                      isSelected
                        ? 'bg-white/20 border-amber-400 backdrop-blur-lg shadow-md'
                        : 'bg-black/40 border-white/10 hover:bg-white/10 backdrop-blur-md'
                    }`}
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.destination} 
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/20" 
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                        {slide.destination}
                      </h4>
                      <p className="text-[11px] text-slate-300 truncate">From ₹{slide.offerPrice.toLocaleString('en-IN')}</p>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mr-1" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* Bottom Section: Floating Modern Search Bar */}
        <div className="pt-2">
          
          <form 
            onSubmit={handleSearch} 
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 text-slate-800 shadow-2xl border border-white/40 grid grid-cols-1 sm:grid-cols-4 gap-2.5 max-w-4xl"
          >
            {/* Where to? */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-100/90 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="w-full text-left">
                <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Where to?</span>
                <select
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="">Choose Destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-100/90 rounded-xl border border-slate-200">
              <IndianRupee className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="w-full text-left">
                <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Budget</span>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="">Any Budget</option>
                  <option value="under20">Under ₹20,000</option>
                  <option value="20-40">₹20,000 - ₹40,000</option>
                  <option value="40-70">₹40,000 - ₹70,000</option>
                  <option value="luxury">₹70,000+ Luxury</option>
                </select>
              </div>
            </div>

            {/* Tour Type */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-100/90 rounded-xl border border-slate-200">
              <Users className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="w-full text-left">
                <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Tour Type</span>
                <select
                  value={selectedTourType}
                  onChange={(e) => setSelectedTourType(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Group Tour">Group Tour</option>
                  <option value="Honeymoon">Honeymoon / Couple</option>
                  <option value="Family">Family Holiday</option>
                  <option value="Solo">Solo Adventure</option>
                  <option value="Luxury">Private Luxury Tour</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Trips</span>
            </button>
          </form>

          {/* Quick Destination Pill Shortcuts */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs text-slate-300 no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Popular:</span>
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  onExplorePackages(slide.destination);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer shrink-0 border ${
                  idx === currentSlideIndex 
                    ? 'bg-amber-400 text-[#0A192F] border-amber-400 font-bold shadow-xs' 
                    : 'bg-black/30 text-white/80 hover:bg-white/20 border-white/10'
                }`}
              >
                {slide.destination}
              </button>
            ))}
          </div>

        </div>

        {/* Mobile Slide Navigation Buttons & Dots */}
        <div className="flex lg:hidden items-center justify-between pt-4">
          <button
            onClick={handlePrevSlide}
            className="p-2.5 rounded-full bg-black/50 border border-white/20 text-white active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlideIndex 
                    ? 'w-6 h-2 bg-amber-400' 
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextSlide}
            className="p-2.5 rounded-full bg-black/50 border border-white/20 text-white active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* TRUST BAR (Immediately below slider screen) */}
      <div className="relative z-20 border-t border-slate-800/80 bg-[#061122]/95 backdrop-blur-md py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-white">
                  Personal Travel Assistance
                </h4>
                <p className="text-[11px] text-slate-400">Direct human coordinator</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-white">
                  Transparent Packages
                </h4>
                <p className="text-[11px] text-slate-400">Itemized, zero hidden fees</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-400/10 text-sky-400 border border-sky-400/20 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-white">
                  Customized Trips
                </h4>
                <p className="text-[11px] text-slate-400">Tailored to your pace & dates</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-400/10 text-purple-400 border border-purple-400/20 flex items-center justify-center shrink-0">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-white">
                  Direct Support
                </h4>
                <p className="text-[11px] text-slate-400">24/7 on-ground emergency line</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
