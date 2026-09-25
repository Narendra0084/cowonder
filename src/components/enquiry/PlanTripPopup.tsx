import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Users, 
  Compass, 
  CheckCircle2, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  MapPin,
  Calendar,
  Building2
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { apiClient } from '../../services/apiClient';
import { INITIAL_OFFICE_UNITS } from '../../data/seedData';
import { OfficeUnit } from '../../types';

const TOUR_TYPES = [
  'Group Tour',
  'Honeymoon / Couple',
  'Family Vacation',
  'Solo Adventure',
  'Weekend Getaway',
  'Corporate / Friends Outing'
];

export const PlanTripPopup: React.FC = () => {
  const { 
    isPlanTripPopupOpen, 
    openPlanTripPopup, 
    closePlanTripPopup, 
    openUnitsModal,
    config, 
    getWhatsAppUrl, 
    getPhoneUrl,
    addToast 
  } = useAgency();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [travellers, setTravellers] = useState('2 Travellers');
  const [tourType, setTourType] = useState('Group Tour');
  const [wantsOfficeVisit, setWantsOfficeVisit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<OfficeUnit>(INITIAL_OFFICE_UNITS[0]);
  const [preferredDestination, setPreferredDestination] = useState('Kashmir');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Auto-show popup on every reload
  useEffect(() => {
    const timer = setTimeout(() => {
      openPlanTripPopup();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    closePlanTripPopup();
    setErrorMsg('');
    setSubmittedRef(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid phone/WhatsApp number');
      return;
    }

    setIsSubmitting(true);
    try {
      // Parse travellers count
      const numTravellers = parseInt(travellers) || 2;
      const travelDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Send to server REST API
      const result = await apiClient.createEnquiry({
        name: fullName.trim(),
        phone: phoneNumber.trim(),
        destination: preferredDestination,
        travelDate,
        travellers: numTravellers,
        message: `Plan Your Trip Request: Tour Type: ${tourType}. Office Consultation: ${wantsOfficeVisit ? `Yes, at ${selectedUnit.name} (${selectedUnit.city})` : 'No, online/call only'}.`,
      });

      const refId = result?.enquiry?.referenceId || `TRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(refId);
      addToast('Your trip plan request has been received!', 'success');
    } catch (err: any) {
      console.error('Popup submission error:', err);
      // Fallback generate friendly ref if server offline
      const fallbackRef = `TRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(fallbackRef);
      addToast('Request noted! Connect directly on WhatsApp.', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCustomWhatsAppText = () => {
    return `Hello ${config.agencyName}, I just submitted the "Plan Your Perfect Trip" form.\n\nEnquiry ID: ${submittedRef}\nName: ${fullName}\nTour Type: ${tourType}\nTravellers: ${travellers}\nOffice Consultation: ${wantsOfficeVisit ? `Yes, at ${selectedUnit.name} (${selectedUnit.city})` : 'No'}\n\nPlease share the customized itinerary with the best offer prices.`;
  };

  const handleCopyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
      addToast('Reference ID copied to clipboard', 'info');
    }
  };

  if (!isPlanTripPopupOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200/80 flex flex-col md:flex-row">
        
        {/* Close Button in Circular Pill */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Visual Traveler with Suitcase & Offer Badges (matches screenshot) */}
        <div className="md:w-5/12 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white min-h-[220px] md:min-h-[540px]">
          
          {/* Subtle background waves & glow */}
          <div className="absolute inset-0 bg-radial at-center from-white/15 to-transparent pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-black/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Season Special • Up to 35% Off</span>
            </div>
          </div>

          {/* Central Traveler Illustration / Photography */}
          <div className="relative z-10 flex flex-col items-center my-auto py-4">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=600&q=80"
                alt="Traveler with suitcase exploring dream destinations"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 via-transparent to-transparent" />
            </div>

            {/* Floating Offer Pill Badge */}
            <div className="absolute -bottom-2 bg-white text-[#0A192F] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-orange-200 flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>35% Special Off • Best Fit</span>
            </div>
          </div>

          {/* Bottom Trust Indicators on Left Column */}
          <div className="relative z-10 pt-4 border-t border-white/20 text-xs space-y-1 text-amber-50">
            <p className="font-semibold text-white">✨ Tailor-Made Itineraries</p>
            <p className="text-[11px] text-white/80">Chauffeured private cabs & verified 4-star stays across India and International routes.</p>
          </div>

        </div>

        {/* RIGHT COLUMN: Form & Content */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-center bg-white relative">
          
          {submittedRef ? (
            /* SUCCESS STATE */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-bold text-orange-600">
                  Request Logged
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0A192F]">
                  Plan In Progress!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong className="text-slate-900">{fullName}</strong>. Our senior travel consultant is preparing your free customized plan with the best discounts.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-4 max-w-sm mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-orange-700 tracking-wider block">
                    Your Trip Reference ID:
                  </span>
                  <span className="font-mono text-xl font-bold text-[#0A192F]">
                    {submittedRef}
                  </span>
                </div>
                <button
                  onClick={handleCopyRef}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Direct Actions */}
              <div className="pt-2 space-y-2.5 max-w-sm mx-auto">
                <a
                  href={getWhatsAppUrl(getCustomWhatsAppText())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Continue on WhatsApp with Expert</span>
                </a>

                <a
                  href={getPhoneUrl()}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>Call Travel Desk ({config.phone})</span>
                </a>

                <button
                  onClick={handleClose}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer pt-2 block mx-auto"
                >
                  Close and Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE (Direct replication of image.png) */
            <div>
              
              {/* Agency Logo & Subtitle */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-[#0A192F] text-amber-400 flex items-center justify-center font-bold shadow-xs">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-brand text-lg font-bold tracking-wider text-[#0A192F] block leading-none">
                      AN WONDER CO
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold block">
                      TRAVEL & EXPEDITIONS
                    </span>
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight mt-1">
                  Plan Your Perfect Trip
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Get a <span className="text-orange-600 font-bold uppercase">FREE</span> personalized itinerary with the best prices from our travel experts
                </p>
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* 2x2 Grid for Desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter Your Name"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter Phone Number"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Number of Travellers */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Number of Travellers <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <select
                        value={travellers}
                        onChange={(e) => setTravellers(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50/50 cursor-pointer"
                      >
                        <option value="1 Traveller (Solo)">1 Traveller (Solo)</option>
                        <option value="2 Travellers (Couple / Friends)">2 Travellers (Couple / Friends)</option>
                        <option value="3 - 4 Travellers (Family)">3 - 4 Travellers (Family)</option>
                        <option value="5 - 8 Travellers (Group)">5 - 8 Travellers (Group)</option>
                        <option value="9+ Travellers (Large Group)">9+ Travellers (Large Group)</option>
                      </select>
                    </div>
                  </div>

                  {/* Tour Type */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tour Type <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Compass className="w-4 h-4" />
                      </div>
                      <select
                        value={tourType}
                        onChange={(e) => setTourType(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50/50 cursor-pointer"
                      >
                        {TOUR_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                {/* Preferred Destination quick selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Where would you like to travel?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Kashmir', 'Dubai', 'Bali', 'Kerala', 'Rajasthan', 'Goa'].map((dest) => (
                      <button
                        type="button"
                        key={dest}
                        onClick={() => setPreferredDestination(dest)}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                          preferredDestination === dest
                            ? 'bg-orange-600 text-white font-semibold shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Office Visit Toggle Switch (Exact feature in screenshot) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-left pr-3">
                      <span className="text-xs font-semibold text-slate-800 block">
                        I would like to visit your office
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Schedule a free consultation at our nearest branch
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={wantsOfficeVisit}
                      onClick={() => setWantsOfficeVisit(!wantsOfficeVisit)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        wantsOfficeVisit ? 'bg-orange-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          wantsOfficeVisit ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Expanded Interactive Unit Explorer when visit is toggled on */}
                  {wantsOfficeVisit && (
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-orange-600" />
                          <span>Select Visit Unit / Capital Hub:</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => openUnitsModal(selectedUnit.id)}
                          className="text-[10px] font-bold text-orange-700 hover:text-orange-800 underline cursor-pointer"
                        >
                          View Unit Screen & Maps
                        </button>
                      </div>

                      {/* Horizontal chips of units for fast mobile tapping */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {INITIAL_OFFICE_UNITS.map((u) => {
                          const isSelected = selectedUnit.id === u.id;
                          return (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => setSelectedUnit(u)}
                              className={`p-1.5 text-left rounded-lg text-[10px] transition cursor-pointer border ${
                                isSelected
                                  ? 'bg-orange-600 text-white font-bold border-orange-600 shadow-xs'
                                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              <div className="truncate font-semibold">{u.city}</div>
                              <div className={`text-[9px] truncate ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                                {u.type}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Unit Details Banner with tap action */}
                      <div 
                        onClick={() => openUnitsModal(selectedUnit.id)}
                        className="bg-white p-2.5 rounded-lg border border-amber-200/90 text-[11px] flex items-center justify-between cursor-pointer hover:bg-amber-50/40 transition shadow-2xs"
                        title="Click to view full screen"
                      >
                        <div className="pr-2">
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <span>{selectedUnit.name}</span>
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-semibold">{selectedUnit.city}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[240px]">
                            {selectedUnit.landmark} • {selectedUnit.operatingHours.split('(')[0]}
                          </div>
                        </div>

                        <span className="shrink-0 px-2 py-1 rounded bg-orange-100 text-orange-800 font-bold text-[10px] hover:bg-orange-200 transition">
                          Open Screen →
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main CTA Button: Contact Our Travel Expert */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-75 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <span>Contact Our Travel Expert</span>
                    )}
                  </button>
                </div>

                {/* Trust Footer Signals (Matching screenshot) */}
                <div className="text-center pt-2 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
                    <span>100% Secure</span>
                    <span>•</span>
                    <span>Data Privacy Guaranteed</span>
                    <span>•</span>
                    <span>Travel with Confidence</span>
                  </div>
                  <p className="text-[9px] text-slate-400">
                    By submitting, you agree to our <a href="#privacy" className="underline hover:text-slate-600">Privacy Policy</a> and <a href="#terms" className="underline hover:text-slate-600">Terms of Service</a>
                  </p>
                </div>

              </form>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
