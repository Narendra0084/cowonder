import React from 'react';
import { 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenQuoteLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenQuoteLookup }) => {
  const { config, getWhatsAppUrl, getPhoneUrl, openEnquiryModal } = useAgency();

  return (
    <footer className="bg-[#0A192F] text-slate-300 pt-16 pb-24 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value reassurance badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800/80 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Transparent Pricing</h4>
              <p className="text-xs text-slate-400 mt-1">Clear inclusions & exclusions with zero hidden commercial surprises.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Customized Itineraries</h4>
              <p className="text-xs text-slate-400 mt-1">Every itinerary tailored to your preferred pace, hotel class, and dates.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Dedicated Travel Expert</h4>
              <p className="text-xs text-slate-400 mt-1">Single point of contact on phone & WhatsApp before, during, and after trip.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Verified Local Partners</h4>
              <p className="text-xs text-slate-400 mt-1">Inspected 3 to 5-star properties, sanitized tourist cabs, and vetted chauffeurs.</p>
            </div>
          </div>
        </div>

        {/* Main 4-column footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center text-[#0A192F]">
                <Compass className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <span className="font-brand text-2xl font-bold tracking-wider text-white block leading-tight">
                  AN WONDER CO
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block">
                  Travel & Expeditions
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Carefully planned travel experiences with transparent packages, personal assistance, and genuine care throughout your entire journey.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/60 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={getPhoneUrl()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-200 bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {config.phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-amber-400">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('destinations')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer"
                >
                  All Destinations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('packages')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer"
                >
                  Holiday Packages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer"
                >
                  About Our Company
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('reviews')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer"
                >
                  Traveler Reviews
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-amber-400">Popular Tours</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('packages', 'kashmir')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Kashmir Holidays</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('packages', 'rajasthan')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Rajasthan Royal Heritage</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('packages', 'kerala')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Kerala Backwaters</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('packages', 'dubai')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Dubai Oasis Tours</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('packages', 'bali')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Bali Island Packages</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('packages', 'goa')} 
                  className="hover:text-white transition text-slate-400 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Goa Coastal Getaways</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Office */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-amber-400">Travel Desk</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{config.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{config.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{config.phone}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenQuoteLookup}
                className="w-full text-left py-2 px-3 rounded-md bg-slate-800/80 hover:bg-slate-800 text-xs text-amber-300 font-medium border border-slate-700 cursor-pointer flex items-center justify-between"
              >
                <span>Track Quote / Booking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} An Wonder Co Travel & Expeditions. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="text-slate-500">Government Registered Travel Agency</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              Agency Management Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
