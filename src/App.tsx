/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AgencyProvider, useAgency } from './context/AgencyContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileStickyBar } from './components/common/MobileStickyBar';
import { ToastContainer } from './components/common/ToastContainer';

import { HeroSection } from './components/home/HeroSection';
import { PopularDestinations } from './components/home/PopularDestinations';
import { FeaturedPackages } from './components/home/FeaturedPackages';
import { TrustSection } from './components/home/TrustSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { ReviewsSection } from './components/home/ReviewsSection';
import { FAQSection } from './components/home/FAQSection';

import { PackagesListPage } from './components/packages/PackagesListPage';
import { PackageDetailPage } from './components/packages/PackageDetailPage';
import { DestinationsListPage } from './components/destinations/DestinationsListPage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { ReviewsPage } from './components/pages/ReviewsPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { EnquiryModal } from './components/enquiry/EnquiryModal';
import { PlanTripPopup } from './components/enquiry/PlanTripPopup';
import { OfficeUnitsModal } from './components/units/OfficeUnitsModal';
import { SubmitReviewModal } from './components/reviews/SubmitReviewModal';
import { QuoteViewModal } from './components/quote/QuoteViewModal';
import { BookingConfirmationModal } from './components/booking/BookingConfirmationModal';
import { FloatingActionPills } from './components/common/FloatingActionPills';

import { TourPackage, Destination, Review, FAQItem, Booking } from './types';
import { 
  getPackages, 
  getDestinations, 
  getApprovedReviews, 
  getFAQs 
} from './services/dbService';

type ViewType = 'home' | 'destinations' | 'packages' | 'package-detail' | 'about' | 'reviews' | 'contact' | 'admin';

const MainAppContent: React.FC = () => {
  const { openReviewModal, openEnquiryModal, isUnitsModalOpen, selectedUnitId, closeUnitsModal } = useAgency();

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected package for detailed page
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  
  // Destination filter when navigating from popular destinations
  const [destinationFilter, setDestinationFilter] = useState<string | undefined>(undefined);

  // Quote lookup modal state
  const [isQuoteLookupOpen, setIsQuoteLookupOpen] = useState(false);
  const [quoteLookupReference, setQuoteLookupReference] = useState('');

  // Confirmed booking modal state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadAppData() {
      try {
        const [pkgs, dests, revs, fqs] = await Promise.all([
          getPackages(),
          getDestinations(),
          getApprovedReviews(),
          getFAQs(),
        ]);
        setPackages(pkgs);
        setDestinations(dests);
        setReviews(revs);
        setFaqs(fqs);
      } catch (err) {
        console.error('Failed to load application data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAppData();
  }, []);

  // Listen to browser URL query for direct quote link e.g. ?quote=TRV-2026-0001
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const quoteParam = params.get('quote');
      if (quoteParam) {
        setQuoteLookupReference(quoteParam);
        setIsQuoteLookupOpen(true);
      }
    }
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'packages' && param) {
      setDestinationFilter(param);
      setCurrentView('packages');
    } else {
      setDestinationFilter(undefined);
      setCurrentView(view as ViewType);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPackage = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
    setCurrentView('package-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDestination = (destName: string) => {
    setDestinationFilter(destName);
    setCurrentView('packages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuoteLookup = (ref: string = '') => {
    setQuoteLookupReference(ref);
    setIsQuoteLookupOpen(true);
  };

  const handleBookingConfirmed = (booking: Booking) => {
    setConfirmedBooking(booking);
  };

  // If in Admin view, render fullscreen Admin dashboard
  if (currentView === 'admin') {
    return (
      <>
        <ToastContainer />
        <AdminDashboard
          onBackToSite={() => handleNavigate('home')}
          onOpenQuoteLookup={(ref) => handleOpenQuoteLookup(ref)}
        />
        <QuoteViewModal
          isOpen={isQuoteLookupOpen}
          initialReference={quoteLookupReference}
          onClose={() => setIsQuoteLookupOpen(false)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased font-sans">
      <ToastContainer />

      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenQuoteLookup={() => handleOpenQuoteLookup()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <>
            <HeroSection
              destinations={destinations}
              onExplorePackages={(destFilter) => {
                if (destFilter) setDestinationFilter(destFilter);
                setCurrentView('packages');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <PopularDestinations
              destinations={destinations}
              onSelectDestination={handleSelectDestination}
              onViewAllDestinations={() => handleNavigate('destinations')}
            />

            <FeaturedPackages
              packages={packages}
              onSelectPackage={handleSelectPackage}
              onViewAllPackages={() => handleNavigate('packages')}
            />

            <TrustSection />

            <WhyChooseUs />

            <ReviewsSection
              reviews={reviews}
              onOpenSubmitReview={openReviewModal}
            />

            <FAQSection faqs={faqs} />
          </>
        )}

        {/* VIEW: DESTINATIONS LIST */}
        {currentView === 'destinations' && (
          <DestinationsListPage
            destinations={destinations}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {/* VIEW: ALL PACKAGES LIST */}
        {currentView === 'packages' && (
          <PackagesListPage
            packages={packages}
            destinations={destinations}
            initialDestinationFilter={destinationFilter}
            onSelectPackage={handleSelectPackage}
          />
        )}

        {/* VIEW: PACKAGE DETAIL PAGE */}
        {currentView === 'package-detail' && selectedPackage && (
          <PackageDetailPage
            packageData={selectedPackage}
            onBack={() => handleNavigate('packages')}
          />
        )}

        {/* VIEW: ABOUT US */}
        {currentView === 'about' && <AboutUsPage />}

        {/* VIEW: REVIEWS */}
        {currentView === 'reviews' && (
          <ReviewsPage
            reviews={reviews}
            onOpenSubmitReview={openReviewModal}
          />
        )}

        {/* VIEW: CONTACT */}
        {currentView === 'contact' && <ContactUsPage />}

      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenQuoteLookup={() => handleOpenQuoteLookup()}
      />

      {/* Floating Side Action Pills (ASK ME WhatsApp & PLAN TRIP) */}
      <FloatingActionPills />

      {/* Mobile Sticky Bar (WhatsApp | Call | Enquire) */}
      <MobileStickyBar />

      {/* Modals & Dialogs */}
      <PlanTripPopup />
      <OfficeUnitsModal 
        isOpen={isUnitsModalOpen} 
        onClose={closeUnitsModal} 
        selectedUnitId={selectedUnitId} 
      />
      <EnquiryModal />
      <SubmitReviewModal />
      
      <QuoteViewModal
        isOpen={isQuoteLookupOpen}
        initialReference={quoteLookupReference}
        onClose={() => setIsQuoteLookupOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
      />

      <BookingConfirmationModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AgencyProvider>
      <MainAppContent />
    </AgencyProvider>
  );
}
