import React from 'react';
import { MessageCircle, Phone, Send, Building2 } from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';

export const MobileStickyBar: React.FC = () => {
  const { openPlanTripPopup, openUnitsModal, getWhatsAppUrl, getPhoneUrl } = useAgency();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        
        {/* WhatsApp */}
        <a
          href={getWhatsAppUrl('Hello An Wonder Co, I would like to enquire about holiday packages.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 active:scale-95 transition"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[10px] font-semibold leading-tight">WhatsApp</span>
        </a>

        {/* Call */}
        <a
          href={getPhoneUrl()}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 active:scale-95 transition"
        >
          <Phone className="w-4 h-4 text-slate-700 mb-0.5" />
          <span className="text-[10px] font-semibold leading-tight">Call</span>
        </a>

        {/* Explore Units & Capital Visits */}
        <button
          onClick={() => openUnitsModal()}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-orange-50 text-orange-800 border border-orange-200 active:scale-95 transition cursor-pointer"
        >
          <Building2 className="w-4 h-4 text-orange-600 mb-0.5" />
          <span className="text-[10px] font-semibold leading-tight">Units</span>
        </button>

        {/* Plan Trip */}
        <button
          onClick={() => openPlanTripPopup()}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-[#0A192F] text-amber-300 shadow-xs active:scale-95 transition cursor-pointer"
        >
          <Send className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-[10px] font-semibold leading-tight text-white">Plan Trip</span>
        </button>

      </div>
    </div>
  );
};

