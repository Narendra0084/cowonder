import React from 'react';
import { 
  MapPin, 
  Layers, 
  Send, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';

export const TrustSection: React.FC = () => {
  const { openEnquiryModal } = useAgency();

  const steps = [
    {
      num: '01',
      title: 'Choose Your Destination',
      description: 'Explore verified domestic or international holiday destinations that match your travel dreams.',
      icon: MapPin,
    },
    {
      num: '02',
      title: 'Select a Package',
      description: 'Review day-by-day itineraries, hotel options, inclusions, and transparent starting rates.',
      icon: Layers,
    },
    {
      num: '03',
      title: 'Send Your Travel Requirements',
      description: 'Share your tentative dates, number of travellers, and any special preferences via our simple form.',
      icon: Send,
    },
    {
      num: '04',
      title: 'Talk With Our Travel Expert',
      description: 'Discuss custom adjustments via WhatsApp or phone. Receive a detailed, formal written quote.',
      icon: PhoneCall,
    },
    {
      num: '05',
      title: 'Confirm Your Trip',
      description: 'Pay a secure advance deposit, receive official vouchers, and travel with 24/7 on-trip support.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
            Transparent Travel Planning
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] mt-1">
            How An Wonder Co Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            No confusion, no hidden charges. A clear, human-guided journey from initial idea to your trip home.
          </p>
        </div>

        {/* 5-Step Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  {/* Top indicator & icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-brand font-bold text-amber-500">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A192F]">
                      <Icon className="w-5 h-5 text-[#0A192F]" />
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#0A192F] mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-amber-700">
                  <span>Step {step.num} of 05</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-xl font-bold text-[#0A192F]">
              Ready to begin planning your next escape?
            </h4>
            <p className="text-xs text-slate-600">
              Submit your enquiry in under a minute or connect directly with our travel desk.
            </p>
          </div>

          <button
            onClick={() => openEnquiryModal()}
            className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Request Itinerary & Quote</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
