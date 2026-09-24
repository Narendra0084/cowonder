import React from 'react';
import { MessageCircle, Briefcase, Sparkles, PhoneCall } from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';

export const FloatingActionPills: React.FC = () => {
  const { openPlanTripPopup, getWhatsAppUrl, getPhoneUrl } = useAgency();

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2.5 items-end select-none">
      
      {/* Green WhatsApp 'ASK ME' Pill */}
      <a
        href={getWhatsAppUrl("Hello Co Wonder, I want to ask a question about trip packages and offers.")}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs pl-3 pr-3.5 py-2.5 rounded-l-full shadow-xl hover:shadow-2xl transition-all duration-200 translate-x-1 hover:translate-x-0"
        title="Chat with Travel Expert on WhatsApp"
      >
        <span className="mr-1.5 tracking-wider uppercase text-[11px] font-extrabold">ASK ME</span>
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
        </div>
      </a>

      {/* Orange 'PLAN TRIP / SPECIAL OFFERS' Pill */}
      <button
        onClick={() => openPlanTripPopup()}
        className="group flex items-center bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs pl-3 pr-3.5 py-2.5 rounded-l-full shadow-xl hover:shadow-2xl transition-all duration-200 translate-x-1 hover:translate-x-0 cursor-pointer"
        title="Plan Your Perfect Trip - Free Itinerary"
      >
        <span className="mr-1.5 tracking-wider uppercase text-[11px] font-extrabold">PLAN TRIP</span>
        <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </button>

    </div>
  );
};
