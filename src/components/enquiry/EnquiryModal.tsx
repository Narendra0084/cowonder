import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { Destination, TourPackage } from '../../types';
import { getDestinations, getPackages, submitEnquiry } from '../../services/dbService';

export const EnquiryModal: React.FC = () => {
  const { 
    isEnquiryModalOpen, 
    closeEnquiryModal, 
    enquiryPrefill, 
    config, 
    getWhatsAppUrl, 
    getPhoneUrl,
    addToast 
  } = useAgency();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  
  // Fields mandated: Name, WhatsApp Number, Destination, Travel Date, Number of Travellers, Message
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellers, setTravellers] = useState<number>(2);
  const [message, setMessage] = useState('');

  // States: validation, loading, success, error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEnquiry, setSubmittedEnquiry] = useState<{
    referenceId: string;
    destination: string;
    travelDate: string;
    travellers: number;
  } | null>(null);

  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    if (isEnquiryModalOpen) {
      getDestinations().then(setDestinations);
      getPackages().then(setPackages);

      if (enquiryPrefill?.destinationName) {
        setDestination(enquiryPrefill.destinationName);
      }
      setErrorMessage('');
    } else {
      setSubmittedEnquiry(null);
      setIsSubmitting(false);
      setErrorMessage('');
    }
  }, [isEnquiryModalOpen, enquiryPrefill]);

  if (!isEnquiryModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.trim().length < 8) {
      setErrorMessage('Please enter a valid WhatsApp phone number.');
      return;
    }
    if (!destination.trim()) {
      setErrorMessage('Please select a destination.');
      return;
    }
    if (!travelDate) {
      setErrorMessage('Please choose your intended travel date.');
      return;
    }
    if (!travellers || travellers < 1) {
      setErrorMessage('Please specify at least 1 traveller.');
      return;
    }

    setIsSubmitting(true);
    try {
      const enq = await submitEnquiry({
        name: name.trim(),
        phone: whatsappNumber.trim(),
        destinationId: destination.toLowerCase().replace(/\s+/g, '-'),
        destinationName: destination,
        travelDate,
        adults: travellers,
        children: 0,
        message: message.trim() || undefined,
        source: 'website',
      });

      setSubmittedEnquiry({
        referenceId: enq.referenceId,
        destination,
        travelDate,
        travellers,
      });

      addToast('Travel enquiry received successfully.', 'success');
    } catch (err: any) {
      console.error('Error submitting enquiry:', err);
      setErrorMessage('Could not send enquiry right now. Please connect via WhatsApp or Phone directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Automated WhatsApp Message as specified:
  // "Hello, I have submitted a travel enquiry.
  //
  // Enquiry ID: TRV-10248
  // Destination: Kashmir
  // Travel Date: 15 October
  // Travellers: 2
  //
  // I would like to discuss the package."
  const getAutomatedWhatsAppMessage = () => {
    if (!submittedEnquiry) return '';
    return `Hello, I have submitted a travel enquiry.\n\nEnquiry ID: ${submittedEnquiry.referenceId}\nDestination: ${submittedEnquiry.destination}\nTravel Date: ${submittedEnquiry.travelDate}\nTravellers: ${submittedEnquiry.travellers}\n\nI would like to discuss the package.`;
  };

  const handleCopyRef = () => {
    if (submittedEnquiry) {
      navigator.clipboard.writeText(submittedEnquiry.referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
      addToast('Enquiry number copied', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Mandated exact title */}
        <div className="bg-[#0A192F] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-white">
              {submittedEnquiry ? 'ENQUIRY RECEIVED' : "LET'S PLAN YOUR TRIP."}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {submittedEnquiry 
                ? 'Your enquiry has been logged with our travel desk.' 
                : 'Direct assistance with transparent, tailor-made itineraries.'
              }
            </p>
          </div>
          <button
            onClick={closeEnquiryModal}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submittedEnquiry ? (
            /* SUCCESS STATE */
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-xl font-bold text-[#0A192F]">
                  ENQUIRY RECEIVED
                </h4>
                <p className="text-xs text-slate-600">
                  Your enquiry has been assigned an official reference number:
                </p>
              </div>

              {/* Enquiry Number Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between max-w-sm mx-auto">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Your enquiry number:
                  </span>
                  <span className="font-mono text-xl font-bold text-[#0A192F]">
                    {submittedEnquiry.referenceId}
                  </span>
                </div>
                <button
                  onClick={handleCopyRef}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Mandated Action Buttons: Continue on WhatsApp | Call Us */}
              <div className="pt-2 space-y-2.5 max-w-sm mx-auto">
                <a
                  href={getWhatsAppUrl(getAutomatedWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Continue on WhatsApp</span>
                </a>

                <a
                  href={getPhoneUrl()}
                  className="w-full py-3 px-4 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>Call Us ({config.phone})</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={closeEnquiryModal}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Done & Back to Website
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Error Alert State */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                />
              </div>

              {/* Destination & Travel Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Destination <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                  >
                    <option value="">Select Destination</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                    <option value="Other / Multi-city">Other / Multi-city</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Travel Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                  />
                </div>
              </div>

              {/* Number of Travellers */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Number of Travellers <span className="text-rose-500">*</span>
                </label>
                <select
                  value={travellers}
                  onChange={(e) => setTravellers(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Traveller (Solo)' : 'Travellers'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Message <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us any specific requirements: hotel category, flight booking, dietary choices, or pace of travel..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                />
              </div>

              {/* Button: SEND ENQUIRY */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] disabled:opacity-75 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>SEND ENQUIRY</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
