import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Building2, 
  User, 
  CheckCircle2, 
  Navigation, 
  Calendar, 
  Coffee, 
  Sparkles, 
  ChevronRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { OfficeUnit } from '../../types';
import { INITIAL_OFFICE_UNITS } from '../../data/seedData';
import { useAgency } from '../../context/AgencyContext';

interface OfficeUnitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUnitId?: string | null;
  onSelectUnit?: (unit: OfficeUnit) => void;
}

export const OfficeUnitsModal: React.FC<OfficeUnitsModalProps> = ({
  isOpen,
  onClose,
  selectedUnitId,
  onSelectUnit
}) => {
  const { getWhatsAppUrl, getPhoneUrl, addToast } = useAgency();
  const [activeUnit, setActiveUnit] = useState<OfficeUnit | null>(() => {
    if (selectedUnitId) {
      return INITIAL_OFFICE_UNITS.find(u => u.id === selectedUnitId) || null;
    }
    return null;
  });

  // Appointment scheduling states
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [visitSlot, setVisitSlot] = useState('11:00 AM – Morning Session');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitPersons, setVisitPersons] = useState('2 Persons');
  const [isBooked, setIsBooked] = useState(false);
  const [bookedReference, setBookedReference] = useState('');

  if (!isOpen) return null;

  const handleSelectUnit = (unit: OfficeUnit) => {
    setActiveUnit(unit);
    setIsBooked(false);
    if (onSelectUnit) onSelectUnit(unit);
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) {
      addToast('Please enter your name and phone number', 'error');
      return;
    }
    const ref = `VISIT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookedReference(ref);
    setIsBooked(true);
    addToast(`Office visit scheduled at ${activeUnit?.name}!`, 'success');
  };

  const handleCloseAll = () => {
    setActiveUnit(null);
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-[#0A192F] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {activeUnit ? (
              <button
                onClick={() => setActiveUnit(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-amber-300 transition flex items-center gap-1 text-xs font-semibold cursor-pointer mr-1"
                title="Back to all units"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">All Units</span>
              </button>
            ) : null}

            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                {activeUnit ? activeUnit.name : 'Explore Our Capital & Branch Units'}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-300">
                {activeUnit ? `${activeUnit.city}, ${activeUnit.state}` : 'Visit our verified travel desks across India for personalized planning'}
              </p>
            </div>
          </div>

          {/* Close Further Process Visits Button */}
          <button
            onClick={handleCloseAll}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* VIEW A: Single Unit Screen ("when we tap on them, it looks like something") */}
          {activeUnit ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Unit Hero Showcase Card */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                <div className="h-44 sm:h-52 w-full relative">
                  <img
                    src={activeUnit.image}
                    alt={activeUnit.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span>{activeUnit.type}</span>
                    </span>
                    {activeUnit.isCapital && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-slate-900 shadow-xs">
                        Capital Visit Hub
                      </span>
                    )}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                      {activeUnit.name}
                    </h2>
                    <p className="text-xs text-amber-300 font-medium flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{activeUnit.city}, {activeUnit.state}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Communication Actions Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <a
                  href={`tel:${activeUnit.phone.replace(/\s+/g, '')}`}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition hover:bg-slate-100"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                  <span>Call Desk</span>
                </a>

                <a
                  href={getWhatsAppUrl(`Hello ${activeUnit.name}, I would like to schedule a visit consultation for holiday packages.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                  <span>WhatsApp Desk</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeUnit.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl bg-[#0A192F] hover:bg-[#132A4A] shadow-xs text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Unit Info Details Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Official Unit Address</strong>
                    <p className="mt-0.5 text-slate-700">{activeUnit.address}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Landmark: {activeUnit.landmark}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Visiting Hours</strong>
                    <p className="mt-0.5 text-slate-700">{activeUnit.operatingHours}</p>
                    <p className="text-[11px] text-emerald-600 font-medium">Walk-ins welcome • Appointments prioritized</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Desk Lead Consultant</strong>
                    <p className="mt-0.5 text-slate-700 font-semibold">{activeUnit.consultant}</p>
                    <p className="text-[11px] text-slate-400">Direct assistance with customized quotes, hotel selection & permits</p>
                  </div>
                </div>

                {/* Amenities / Perks of this Unit */}
                <div className="pt-2 border-t border-slate-100">
                  <strong className="text-slate-900 block text-xs mb-2">Unit Amenities & Facilities:</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeUnit.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Free Visit Scheduling Section */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                {isBooked ? (
                  <div className="text-center py-4 space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <h4 className="font-display text-lg font-bold text-[#0A192F]">
                      Visit Confirmed at {activeUnit.name}!
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Your appointment is booked for <strong className="text-slate-900">{visitDate}</strong> ({visitSlot}). Our consultant <strong className="text-slate-900">{activeUnit.consultant}</strong> will be waiting with refreshments.
                    </p>
                    <div className="inline-block bg-white px-3 py-1.5 rounded-lg border border-amber-300 font-mono text-xs font-bold text-amber-800">
                      Booking Ref: {bookedReference}
                    </div>
                    <div className="pt-2 flex justify-center gap-2">
                      <button
                        onClick={handleCloseAll}
                        className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#0A192F] hover:bg-[#132A4A] transition cursor-pointer"
                      >
                        Done & Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookVisit} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-[#0A192F] flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span>Schedule a Visit to This Unit</span>
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        FREE CONSULTATION
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={visitorPhone}
                          onChange={(e) => setVisitorPhone(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">Visit Date</label>
                        <input
                          type="date"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">Preferred Time Slot</label>
                        <select
                          value={visitSlot}
                          onChange={(e) => setVisitSlot(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                        >
                          <option value="10:30 AM – Morning Session">10:30 AM – Morning Session</option>
                          <option value="02:30 PM – Afternoon Session">02:30 PM – Afternoon Session</option>
                          <option value="05:00 PM – Evening Tea Session">05:00 PM – Evening Tea Session</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Confirm Free Office Appointment</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Bottom Back Button */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={() => setActiveUnit(null)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Explore Other Units</span>
                </button>

                <button
                  onClick={handleCloseAll}
                  className="text-xs text-slate-400 hover:text-slate-700 underline cursor-pointer"
                >
                  Close & Return
                </button>
              </div>

            </div>
          ) : (
            /* VIEW B: Units List on Phone & Desktop ("to explore every unit on the phones") */
            <div className="space-y-4">
              
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  <span>Showing <strong>{INITIAL_OFFICE_UNITS.length} Verified Physical Desks</strong> across India</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  Tap Any Unit to View Details
                </span>
              </div>

              {/* Mobile Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {INITIAL_OFFICE_UNITS.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => handleSelectUnit(unit)}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between active:scale-[0.99]"
                  >
                    {/* Top Image & Badge */}
                    <div className="h-28 relative overflow-hidden bg-slate-100">
                      <img
                        src={unit.image}
                        alt={unit.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-600 text-white shadow-xs">
                          {unit.type}
                        </span>
                        {unit.isCapital && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-white/90 text-slate-900 shadow-xs">
                            Capital
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                        <h4 className="font-display text-sm font-bold text-white group-hover:text-amber-300 transition">
                          {unit.name}
                        </h4>
                        <span className="text-[10px] text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{unit.city}, {unit.state}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 text-xs space-y-2">
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        📍 {unit.landmark}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>🕒 {unit.operatingHours.split('(')[0]}</span>
                        <span className="font-bold text-orange-600 group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                          View Screen <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Close Further Process Action */}
              <div className="pt-3 text-center">
                <button
                  onClick={handleCloseAll}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition cursor-pointer shadow-xs"
                >
                  Close & Continue Browsing Trips
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
