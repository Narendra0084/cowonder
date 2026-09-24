import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  MapPin, 
  MessageSquare, 
  Settings, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  ReceiptText, 
  Phone, 
  MessageCircle, 
  Lock, 
  LogOut, 
  Calendar,
  Save,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  DollarSign
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { 
  Enquiry, 
  Booking, 
  TourPackage, 
  Destination, 
  Review, 
  EnquiryStatus, 
  PackageStatus 
} from '../../types';
import { 
  getEnquiries, 
  updateEnquiry, 
  getBookings, 
  getPackages, 
  savePackage, 
  deletePackage, 
  getAllReviews, 
  updateReviewStatus,
  getDestinations
} from '../../services/dbService';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onOpenQuoteLookup: (ref: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, onOpenQuoteLookup }) => {
  const { 
    isAdmin, 
    currentUser, 
    handleGoogleLogin, 
    handleLogout, 
    config, 
    updateConfig, 
    addToast,
    setAdminPasswordVerified,
    getWhatsAppUrl
  } = useAgency();

  // Auth gate state
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'enquiries' | 'bookings' | 'packages' | 'reviews' | 'settings'>('enquiries');

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected enquiry for quoting modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [quotedAmount, setQuotedAmount] = useState<number>(0);
  const [quoteNotes, setQuoteNotes] = useState<string>('');
  const [quoteValidUntil, setQuoteValidUntil] = useState<string>('');
  const [enquiryStatus, setEnquiryStatus] = useState<EnquiryStatus>('new');

  // Package editor modal
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);

  // Agency settings form state
  const [settingsForm, setSettingsForm] = useState(config);

  const loadData = async () => {
    setLoading(true);
    try {
      const [enqs, bks, pkgs, revs, dests] = await Promise.all([
        getEnquiries(),
        getBookings(),
        getPackages(),
        getAllReviews(),
        getDestinations(),
      ]);
      setEnquiries(enqs);
      setBookings(bks);
      setPackages(pkgs);
      setReviews(revs);
      setDestinations(dests);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  useEffect(() => {
    setSettingsForm(config);
  }, [config]);

  // Handle Passkey verification
  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === 'admin123' || passkeyInput === 'wanderwaves2026') {
      setAdminPasswordVerified(true);
      setPasskeyError('');
      addToast('Authorized access granted', 'success');
    } else {
      setPasskeyError('Invalid admin key. Try default demo key: admin123');
    }
  };

  // Handle Quoting updates
  const handleSaveQuote = async () => {
    if (!selectedEnquiry) return;
    try {
      await updateEnquiry(selectedEnquiry.id, {
        status: enquiryStatus,
        quotedAmount: Number(quotedAmount) || undefined,
        quoteNotes: quoteNotes.trim() || undefined,
        quoteValidUntil: quoteValidUntil || undefined,
        quoteDate: new Date().toISOString().split('T')[0],
      });

      addToast(`Enquiry ${selectedEnquiry.referenceId} updated successfully`, 'success');
      setSelectedEnquiry(null);
      loadData();
    } catch (e) {
      addToast('Error saving quote', 'error');
    }
  };

  // Handle Review moderation
  const handleReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await updateReviewStatus(reviewId, status);
      addToast(`Review marked as ${status}`, 'success');
      loadData();
    } catch (e) {
      addToast('Failed to update review status', 'error');
    }
  };

  // Handle Package save
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    try {
      await savePackage(editingPackage);
      addToast(isNewPackage ? 'Package created successfully' : 'Package updated successfully', 'success');
      setEditingPackage(null);
      loadData();
    } catch (e) {
      addToast('Failed to save package', 'error');
    }
  };

  // Handle Package delete
  const handleDeletePackage = async (pkgId: string) => {
    if (window.confirm('Are you sure you want to delete this tour package?')) {
      try {
        await deletePackage(pkgId);
        addToast('Package deleted', 'info');
        loadData();
      } catch (e) {
        addToast('Failed to delete package', 'error');
      }
    }
  };

  // Handle Agency settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateConfig(settingsForm);
  };

  // --- ACCESS GATE SCREEN IF NOT LOGGED IN ---
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="w-16 h-16 rounded-2xl bg-[#0A192F] text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-[#0A192F]">
              Co Wonder Operations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized Agency Management Console
            </p>
          </div>

          {/* Direct Firebase Auth */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google Admin Account</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-3 text-[10px] text-slate-400 uppercase">Or Agency Passkey</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            {/* Passkey entry form */}
            <form onSubmit={handlePasskeySubmit} className="space-y-3">
              <input
                type="password"
                placeholder="Enter agency passkey (admin123)"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F] text-center"
              />

              {passkeyError && (
                <p className="text-xs text-rose-600">{passkeyError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#0A192F] hover:bg-[#132A4A] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Access Dashboard
              </button>
            </form>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              ← Return to public website
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- LOGGED-IN ADMIN CONSOLE ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Admin Navbar */}
      <header className="bg-[#0A192F] text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#0A192F] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-brand text-lg font-bold tracking-wider text-white">
                WANDER WAVES
              </span>
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold block">
                Travel Operations Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition cursor-pointer"
            >
              View Public Website
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-rose-300 hover:text-rose-100 px-3 py-1.5 rounded-md hover:bg-rose-950/40 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto text-xs font-medium">
          {[
            { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: Users },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: FileCheck2 },
            { id: 'packages', label: `Packages (${packages.length})`, icon: Package },
            { id: 'reviews', label: `Reviews (${reviews.filter(r => r.status === 'pending').length} pending)`, icon: MessageSquare },
            { id: 'settings', label: 'Agency Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'border-amber-400 text-amber-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* --- TAB 1: ENQUIRIES & WORKFLOW --- */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0A192F]">
                  Travel Enquiries ({enquiries.length})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage leads, send official quotations, and monitor conversion stages.
                </p>
              </div>

              <button
                onClick={loadData}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer self-start"
              >
                Refresh Data
              </button>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500 text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Ref ID</th>
                      <th className="p-3.5">Traveler Name</th>
                      <th className="p-3.5">Destination & Package</th>
                      <th className="p-3.5">Travel Date & Pax</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Quoted</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No customer enquiries submitted yet.
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-[#0A192F]">
                            {enq.referenceId}
                            <span className="block text-[10px] font-normal text-slate-400">
                              {enq.source}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <strong className="text-slate-900 block">{enq.name}</strong>
                            <span className="text-slate-500">{enq.phone}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-800 block">
                              {enq.destinationName}
                            </span>
                            <span className="text-slate-500 line-clamp-1">
                              {enq.packageTitle || 'Custom Requirements'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span>{enq.travelDate}</span>
                            <span className="block text-slate-500 text-[10px]">
                              {enq.adults} Adults {enq.children > 0 && `, ${enq.children} Ch`}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              enq.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : enq.status === 'quote_sent'
                                ? 'bg-amber-100 text-amber-800'
                                : enq.status === 'contacted'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {enq.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 font-medium">
                            {enq.quotedAmount ? (
                              <span className="text-emerald-700 font-bold">
                                {config.currencySymbol}{enq.quotedAmount.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Pending quote</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            {/* WhatsApp Direct Link */}
                            <a
                              href={getWhatsAppUrl(`Hello ${enq.name}, I am reaching out from Co Wonder regarding your enquiry ${enq.referenceId} for ${enq.destinationName}.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded inline-block"
                              title="WhatsApp Customer"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            {/* View / Send Quote */}
                            <button
                              onClick={() => {
                                setSelectedEnquiry(enq);
                                setQuotedAmount(enq.quotedAmount || 0);
                                setQuoteNotes(enq.quoteNotes || '');
                                setQuoteValidUntil(enq.quoteValidUntil || '');
                                setEnquiryStatus(enq.status);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] rounded transition cursor-pointer"
                            >
                              Manage Quote
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: BOOKINGS --- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0A192F]">
                Confirmed Bookings ({bookings.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Verified client vouchers with recorded payment references.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500 text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Booking Ref</th>
                      <th className="p-3.5">Traveler</th>
                      <th className="p-3.5">Tour Package</th>
                      <th className="p-3.5">Departure Date</th>
                      <th className="p-3.5">Paid Amount</th>
                      <th className="p-3.5">Payment Ref</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No confirmed bookings yet.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-[#0A192F]">
                            {bk.bookingReference}
                          </td>
                          <td className="p-3.5">
                            <strong className="text-slate-900 block">{bk.customerName}</strong>
                            <span className="text-slate-500">{bk.customerPhone}</span>
                          </td>
                          <td className="p-3.5">
                            <strong className="text-slate-800 block">{bk.packageTitle}</strong>
                            <span className="text-slate-500">{bk.destinationName}</span>
                          </td>
                          <td className="p-3.5">{bk.travelDate}</td>
                          <td className="p-3.5 font-bold text-emerald-700">
                            {config.currencySymbol}{bk.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                            {bk.paymentId}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase">
                              {bk.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: PACKAGES MANAGEMENT --- */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0A192F]">
                  Tour Packages ({packages.length})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Create, edit, change pricing, and publish itineraries.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsNewPackage(true);
                  setEditingPackage({
                    id: `pkg-${Date.now()}`,
                    slug: `tour-${Date.now()}`,
                    title: '',
                    destination: 'Kashmir',
                    destinationId: 'kashmir',
                    duration: '5 Nights / 6 Days',
                    startingPrice: 24999,
                    description: '',
                    overview: '',
                    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'],
                    highlights: ['Airport pickup & drop', 'Verified 4-star hotel stay', 'Daily breakfast & dinner'],
                    inclusions: ['4-star accommodations', 'Private chauffeur vehicle', 'Daily hot breakfast', 'All permit fees'],
                    exclusions: ['Airfare / train tickets', 'Personal expenses', 'Optional sports'],
                    itinerary: [
                      { day: 1, title: 'Arrival & Welcome', description: 'Meet and greet at airport, transfer to hotel, evening leisure.' }
                    ],
                    status: 'published',
                    featured: false,
                  });
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] rounded-lg transition flex items-center gap-1.5 cursor-pointer self-start"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add New Package</span>
              </button>
            </div>

            {/* Packages Grid in Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="relative h-40 rounded-lg overflow-hidden mb-3 bg-slate-100">
                      <img
                        src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/95 text-slate-800">
                        {pkg.destination}
                      </span>
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        pkg.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {pkg.status}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-[#0A192F]">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{pkg.duration}</p>
                    <p className="text-xs text-slate-700 font-bold mt-2">
                      Starting from {config.currencySymbol}{pkg.startingPrice.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsNewPackage(false);
                        setEditingPackage(pkg);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- TAB 4: REVIEWS MODERATION --- */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0A192F]">
                Review Moderation ({reviews.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Only approved reviews appear publicly on the website. Verify customer feedback before publishing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-slate-900 text-sm">{rev.customerName}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        rev.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rev.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rev.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-2">
                      {rev.packageTitle} • Rating: <strong>{rev.rating}/5</strong> • {rev.date}
                    </p>

                    <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{rev.review}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleReviewStatus(rev.id, 'approved')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleReviewStatus(rev.id, 'rejected')}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- TAB 5: AGENCY CONFIGURATION --- */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="font-display text-xl font-bold text-[#0A192F] mb-1">
              Agency Business Profile
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Update phone numbers, WhatsApp link parameters, and address across the site.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agency Name</label>
                <input
                  type="text"
                  value={settingsForm.agencyName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, agencyName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number (Call CTA)</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number (with Country Code)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={settingsForm.currencySymbol}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={settingsForm.operatingHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, operatingHours: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Office Address</label>
                <textarea
                  rows={2}
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Save Agency Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* --- QUOTE EDITING MODAL FOR ENQUIRY (Phase 16 Specification) --- */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0A192F]">
                  Manage Lead: {selectedEnquiry.referenceId}
                </h3>
                <p className="text-xs text-slate-500">
                  Customer: <strong>{selectedEnquiry.name}</strong> • {selectedEnquiry.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Workflow Status</label>
                <select
                  value={enquiryStatus}
                  onChange={(e) => setEnquiryStatus(e.target.value as EnquiryStatus)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted on WhatsApp / Phone</option>
                  <option value="quote_sent">Quote Sent to Customer</option>
                  <option value="payment_pending">Payment Pending</option>
                  <option value="confirmed">Confirmed & Paid</option>
                  <option value="completed">Completed Journey</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quoted Total Amount ({config.currencySymbol})
                </label>
                <input
                  type="number"
                  value={quotedAmount}
                  onChange={(e) => setQuotedAmount(Number(e.target.value))}
                  placeholder="e.g. 54000"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quote Guaranteed Valid Until</label>
                <input
                  type="date"
                  value={quoteValidUntil}
                  onChange={(e) => setQuoteValidUntil(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quotation Notes / Terms for Customer</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Includes 4-star Dal Lake houseboat, private sedan, breakfast & dinner..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveQuote}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition"
                >
                  Save & Update Quote
                </button>
                <button
                  onClick={() => {
                    const ref = selectedEnquiry.referenceId;
                    setSelectedEnquiry(null);
                    onOpenQuoteLookup(ref);
                  }}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition"
                >
                  Preview Customer View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PACKAGE CREATION / EDITING MODAL --- */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-display text-lg font-bold text-[#0A192F]">
                {isNewPackage ? 'Add New Tour Package' : `Edit Package: ${editingPackage.title}`}
              </h3>
              <button
                onClick={() => setEditingPackage(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package Title</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.title}
                    onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Name</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.destination}
                    onChange={(e) => setEditingPackage({ ...editingPackage, destination: e.target.value, destinationId: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.duration}
                    onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                    placeholder="e.g. 5 Nights / 6 Days"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Starting Price ({config.currencySymbol})</label>
                  <input
                    type="number"
                    required
                    value={editingPackage.startingPrice}
                    onChange={(e) => setEditingPackage({ ...editingPackage, startingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={editingPackage.status}
                    onChange={(e) => setEditingPackage({ ...editingPackage, status: e.target.value as PackageStatus })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Image URL</label>
                <input
                  type="url"
                  required
                  value={editingPackage.images[0] || ''}
                  onChange={(e) => {
                    const newImgs = [...editingPackage.images];
                    newImgs[0] = e.target.value;
                    setEditingPackage({ ...editingPackage, images: newImgs });
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description (Cards)</label>
                <textarea
                  rows={2}
                  required
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Itinerary Overview</label>
                <textarea
                  rows={3}
                  required
                  value={editingPackage.overview}
                  onChange={(e) => setEditingPackage({ ...editingPackage, overview: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={editingPackage.featured || false}
                  onChange={(e) => setEditingPackage({ ...editingPackage, featured: e.target.checked })}
                  className="rounded text-[#0A192F]"
                />
                <label htmlFor="featuredCheck" className="font-semibold text-slate-700">
                  Feature on Homepage Hero & Top Spots
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A]"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
