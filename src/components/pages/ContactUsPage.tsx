import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2,
  Loader2 
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { submitEnquiry } from '../../services/dbService';
import { INITIAL_OFFICE_UNITS } from '../../data/seedData';

export const ContactUsPage: React.FC = () => {
  const { config, getWhatsAppUrl, getPhoneUrl, addToast, openUnitsModal } = useAgency();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      addToast('Please fill in required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const enq = await submitEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        destinationId: 'custom-contact',
        destinationName: subject || 'General Travel Consultation',
        travelDate: new Date().toISOString().split('T')[0],
        adults: 2,
        children: 0,
        budget: 'Flexible',
        message: message.trim(),
        source: 'website',
      });

      setSubmittedRef(enq.referenceId);
      addToast('Message received! Our team will contact you shortly.', 'success');
    } catch (e: any) {
      console.error(e);
      addToast('Failed to send message. Please reach us via WhatsApp or Phone.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
            Get In Touch
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] mt-1">
            Contact Our Travel Desk
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Speak directly with experienced holiday consultants. We are here to answer your questions and personalize your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Column (2 Cols): Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
              <h3 className="font-display text-lg font-bold text-[#0A192F]">
                Co Wonder Headquarters
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Office Address</strong>
                    <p>{config.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Business Hours</strong>
                    <p>{config.operatingHours}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Emergency desk 24/7 for active travelers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Direct Phone Line</strong>
                    <p>{config.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Official Email</strong>
                    <p>{config.email}</p>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Start WhatsApp Conversation</span>
                </a>

                <a
                  href={getPhoneUrl()}
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>Call {config.phone}</span>
                </a>
              </div>
            </div>

            {/* Reassurance */}
            <div className="bg-[#0A192F] text-white rounded-xl p-5 text-xs space-y-2">
              <strong className="text-amber-400 block font-sans">Prompt Response Guarantee</strong>
              <p className="text-slate-300 leading-relaxed">
                All written enquiries receive a response within 2 business hours during working days with transparent pricing and itinerary options.
              </p>
            </div>

          </div>

          {/* Right Column (3 Cols): Interactive Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              
              {submittedRef ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#0A192F]">
                    Thank You For Reaching Out
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Your message has been assigned Enquiry ID <strong className="text-slate-900 font-mono">{submittedRef}</strong>. Our senior consultant will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedRef(null);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <h3 className="font-display text-lg font-bold text-[#0A192F] mb-2">
                    Send Us A Direct Message
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ananya Roy"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Topic / Destination Of Interest
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Kashmir Family Tour, Bali Honeymoon..."
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Message or Travel Query <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please let us know your planned travel dates, number of people, preferred hotel standards, and any special questions..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-4 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] disabled:opacity-75 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Send Travel Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* Physical Office Units & Capital Desks Showcase */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
              National Presence
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A192F] mt-1">
              Our Capital Units & Branch Desks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Tap any location to explore its dedicated unit screen, consultant in charge, and book a free in-person consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INITIAL_OFFICE_UNITS.map((unit) => (
              <div
                key={unit.id}
                onClick={() => openUnitsModal(unit.id)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div className="h-36 relative overflow-hidden bg-slate-100">
                  <img
                    src={unit.image}
                    alt={unit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-600 text-white shadow-xs">
                      {unit.type}
                    </span>
                    {unit.isCapital && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-white/95 text-slate-900 shadow-xs">
                        Capital Hub
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="font-display text-base font-bold text-white group-hover:text-amber-300 transition">
                      {unit.name}
                    </h4>
                    <span className="text-[11px] text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{unit.city}, {unit.state}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 text-xs space-y-2">
                  <p className="text-[11px] text-slate-600">
                    📍 <strong className="text-slate-800">Landmark:</strong> {unit.landmark}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    🕒 {unit.operatingHours}
                  </p>
                  
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-orange-600 font-bold text-[11px]">
                    <span>View Unit Screen & Book Visit</span>
                    <span className="group-hover:translate-x-1 transition">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
