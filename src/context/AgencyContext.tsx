import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser } from '../lib/firebase';
import { AgencyConfig } from '../types';
import { DEFAULT_AGENCY_CONFIG } from '../data/seedData';
import { getAgencyConfig, updateAgencyConfig, seedInitialDataIfEmpty } from '../services/dbService';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface EnquiryPrefill {
  destinationId?: string;
  destinationName?: string;
  packageId?: string;
  packageTitle?: string;
}

export interface ReviewPrefill {
  bookingId?: string;
  packageTitle?: string;
}

interface AgencyContextType {
  config: AgencyConfig;
  updateConfig: (cfg: Partial<AgencyConfig>) => Promise<void>;
  // Enquiry Modal
  isEnquiryModalOpen: boolean;
  enquiryPrefill: EnquiryPrefill | null;
  openEnquiryModal: (prefill?: EnquiryPrefill) => void;
  closeEnquiryModal: () => void;
  // Plan Your Perfect Trip High-Converting Popup
  isPlanTripPopupOpen: boolean;
  openPlanTripPopup: (prefill?: EnquiryPrefill) => void;
  closePlanTripPopup: () => void;
  // Office Units & Capital Visits Modal
  isUnitsModalOpen: boolean;
  selectedUnitId: string | null;
  openUnitsModal: (unitId?: string) => void;
  closeUnitsModal: () => void;
  // Review Modal
  isReviewModalOpen: boolean;
  reviewPrefill: ReviewPrefill | null;
  openReviewModal: (prefill?: ReviewPrefill) => void;
  closeReviewModal: () => void;
  // Auth & Admin
  currentUser: User | null;
  isAdmin: boolean;
  adminPasswordVerified: boolean;
  setAdminPasswordVerified: (val: boolean) => void;
  handleGoogleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Deep link helpers
  getWhatsAppUrl: (customMessage?: string) => string;
  getPhoneUrl: () => string;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AgencyConfig>(DEFAULT_AGENCY_CONFIG);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryPrefill, setEnquiryPrefill] = useState<EnquiryPrefill | null>(null);
  
  const [isPlanTripPopupOpen, setIsPlanTripPopupOpen] = useState(false);

  const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewPrefill, setReviewPrefill] = useState<ReviewPrefill | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminPasswordVerified, setAdminPasswordVerified] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Initial fetch config & seed if empty
    getAgencyConfig().then(setConfig);
    seedInitialDataIfEmpty();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openEnquiryModal = (prefill?: EnquiryPrefill) => {
    setEnquiryPrefill(prefill || null);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
    setEnquiryPrefill(null);
  };

  const openPlanTripPopup = (prefill?: EnquiryPrefill) => {
    if (prefill) setEnquiryPrefill(prefill);
    setIsPlanTripPopupOpen(true);
  };

  const closePlanTripPopup = () => {
    setIsPlanTripPopupOpen(false);
  };

  const openUnitsModal = (unitId?: string) => {
    setSelectedUnitId(unitId || null);
    setIsUnitsModalOpen(true);
  };

  const closeUnitsModal = () => {
    setIsUnitsModalOpen(false);
    setSelectedUnitId(null);
  };

  const openReviewModal = (prefill?: ReviewPrefill) => {
    setReviewPrefill(prefill || null);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewPrefill(null);
  };

  const handleUpdateConfig = async (newCfg: Partial<AgencyConfig>) => {
    const updated = await updateAgencyConfig(newCfg);
    setConfig(updated);
    addToast('Agency settings saved successfully', 'success');
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      addToast('Signed in with Google', 'success');
    } catch (e: any) {
      addToast(e?.message || 'Login failed', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAdminPasswordVerified(false);
      addToast('Signed out', 'info');
    } catch (e: any) {
      addToast(e?.message || 'Logout failed', 'error');
    }
  };

  // User is admin if email matches bootstrapped admin or google login or admin passkey mode
  const isAdmin: boolean = 
    adminPasswordVerified ||
    (!!currentUser && (currentUser.email === 'narendra845581@gmail.com' || Boolean(currentUser.email?.endsWith('@wanderwaves.com'))));

  const getWhatsAppUrl = (customMessage?: string) => {
    const cleanNumber = config.whatsapp.replace(/[^0-9]/g, '');
    const text = customMessage 
      ? encodeURIComponent(customMessage) 
      : encodeURIComponent(`Hello ${config.agencyName}, I would like to plan a trip. Please assist me.`);
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  const getPhoneUrl = () => {
    const cleanNumber = config.phone.replace(/[^0-9+]/g, '');
    return `tel:${cleanNumber}`;
  };

  return (
    <AgencyContext.Provider
      value={{
        config,
        updateConfig: handleUpdateConfig,
        isEnquiryModalOpen,
        enquiryPrefill,
        openEnquiryModal,
        closeEnquiryModal,
        isPlanTripPopupOpen,
        openPlanTripPopup,
        closePlanTripPopup,
        isUnitsModalOpen,
        selectedUnitId,
        openUnitsModal,
        closeUnitsModal,
        isReviewModalOpen,
        reviewPrefill,
        openReviewModal,
        closeReviewModal,
        currentUser,
        isAdmin,
        adminPasswordVerified,
        setAdminPasswordVerified,
        handleGoogleLogin,
        handleLogout,
        toasts,
        addToast,
        removeToast,
        getWhatsAppUrl,
        getPhoneUrl,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};
