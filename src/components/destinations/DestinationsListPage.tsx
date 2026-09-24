import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Destination } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface DestinationsListPageProps {
  destinations: Destination[];
  onSelectDestination: (destName: string) => void;
}

export const DestinationsListPage: React.FC<DestinationsListPageProps> = ({
  destinations,
  onSelectDestination,
}) => {
  const { config, openEnquiryModal } = useAgency();
  const [regionFilter, setRegionFilter] = useState<'All' | 'Domestic' | 'International'>('All');

  const filtered = destinations.filter((d) => {
    if (regionFilter === 'All') return true;
    return d.region === regionFilter;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
            Inspiring Destinations
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] mt-1">
            Where Do You Want To Go?
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            From the Himalayan valleys of Kashmir and heritage citadels of Rajasthan to the tropical shores of Bali and modern skyline of Dubai.
          </p>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 mt-6">
            {(['All', 'Domestic', 'International'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRegionFilter(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  regionFilter === tab
                    ? 'bg-[#0A192F] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab === 'All' ? 'All Regions' : `${tab} Tours`}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.name)}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs">
                  {dest.region}
                </span>

                {dest.startingPrice > 0 && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#0A192F]/90 text-amber-300 text-xs font-semibold backdrop-blur-xs">
                    Starting from {config.currencySymbol}{dest.startingPrice.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{dest.region} Holiday</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#0A192F] group-hover:text-amber-700 transition">
                    {dest.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>

                  {dest.highlights && dest.highlights.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                        Key Attractions
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {dest.highlights.slice(0, 3).map((hl, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0A192F] group-hover:text-amber-600 transition">
                  <span>Explore {dest.name} Packages</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom destination banner */}
        <div className="mt-12 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display text-xl font-bold text-[#0A192F]">
              Looking for a destination not listed?
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              We design tailor-made trips across India and over 40 global countries with bespoke hotel contracts and verified driver networks.
            </p>
          </div>

          <button
            onClick={() => openEnquiryModal()}
            className="px-6 py-3 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition shrink-0 cursor-pointer"
          >
            Custom Trip Enquiry
          </button>
        </div>

      </div>
    </div>
  );
};
