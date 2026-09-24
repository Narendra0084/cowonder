import React from 'react';
import { Clock, MapPin, ArrowRight, Check, Sparkles } from 'lucide-react';
import { TourPackage } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface FeaturedPackagesProps {
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
  onViewAllPackages: () => void;
}

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  packages,
  onSelectPackage,
  onViewAllPackages,
}) => {
  const { config, openEnquiryModal } = useAgency();

  // Show published featured packages, or all published if none featured
  const featured = packages.filter((p) => p.status === 'published' && p.featured);
  const displayPackages = (featured.length > 0 ? featured : packages.filter(p => p.status === 'published')).slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Mandated exact title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Carefully Handcrafted & Vetted Itineraries</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A192F] tracking-tight">
              TRIPS WORTH TAKING
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Transparent packages with verified 4-star stays, dedicated chauffeur cars, and personal assistance throughout.
            </p>
          </div>

          <button
            onClick={onViewAllPackages}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0A192F] hover:text-amber-600 transition cursor-pointer self-start md:self-end"
          >
            <span>Browse All Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badges */}
              <div 
                onClick={() => onSelectPackage(pkg)}
                className="relative h-60 overflow-hidden bg-slate-100 cursor-pointer"
              >
                <img
                  src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'}
                  alt={pkg.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Destination Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-[#0A192F] backdrop-blur-xs shadow-xs">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>{pkg.destination}</span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0A192F]/90 text-slate-100 backdrop-blur-xs">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{pkg.duration}</span>
                </div>

                {/* Offer Badge (Matches screenshot '35% SPECIAL OFF') */}
                {(pkg.offerBadge || pkg.id.includes('kashmir')) && (
                  <div className="absolute bottom-3 right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[10px] sm:text-[11px] px-3 py-1 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1 border border-orange-300/40">
                    <Sparkles className="w-3 h-3 text-amber-100" />
                    <span>{pkg.offerBadge || '35% SPECIAL OFF'}</span>
                  </div>
                )}
              </div>

              {/* Package Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => onSelectPackage(pkg)}
                    className="font-display text-lg sm:text-xl font-bold text-[#0A192F] group-hover:text-amber-700 transition cursor-pointer line-clamp-1"
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
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
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
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Starting Price
                    </span>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2 justify-end">
                        {pkg.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {config.currencySymbol}{pkg.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-lg font-bold text-[#0A192F]">
                          {config.currencySymbol}{pkg.startingPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">/ person (demo rate)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-center cursor-pointer"
                    >
                      View Trip
                    </button>
                    <button
                      onClick={() => openEnquiryModal({
                        destinationName: pkg.destination,
                        packageId: pkg.id,
                        packageTitle: pkg.title,
                      })}
                      className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition text-center cursor-pointer shadow-xs"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
