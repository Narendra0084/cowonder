import React from 'react';
import { ArrowRight, MapPin, Compass } from 'lucide-react';
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

  // Show top destinations
  const displayDestinations = [...destinations]
    .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
    .slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title - Exact wording as specified */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
              Curated Destinations
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A192F] mt-1 tracking-tight">
              WHERE DO YOU WANT TO GO?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              "Choose a destination and let's plan the journey."
            </p>
          </div>

          <button
            onClick={onViewAllDestinations}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0A192F] hover:text-amber-600 transition cursor-pointer self-start md:self-end"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid of Destination Cards with Subtle 3D Hover Movement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 [perspective:1000px]">
          {displayDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.name)}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5 hover:rotate-x-1"
            >
              {/* Image Container */}
              <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Region Tag */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs">
                  {dest.region}
                </span>

                {/* Starting Price Tag */}
                {dest.startingPrice > 0 && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#0A192F]/90 text-amber-300 text-xs font-semibold backdrop-blur-xs">
                    Starting from {config.currencySymbol}{dest.startingPrice.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{dest.region} Travel</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0A192F] group-hover:text-amber-700 transition">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                {/* Explore Button */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0A192F] group-hover:text-amber-600 transition">
                  <span className="px-3 py-1.5 rounded-md bg-slate-100 group-hover:bg-amber-400 group-hover:text-[#0A192F] transition">
                    Explore
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
