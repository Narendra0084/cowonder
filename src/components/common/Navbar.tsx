import React, { useState, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#071224]/85 backdrop-blur-xl border-b border-white/15 shadow-2xl' 
          : 'bg-[#071224]/50 backdrop-blur-md border-b border-white/10 shadow-sm'
      }`}
    >
      {/* Top micro-bar for agency trust signals and contact */}
      <div className="bg-black/35 backdrop-blur-md text-slate-200 text-xs py-1.5 px-4 hidden md:block border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-2 animate-pulse"></span>
              {config.operatingHours}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-slate-300">Transparent Pricing • No Hidden Costs • 24/7 On-Trip Assistance</span>
          </div>
          <div className="flex items-center space-x-5">
            <button
              onClick={() => openUnitsModal()}
              className="text-amber-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition font-medium text-[11px]"
            >
              <Building2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Office & Capital Units</span>
            </button>
            <span className="text-white/20">•</span>
            <button 
              onClick={onOpenQuoteLookup}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer transition font-medium text-[11px]"
            >
              <ReceiptText className="w-3.5 h-3.5" />
              <span>Track Quote / Booking</span>
            </button>
            <span className="text-white/20">•</span>
            {isAdmin ? (
              <button 
                onClick={() => onNavigate('admin')}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer text-[11px]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('admin')}
                className="text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
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
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-brand text-2xl font-extrabold tracking-wider text-white block leading-tight drop-shadow-xs">
                AN WONDER CO
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-semibold block">
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
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'text-amber-400 bg-white/15 border border-white/20 backdrop-blur-md shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={getPhoneUrl()}
              className="p-2.5 rounded-full text-white bg-white/10 hover:bg-white/20 transition border border-white/20 backdrop-blur-md"
              title="Call Travel Desk"
            >
              <Phone className="w-4 h-4 text-slate-200" />
            </a>

            <button
              onClick={onOpenQuoteLookup}
              className="p-2.5 rounded-full text-white bg-white/10 hover:bg-white/20 transition border border-white/20 backdrop-blur-md cursor-pointer"
              title="Track Quote / Customer Portal"
            >
              <User className="w-4 h-4 text-slate-200" />
            </button>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 transition border border-emerald-500/40 backdrop-blur-md shadow-xs"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Vibrant Orange Plan Trip Button */}
            <button
              onClick={() => openPlanTripPopup()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition shadow-lg hover:shadow-orange-500/20 cursor-pointer border border-orange-400/30 active:scale-95"
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
              className="p-2.5 rounded-lg text-emerald-300 bg-emerald-950/70 border border-emerald-500/40"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#071224]/95 backdrop-blur-2xl border-b border-white/15 px-4 pt-3 pb-6 space-y-3 shadow-2xl text-white">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium transition ${
                  currentView === link.id
                    ? 'bg-white/15 text-amber-400 font-bold border border-white/15'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openUnitsModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-amber-200 bg-amber-950/40 border border-amber-500/30 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Explore Office & Capital Units</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteLookup();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white/90 bg-white/10 border border-white/15"
            >
              <ReceiptText className="w-4 h-4 text-amber-400" />
              <span>Track Existing Quote or Booking</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openPlanTripPopup();
              }}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition text-center shadow-md border border-orange-400/40 cursor-pointer"
            >
              + Plan Your Custom Trip
            </button>

            <div className="flex gap-2 pt-1">
              <a
                href={getPhoneUrl()}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-white bg-white/10 border border-white/15"
              >
                <Phone className="w-3.5 h-3.5 text-slate-300" />
                <span>Call {config.phone}</span>
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="text-xs text-white/50 hover:text-white/80 cursor-pointer"
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
