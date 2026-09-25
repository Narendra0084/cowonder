import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Heart, 
  UserCheck, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { TourPackage } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface FeaturedPackagesProps {
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
  onViewAllPackages: () => void;
}

type TourTypeFilter = 'all' | 'Group Tour' | 'Personal Tour' | 'Honeymoon / Couple' | 'Custom Trip';

interface FilterOption {
  id: TourTypeFilter;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Trips', icon: Compass },
  { id: 'Group Tour', label: 'Group Tour', icon: Users },
  { id: 'Personal Tour', label: 'Personal Tour', icon: UserCheck },
  { id: 'Honeymoon / Couple', label: 'Honeymoon / Couple', icon: Heart },
  { id: 'Custom Trip', label: 'Custom Trip', icon: SlidersHorizontal },
];

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  packages,
  onSelectPackage,
  onViewAllPackages,
}) => {
  const { config, openEnquiryModal, openPlanTripPopup } = useAgency();
  const [selectedFilter, setSelectedFilter] = useState<TourTypeFilter>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Helper to resolve tour type if not explicitly set
  const resolveTourType = (pkg: TourPackage): string => {
    if (pkg.tourType) return pkg.tourType;
    const lower = `${pkg.title} ${pkg.description} ${pkg.overview}`.toLowerCase();
    if (lower.includes('honeymoon') || lower.includes('romantic') || lower.includes('couple') || lower.includes('kerala bliss')) {
      return 'Honeymoon / Couple';
    }
    if (lower.includes('custom') || lower.includes('glamour') || lower.includes('dubai') || lower.includes('bespoke')) {
      return 'Custom Trip';
    }
    if (lower.includes('group') || lower.includes('rajasthan') || lower.includes('goa coastal')) {
      return 'Group Tour';
    }
    return 'Personal Tour';
  };

  // Filter packages by published & tour type
  const publishedPackages = packages.filter((p) => p.status === 'published');

  const filteredPackages = publishedPackages.filter((pkg) => {
    if (selectedFilter === 'all') return true;
    const type = resolveTourType(pkg);
    return type.toLowerCase().includes(selectedFilter.toLowerCase()) || 
           selectedFilter.toLowerCase().includes(type.toLowerCase());
  });

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const itemWidth = 360 + 24;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveIndex(Math.min(index, filteredPackages.length - 1));
  };

  useEffect(() => {
    checkScroll();
  }, [filteredPackages.length, selectedFilter]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 380;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const getTourTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Honeymoon / Couple':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Group Tour':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Custom Trip':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Personal Tour':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Mandated exact title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Handcrafted & Vetted Itineraries</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
              TRIPS WORTH TAKING
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Transparent tour packages with itemized inclusions, verified stays, dedicated chauffeur cars, and personal assistance throughout.
            </p>
          </div>

          {/* Top Actions: Arrow Navigation & View All */}
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
              onClick={onViewAllPackages}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0A192F] hover:text-amber-600 transition cursor-pointer px-3.5 py-2 rounded-lg hover:bg-slate-100"
            >
              <span>Browse All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tour Types Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar">
          {FILTER_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedFilter(opt.id);
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#0A192F] text-amber-400 border-[#0A192F] shadow-md scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Horizontal Packages Scroll Carousel */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300 my-4">
            <p className="text-slate-600 text-sm font-medium">No packages found for this tour type category.</p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-3 px-4 py-2 bg-amber-400 text-[#0A192F] font-bold text-xs rounded-lg hover:bg-amber-300 transition"
            >
              Reset to All Trips
            </button>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 pt-2 scroll-smooth no-scrollbar"
          >
            {filteredPackages.map((pkg) => {
              const tourType = resolveTourType(pkg);
              return (
                <div
                  key={pkg.id}
                  className="min-w-[300px] sm:min-w-[340px] md:min-w-[370px] max-w-[370px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-amber-400/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
                >
                  {/* Image & Badges */}
                  <div 
                    onClick={() => onSelectPackage(pkg)}
                    className="relative h-64 overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'}
                      alt={pkg.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Destination Badge */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#0A192F] backdrop-blur-md shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{pkg.destination}</span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 text-slate-100 backdrop-blur-md border border-white/10 shadow-md">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{pkg.duration}</span>
                    </div>

                    {/* Tour Type Badge on Image Bottom Left */}
                    <div className="absolute bottom-3.5 left-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border shadow-md ${getTourTypeBadgeStyle(tourType)}`}>
                        {tourType}
                      </span>
                    </div>

                    {/* Offer Badge */}
                    {(pkg.offerBadge || pkg.id.includes('kashmir')) && (
                      <div className="absolute bottom-3.5 right-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[10px] sm:text-[11px] px-3 py-1 rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1 border border-orange-300/40">
                        <Sparkles className="w-3 h-3 text-amber-100" />
                        <span>{pkg.offerBadge || '35% SPECIAL OFF'}</span>
                      </div>
                    )}
                  </div>

                  {/* Package Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 
                        onClick={() => onSelectPackage(pkg)}
                        className="font-display text-lg sm:text-xl font-bold text-[#0A192F] group-hover:text-amber-700 transition cursor-pointer line-clamp-1 leading-snug"
                      >
                        {pkg.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Highlights snippet */}
                      {pkg.highlights && pkg.highlights.length > 0 && (
                        <ul className="mt-3.5 space-y-1.5">
                          {pkg.highlights.slice(0, 2).map((hl, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 font-medium">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{hl}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Pricing & Actions */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                            Starting Price
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">Taxes & Transfers Incl.</span>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline gap-2 justify-end">
                            {pkg.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                {config.currencySymbol}{pkg.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-xl font-black text-[#0A192F]">
                              {config.currencySymbol}{pkg.startingPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">/ person</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onSelectPackage(pkg)}
                          className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-center cursor-pointer"
                        >
                          View Trip
                        </button>
                        <button
                          onClick={() => openPlanTripPopup({
                            destinationName: pkg.destination,
                            packageTitle: pkg.title,
                          })}
                          className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition text-center cursor-pointer shadow-md hover:shadow-orange-500/20"
                        >
                          Get Quote
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Carousel Progress Bar & Indicator */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-4">
          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="text-[#0A192F] font-bold">{filteredPackages.length}</span> curated {selectedFilter === 'all' ? 'trips' : selectedFilter} packages
          </div>
          
          <div className="flex items-center gap-1">
            {filteredPackages.map((_, i) => (
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
