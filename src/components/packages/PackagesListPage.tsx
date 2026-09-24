import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Filter, ArrowRight, X } from 'lucide-react';
import { TourPackage, Destination } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface PackagesListPageProps {
  packages: TourPackage[];
  destinations: Destination[];
  initialDestinationFilter?: string;
  onSelectPackage: (pkg: TourPackage) => void;
}

export const PackagesListPage: React.FC<PackagesListPageProps> = ({
  packages,
  destinations,
  initialDestinationFilter,
  onSelectPackage,
}) => {
  const { config, openEnquiryModal } = useAgency();

  const [selectedDestination, setSelectedDestination] = useState<string>(initialDestinationFilter || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc'>('featured');

  const publishedPackages = useMemo(() => {
    return packages.filter((p) => p.status === 'published');
  }, [packages]);

  const filteredPackages = useMemo(() => {
    return publishedPackages
      .filter((pkg) => {
        // Destination filter
        if (selectedDestination !== 'All') {
          const match = 
            pkg.destination.toLowerCase() === selectedDestination.toLowerCase() ||
            pkg.destinationId?.toLowerCase() === selectedDestination.toLowerCase();
          if (!match) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = pkg.title.toLowerCase().includes(query);
          const matchDest = pkg.destination.toLowerCase().includes(query);
          const matchDesc = pkg.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDest && !matchDesc) return false;
        }

        // Budget Filter
        if (budgetFilter === 'under25') {
          if (pkg.startingPrice > 25000) return false;
        } else if (budgetFilter === '25to50') {
          if (pkg.startingPrice < 25000 || pkg.startingPrice > 50000) return false;
        } else if (budgetFilter === 'above50') {
          if (pkg.startingPrice < 50000) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.startingPrice - b.startingPrice;
        if (sortBy === 'priceDesc') return b.startingPrice - a.startingPrice;
        // Default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [publishedPackages, selectedDestination, searchQuery, budgetFilter, sortBy]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
            Handcrafted Tours
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] mt-1">
            Explore All Holiday Packages
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Choose from carefully curated domestic and international itineraries. All packages include verified hotels, private transportation, and full customization options.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search packages, destinations, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Budget Range Filter */}
            <div>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
              >
                <option value="all">All Budgets</option>
                <option value="under25">Under {config.currencySymbol}25,000</option>
                <option value="25to50">{config.currencySymbol}25,000 - {config.currencySymbol}50,000</option>
                <option value="above50">Above {config.currencySymbol}50,000</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
              >
                <option value="featured">Featured First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Quick Destination Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Destinations:</span>
            </span>

            <button
              onClick={() => setSelectedDestination('All')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedDestination === 'All'
                  ? 'bg-[#0A192F] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({publishedPackages.length})
            </button>

            {destinations.map((d) => {
              const count = publishedPackages.filter(
                (p) => p.destination.toLowerCase() === d.name.toLowerCase()
              ).length;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDestination(d.name)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    selectedDestination.toLowerCase() === d.name.toLowerCase()
                      ? 'bg-[#0A192F] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.name} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <span>Showing {filteredPackages.length} of {publishedPackages.length} packages</span>
          {(selectedDestination !== 'All' || searchQuery || budgetFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedDestination('All');
                setSearchQuery('');
                setBudgetFilter('all');
              }}
              className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
            <h3 className="font-display text-lg font-bold text-[#0A192F] mb-2">
              No matching packages found
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              We customize holidays for any destination. Share your travel ideas and our consultant will create a bespoke package for you.
            </p>
            <button
              onClick={() => openEnquiryModal({ destinationName: selectedDestination !== 'All' ? selectedDestination : undefined })}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition"
            >
              Request Custom Itinerary
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div 
                  onClick={() => onSelectPackage(pkg)}
                  className="relative h-56 overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'}
                    alt={pkg.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-[#0A192F] backdrop-blur-xs shadow-xs">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    <span>{pkg.destination}</span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0A192F]/90 text-slate-100 backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => onSelectPackage(pkg)}
                      className="font-display text-lg font-bold text-[#0A192F] group-hover:text-amber-700 transition cursor-pointer line-clamp-1"
                    >
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Starting from
                      </span>
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-bold text-[#0A192F]">
                          {config.currencySymbol}{pkg.startingPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 block">/ person</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-center cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openEnquiryModal({
                          destinationName: pkg.destination,
                          packageId: pkg.id,
                          packageTitle: pkg.title,
                        })}
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition text-center cursor-pointer shadow-xs"
                      >
                        Get Quote
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
