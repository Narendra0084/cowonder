import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight, Compass, Sparkles } from 'lucide-react';
import { Destination } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface PopularDestinationsProps {
  destinations: Destination[];
  onSelectDestination: (destName: string) => void;
  onViewAllDestinations: () => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  destinations,
  onSelectDestination,
  onViewAllDestinations,
}) => {
  const { config } = useAgency();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Show popular destinations + others sorted
  const displayDestinations = [...destinations]
    .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    
    // Estimate active index based on item width
    const itemWidth = 340 + 24; // width + gap
    const index = Math.round(scrollLeft / itemWidth);
    setActiveIndex(Math.min(index, displayDestinations.length - 1));
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [displayDestinations.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 360;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Left/Right Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              <span>Curated Holiday Destinations</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
              WHERE DO YOU WANT TO GO?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              "Choose your dream destination and let our dedicated concierges plan your bespoke journey."
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-2.5 rounded-full transition cursor-pointer ${
                  canScrollLeft
                    ? 'bg-white text-slate-800 hover:text-amber-600 hover:shadow-md shadow-xs'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-2.5 rounded-full transition cursor-pointer ${
                  canScrollRight
                    ? 'bg-white text-slate-800 hover:text-amber-600 hover:shadow-md shadow-xs'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onViewAllDestinations}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0A192F] hover:text-amber-600 transition cursor-pointer px-3.5 py-2 rounded-lg hover:bg-slate-100"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal List Carousel */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 sm:gap-6 pb-6 pt-2 scroll-smooth no-scrollbar"
        >
          {displayDestinations.map((dest, idx) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.name)}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] max-w-[340px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer group hover:-translate-y-1.5"
            >
              {/* Image Container */}
              <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-900">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Region Tag */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 backdrop-blur-md shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{dest.region}</span>
                </div>

                {/* Popular Pill */}
                {dest.isPopular && (
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>Popular</span>
                  </div>
                )}

                {/* Starting Price Tag */}
                {dest.startingPrice > 0 && (
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10 shadow-lg">
                      <span className="text-[10px] text-slate-300 block font-normal">Starting from</span>
                      <span className="text-sm font-extrabold text-white">
                        {config.currencySymbol}{dest.startingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-amber-400 text-[#0A192F] flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-300 transition-all shadow-md">
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{dest.region} Expeditions</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0A192F] group-hover:text-amber-700 transition">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                {/* Highlights list snippet */}
                {dest.highlights && dest.highlights.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {dest.highlights.slice(0, 2).map((h, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[140px]"
                      >
                        {h}
                      </span>
                    ))}
                    {dest.highlights.length > 2 && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        +{dest.highlights.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Progress Bar & Indicator */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-4">
          <div className="text-xs font-semibold text-slate-500">
            Swipe or use arrows to explore <span className="text-[#0A192F] font-bold">{displayDestinations.length} destinations</span>
          </div>
          
          <div className="flex items-center gap-1">
            {displayDestinations.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-6 bg-amber-500' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
