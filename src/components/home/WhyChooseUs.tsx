import React from 'react';
import { 
  FileCheck2, 
  UserCheck, 
  Sliders, 
  Headphones, 
  Hotel, 
  ShieldCheck 
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      title: 'Transparent Package Details',
      description: 'We publish itemized inclusions and exclusions with every tour. You will never encounter hidden checkpoint fees, forced stops, or unexplained hotel surcharges.',
      icon: FileCheck2,
    },
    {
      title: 'Personal Travel Assistance',
      description: 'You are paired with a dedicated travel specialist who understands your preferences, answers your questions promptly, and assists you before and during your journey.',
      icon: UserCheck,
    },
    {
      title: 'Customized Itineraries',
      description: 'No two travelers are identical. We tailor hotel categories, daily pacing, vehicle choices, and sightseeing spots to match your family or group requirements.',
      icon: Sliders,
    },
    {
      title: 'Dedicated Customer Support',
      description: 'Direct phone and WhatsApp access throughout your trip. If your flight is delayed or you need immediate on-ground coordination, our team resolves issues swiftly.',
      icon: Headphones,
    },
    {
      title: 'Inspected Accommodations',
      description: 'We partner directly with verified hotels and boutique heritage properties that maintain stringent hygiene, comfortable bedding, and verified guest feedback.',
      icon: Hotel,
    },
    {
      title: 'Clear Formal Documentation',
      description: 'Written quotes with fixed validity dates, transparent tax breakdowns (GST/TCS), and official booking vouchers provided for every confirmed traveler.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
            Real Values & Standards
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] mt-1">
            Why Choose Co Wonder
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Factual business principles built on transparency, responsive human service, and reliable on-ground execution.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-[#0A192F] text-amber-400 flex items-center justify-center mb-4 shadow-xs">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                <h3 className="font-display text-lg font-bold text-[#0A192F] mb-2">
                  {b.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
