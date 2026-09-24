import React, { useState } from 'react';
import { 
  Compass, 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  Search,
  ReceiptText,
  User,
  Sparkles,
  Building2
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenQuoteLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenQuoteLookup }) => {
  const { config, openEnquiryModal, openPlanTripPopup, openUnitsModal, getWhatsAppUrl, getPhoneUrl, isAdmin } = useAgency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'packages', label: 'Packages' },
    { id: 'about', label: 'About Us' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Top micro-bar for agency trust signals and contact */}
      <div className="bg-[#0A192F] text-slate-200 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-2 animate-pulse"></span>
              {config.operatingHours}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Transparent Pricing • No Hidden Costs • 24/7 On-Trip Assistance</span>
          </div>
          <div className="flex items-center space-x-5">
            <button
              onClick={() => openUnitsModal()}
              className="text-amber-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition font-medium"
            >
              <Building2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Office & Capital Units</span>
            </button>
            <span className="text-slate-500">•</span>
            <button 
              onClick={onOpenQuoteLookup}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer transition font-medium"
            >
              <ReceiptText className="w-3.5 h-3.5" />
              <span>Track Quote / Booking</span>
            </button>
            <span className="text-slate-500">•</span>
            {isAdmin ? (
              <button 
                onClick={() => onNavigate('admin')}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('admin')}
                className="text-slate-400 hover:text-white transition cursor-pointer text-[11px]"
              >
                Agency Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-lg bg-[#0A192F] flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-brand text-2xl font-bold tracking-wider text-[#0A192F] block leading-tight">
                CO WONDER
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold block">
                Travel & Expeditions
              </span>
            </div>

          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0A192F] font-semibold bg-slate-100'
                      : 'text-slate-600 hover:text-[#0A192F] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href={getPhoneUrl()}
              className="p-2 rounded-full text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              title="Call Travel Desk"
            >
              <Phone className="w-4 h-4 text-slate-700" />
            </a>

            <button
              onClick={onOpenQuoteLookup}
              className="p-2 rounded-full text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
              title="Track Quote / Customer Portal"
            >
              <User className="w-4 h-4 text-slate-700" />
            </button>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-200"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Vibrant Orange Plan Trip Button matching screenshot */}
            <button
              onClick={() => openPlanTripPopup()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>+ Plan Trip</span>
            </button>
          </div>

          {/* Mobile Menu & Quick WhatsApp */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md text-emerald-700 bg-emerald-50 border border-emerald-200"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
                  currentView === link.id
                    ? 'bg-slate-100 text-[#0A192F] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openUnitsModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold text-orange-950 bg-orange-50 border border-orange-200 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-orange-600" />
              <span>Explore Office & Capital Units</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteLookup();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium text-amber-900 bg-amber-50 border border-amber-200"
            >
              <ReceiptText className="w-4 h-4 text-amber-700" />
              <span>Track Existing Quote or Booking</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openEnquiryModal();
              }}
              className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition text-center shadow-xs"
            >
              Request Custom Quote
            </button>

            <div className="flex gap-2 pt-1">
              <a
                href={getPhoneUrl()}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {config.phone}</span>
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Admin Management Console
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
