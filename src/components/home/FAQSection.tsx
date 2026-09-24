import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';
import { FAQItem } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const { getWhatsAppUrl, getPhoneUrl } = useAgency();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Packages', 'Booking', 'Payment & Cancellation', 'General'];

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
            Clear Answers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Everything you need to know about our packages, customization, payment terms, and booking process.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0A192F] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left px-5 py-4 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between gap-4 transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm sm:text-base text-[#0A192F]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 py-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 bg-slate-50 rounded-xl p-6 border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-semibold text-sm sm:text-base text-[#0A192F]">
              Have a question not listed here?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Our travel specialists are happy to answer any custom itinerary or policy queries.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={getWhatsAppUrl('Hello Co Wonder, I have a question regarding tour packages.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>WhatsApp Consultant</span>
            </a>
            <a
              href={getPhoneUrl()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-700" />
              <span>Call Us</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
