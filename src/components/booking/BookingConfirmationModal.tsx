import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Users, 
  MapPin, 
  Printer, 
  MessageCircle, 
  Phone, 
  Copy, 
  Check, 
  Compass,
  FileCheck2,
  Download
} from 'lucide-react';
import { Booking } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  onClose,
}) => {
  const { config, getWhatsAppUrl, getPhoneUrl, addToast } = useAgency();
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Booking reference copied to clipboard', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsAppText = `Hello Co Wonder, my booking is confirmed under Reference ${booking.bookingReference} for ${booking.packageTitle}. Looking forward to the trip!`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="bg-[#0A192F] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#0A192F] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white tracking-wide">
                Co Wonder Official Voucher
              </h3>

              <p className="text-[11px] text-slate-300">
                Payment verified & itinerary reservation confirmed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Content for Print and Display */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto print:p-0 print:m-0">
          
          {/* Success Banner */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0A192F]">
              Booking Confirmed
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Thank you, <strong className="text-slate-900">{booking.customerName}</strong>. Your trip is officially confirmed and registered with our operations desk.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between max-w-md mx-auto">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Booking Reference ID
              </span>
              <span className="font-mono text-xl font-bold text-[#0A192F]">
                {booking.bookingReference}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Ref'}</span>
            </button>
          </div>

          {/* Summary Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100/70 px-4 py-2.5 font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200">
              Trip & Reservation Summary
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Package Title</span>
                <strong className="text-slate-900 text-right">{booking.packageTitle}</strong>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Destination</span>
                <strong className="text-slate-900">{booking.destinationName}</strong>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Travel Start Date</span>
                <strong className="text-slate-900">{booking.travelDate}</strong>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Travelers</span>
                <strong className="text-slate-900">
                  {booking.adults} Adults {booking.children > 0 && `, ${booking.children} Children`}
                </strong>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Amount Paid</span>
                <strong className="text-emerald-700 font-bold text-sm">
                  {config.currencySymbol}{booking.amount.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono text-slate-600">{booking.paymentId}</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Customer Contact</span>
                <span className="text-slate-800">{booking.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Agency Emergency Contact Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-1.5 text-amber-950">
            <h4 className="font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>Dedicated 24/7 Operations Desk</span>
            </h4>
            <p className="leading-relaxed">
              Your personal trip manager will reach out via WhatsApp 48 hours prior to departure with driver name, vehicle number, and hotel voucher coordinates.
            </p>
            <p className="font-medium pt-1">
              Direct Agency Hotline: <strong>{config.phone}</strong> • Email: <strong>{config.email}</strong>
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl(whatsAppText)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-xs text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat With Your Trip Coordinator</span>
              </a>

              <button
                onClick={handlePrint}
                className="py-3 px-5 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Voucher</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Close & Return to Website
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
