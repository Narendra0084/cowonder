import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Check, 
  X, 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Send, 
  Hotel, 
  Car, 
  Utensils, 
  Binoculars, 
  Info, 
  Calendar,
  Share2,
  ChevronDown
} from 'lucide-react';
import { TourPackage } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface PackageDetailPageProps {
  packageData: TourPackage;
  onBack: () => void;
}

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({ packageData, onBack }) => {
  const { config, openEnquiryModal, getWhatsAppUrl, getPhoneUrl, addToast } = useAgency();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const images = packageData.images && packageData.images.length > 0 
    ? packageData.images 
    : ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageData.title,
        text: `Check out ${packageData.title} by Co Wonder`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard', 'info');
    }
  };

  const whatsAppText = `Hello Co Wonder, I am interested in the "${packageData.title}" package (${packageData.duration}). Please share detailed availability and quotation.`;


  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Top breadcrumb & back button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0A192F] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Packages</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Title Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-[#0A192F] border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{packageData.destination}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{packageData.duration}</span>
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">
              Verified Private Itinerary
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A192F] leading-tight">
            {packageData.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-4xl">
            {packageData.description}
          </p>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Main Large Image */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden h-[340px] sm:h-[440px] bg-slate-200 shadow-xs relative">
            <img
              src={images[activeImageIndex]}
              alt={packageData.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative rounded-lg overflow-hidden h-24 lg:h-32 w-32 lg:w-full shrink-0 border-2 transition cursor-pointer ${
                  activeImageIndex === idx ? 'border-amber-500 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Details + Sticky CTA Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Overview, Itinerary, Info, Inclusions */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0A192F] mb-4">
                Overview & Trip Character
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {packageData.overview}
              </p>

              {/* Highlights bullets */}
              {packageData.highlights && packageData.highlights.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-amber-700 mb-3">
                    Key Journey Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {packageData.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Package Information Breakdown */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0A192F] mb-6">
                Package Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Hotels */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0A192F] uppercase tracking-wider">Accommodation</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {packageData.hotels || 'Handpicked verified 3 to 5-star properties on double sharing basis.'}
                    </p>
                  </div>
                </div>

                {/* Transportation */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0A192F] uppercase tracking-wider">Transportation</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {packageData.transportation || 'Dedicated private sanitized tourist vehicle with vetted chauffeur for all transfers.'}
                    </p>
                  </div>
                </div>

                {/* Meals */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0A192F] uppercase tracking-wider">Meals</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {packageData.meals || 'Daily hot breakfast included at hotels, plus chef meals on houseboat/safaris where noted.'}
                    </p>
                  </div>
                </div>

                {/* Sightseeing & Activities */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                    <Binoculars className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0A192F] uppercase tracking-wider">Sightseeing & Activities</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {packageData.sightseeing || 'All primary sightseeing attractions covered per detailed itinerary.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0A192F] mb-2">
                Day-by-Day Detailed Itinerary
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Click each day to view activities, stay arrangements, and meal plans.
              </p>

              <div className="space-y-4">
                {packageData.itinerary && packageData.itinerary.map((day) => {
                  const isOpen = expandedDay === day.day;
                  return (
                    <div
                      key={day.day}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedDay(isOpen ? null : day.day)}
                        className="w-full text-left p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between gap-4 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#0A192F] text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                            D{day.day}
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                              Day {day.day}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-[#0A192F]">
                              {day.title}
                            </h3>
                          </div>
                        </div>

                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-amber-600' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3 animate-in fade-in duration-150">
                          <p className="leading-relaxed">{day.description}</p>

                          {/* Day specific meta */}
                          <div className="flex flex-wrap gap-4 pt-2 text-xs border-t border-slate-100">
                            {day.stay && (
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Hotel className="w-3.5 h-3.5 text-amber-600" />
                                <span><strong>Stay:</strong> {day.stay}</span>
                              </div>
                            )}
                            {day.meals && (
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                                <span><strong>Meals:</strong> {day.meals}</span>
                              </div>
                            )}
                          </div>

                          {/* Day activities tags */}
                          {day.activities && day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {day.activities.map((act, actIdx) => (
                                <span
                                  key={actIdx}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions & Exclusions Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Inclusions */}
              <div className="bg-white rounded-xl p-6 border border-emerald-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-100">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-emerald-950">
                    What Is Included
                  </h3>
                </div>

                <ul className="space-y-2.5">
                  {packageData.inclusions && packageData.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-xl p-6 border border-rose-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-100">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                    <X className="w-4 h-4 stroke-[3]" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-rose-950">
                    What Is Excluded
                  </h3>
                </div>

                <ul className="space-y-2.5">
                  {packageData.exclusions && packageData.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                      <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Important Information */}
            <div className="bg-amber-50/50 rounded-xl p-6 border border-amber-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="font-display text-lg font-bold text-[#0A192F]">
                  Important Booking & Travel Information
                </h3>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc list-inside">
                {packageData.importantInfo && packageData.importantInfo.map((info, i) => (
                  <li key={i}>{info}</li>
                ))}
                <li>Standard hotel check-in is 2:00 PM and check-out is 11:00 AM across all destinations.</li>
                <li>Custom flight tickets or additional room category upgrades can be quoted on request.</li>
              </ul>
            </div>

          </div>

          {/* Right Column (1 Col): Sticky Booking & Enquiry Action Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-xl p-6 border border-slate-200 shadow-md space-y-6">
              
              {/* Pricing breakdown header */}
              <div className="pb-4 border-b border-slate-100">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Starting Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-[#0A192F]">
                    {config.currencySymbol}{packageData.startingPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500">/ person</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Double sharing basis. Exact quote provided based on travel dates & group size.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                
                {/* Primary CTA: Get a Quote */}
                <button
                  onClick={() => openEnquiryModal({
                    destinationName: packageData.destination,
                    packageId: packageData.id,
                    packageTitle: packageData.title,
                  })}
                  className="w-full py-3.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Get A Free Quote</span>
                </button>

                {/* Secondary CTA: WhatsApp */}
                <a
                  href={getWhatsAppUrl(whatsAppText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Travel Desk</span>
                </a>

                {/* Call Button */}
                <a
                  href={getPhoneUrl()}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call {config.phone}</span>
                </a>

              </div>

              {/* Trust assurances */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Customizable dates & hotels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Transparent itemized quotation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>24/7 dedicated trip coordinator</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
