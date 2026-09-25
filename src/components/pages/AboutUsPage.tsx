import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Users, 
  HeartHandshake,
  Award
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';

export const AboutUsPage: React.FC = () => {
  const { config, openEnquiryModal, getWhatsAppUrl } = useAgency();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
            About An Wonder Co
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A192F] mt-2">
            Crafting Reliable, Transparent Travel Experiences
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
            An Wonder Co was established with a singular objective: to eliminate the uncertainty, inflated middleman pricing, and ambiguous promises that all too often characterize holiday bookings.
          </p>
        </div>

        {/* Story & Philosophy */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-display text-2xl font-bold text-[#0A192F]">
            Our Operating Philosophy
          </h2>
          <p>
            Travel should be an invigorating, seamless adventure — not an endless series of negotiations with aggressive drivers, disappointing hotel rooms, or surprise charges at checkout.
          </p>
          <p>
            At An Wonder Co, every itinerary is planned from the ground up by travel specialists who have personally stayed at our partner hotels and vetted our chauffeur teams. Whether you are traveling for a peaceful honeymoon in Gulmarg, an adventurous desert safari in Jaisalmer, or an international escape to Bali, we provide honest, transparent counsel.
          </p>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0A192F]">Honest Pricing</h3>
              <p className="text-xs text-slate-500 leading-normal">
                No teaser prices that double after you enquire. Full itemized breakdowns with taxes and clear inclusions.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0A192F]">Human Coordination</h3>
              <p className="text-xs text-slate-500 leading-normal">
                No automated bot queues. You speak directly with a dedicated travel advisor before and during your journey.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0A192F]">24/7 On-Ground Care</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Direct emergency support. If a flight delays or an attraction is temporarily closed, we rearrange your plan proactively.
              </p>
            </div>
          </div>
        </div>

        {/* Registered Operations Card */}
        <div className="bg-[#0A192F] text-white rounded-2xl p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
                Official Agency Credentials
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">
                An Wonder Co Travel Desk
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Registered Tour Operator • GST Compliant • Verified Travel Network
              </p>
            </div>

            <button
              onClick={() => openEnquiryModal()}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-[#0A192F] bg-amber-400 hover:bg-amber-300 transition cursor-pointer self-start md:self-center font-sans"
            >
              Consult With Our Desk
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block mb-0.5">Corporate Travel Office</strong>
                <p>{config.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block mb-0.5">Operating Hours</strong>
                <p>{config.operatingHours}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">24/7 on-trip traveler hotline</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block mb-0.5">Contact Channels</strong>
                <p>Phone: {config.phone}</p>
                <p>WhatsApp: {config.whatsapp}</p>
                <p>Email: {config.email}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
