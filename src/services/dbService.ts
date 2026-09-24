import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  TourPackage, 
  Destination, 
  Enquiry, 
  Booking, 
  Review, 
  AgencyConfig, 
  FAQItem 
} from '../types';
import { 
  INITIAL_PACKAGES, 
  INITIAL_DESTINATIONS, 
  INITIAL_REVIEWS, 
  INITIAL_FAQS, 
  DEFAULT_AGENCY_CONFIG 
} from '../data/seedData';

// Local storage keys for resilient fallback
const LS_PACKAGES_KEY = 'wanderwaves_packages';
const LS_DESTINATIONS_KEY = 'wanderwaves_destinations';
const LS_ENQUIRIES_KEY = 'wanderwaves_enquiries';
const LS_BOOKINGS_KEY = 'wanderwaves_bookings';
const LS_REVIEWS_KEY = 'wanderwaves_reviews';
const LS_CONFIG_KEY = 'wanderwaves_config';
const LS_FAQS_KEY = 'wanderwaves_faqs';

// UTM parameters parser for lead attribution
export function getUtmParameters(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
} {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
  };
}

// Generate human-friendly reference numbers
export function generateEnquiryReference(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TRV-2026-${randomNum}`;
}

export function generateBookingReference(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `BK-2026-${randomNum}`;
}

// Helper for local storage retrieval
function getLocalFallback<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
  }
  return defaultData;
}

function saveLocalFallback<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error writing localStorage for ${key}`, e);
  }
}

// --- PACKAGES ---
export async function getPackages(): Promise<TourPackage[]> {
  try {
    const snapshot = await getDocs(collection(db, 'packages'));
    if (!snapshot.empty) {
      const packages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourPackage));
      saveLocalFallback(LS_PACKAGES_KEY, packages);
      return packages;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'packages');
  }
  return getLocalFallback(LS_PACKAGES_KEY, INITIAL_PACKAGES);
}

export async function getPackageBySlug(slug: string): Promise<TourPackage | null> {
  const all = await getPackages();
  return all.find(p => p.slug === slug || p.id === slug) || null;
}

export async function savePackage(pkg: TourPackage): Promise<void> {
  const id = pkg.id || `pkg-${Date.now()}`;
  const pkgWithId = { ...pkg, id, updatedAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'packages', id), pkgWithId);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `packages/${id}`);
  }
  // Keep local synced
  const existing = getLocalFallback(LS_PACKAGES_KEY, INITIAL_PACKAGES);
  const index = existing.findIndex(p => p.id === id);
  if (index >= 0) existing[index] = pkgWithId;
  else existing.unshift(pkgWithId);
  saveLocalFallback(LS_PACKAGES_KEY, existing);
}

export async function deletePackage(packageId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'packages', packageId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `packages/${packageId}`);
  }
  const existing = getLocalFallback(LS_PACKAGES_KEY, INITIAL_PACKAGES);
  saveLocalFallback(LS_PACKAGES_KEY, existing.filter(p => p.id !== packageId));
}

// --- DESTINATIONS ---
export async function getDestinations(): Promise<Destination[]> {
  try {
    const snapshot = await getDocs(collection(db, 'destinations'));
    if (!snapshot.empty) {
      const dests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
      saveLocalFallback(LS_DESTINATIONS_KEY, dests);
      return dests;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'destinations');
  }
  return getLocalFallback(LS_DESTINATIONS_KEY, INITIAL_DESTINATIONS);
}

// --- ENQUIRIES ---
export async function submitEnquiry(enquiryInput: Omit<Enquiry, 'id' | 'referenceId' | 'status' | 'createdAt'>): Promise<Enquiry> {
  const id = `enq-${Date.now()}`;
  const referenceId = generateEnquiryReference();
  const utms = getUtmParameters();

  const newEnquiry: Enquiry = {
    ...enquiryInput,
    id,
    referenceId,
    status: 'new',
    source: enquiryInput.source || (utms.utmSource ? 'instagram' : 'website'),
    utmSource: utms.utmSource,
    utmMedium: utms.utmMedium,
    utmCampaign: utms.utmCampaign,
    utmContent: utms.utmContent,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'enquiries', id), newEnquiry);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `enquiries/${id}`);
  }

  // Update local fallback
  const existing = getLocalFallback<Enquiry[]>(LS_ENQUIRIES_KEY, []);
  existing.unshift(newEnquiry);
  saveLocalFallback(LS_ENQUIRIES_KEY, existing);

  return newEnquiry;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const snapshot = await getDocs(collection(db, 'enquiries'));
    if (!snapshot.empty) {
      const enqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enquiry));
      saveLocalFallback(LS_ENQUIRIES_KEY, enqs);
      return enqs;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'enquiries');
  }
  return getLocalFallback<Enquiry[]>(LS_ENQUIRIES_KEY, []);
}

export async function getEnquiryByReference(referenceId: string): Promise<Enquiry | null> {
  try {
    const q = query(collection(db, 'enquiries'), where('referenceId', '==', referenceId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Enquiry;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `enquiries?ref=${referenceId}`);
  }
  // Try local
  const localEnqs = getLocalFallback<Enquiry[]>(LS_ENQUIRIES_KEY, []);
  return localEnqs.find(e => e.referenceId.toLowerCase() === referenceId.toLowerCase() || e.id === referenceId) || null;
}

export async function updateEnquiry(enquiryId: string, updates: Partial<Enquiry>): Promise<void> {
  const payload = { ...updates, updatedAt: new Date().toISOString() };
  try {
    await updateDoc(doc(db, 'enquiries', enquiryId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `enquiries/${enquiryId}`);
  }
  const localEnqs = getLocalFallback<Enquiry[]>(LS_ENQUIRIES_KEY, []);
  const index = localEnqs.findIndex(e => e.id === enquiryId);
  if (index >= 0) {
    localEnqs[index] = { ...localEnqs[index], ...payload };
    saveLocalFallback(LS_ENQUIRIES_KEY, localEnqs);
  }
}

// --- BOOKINGS ---
export async function createBooking(bookingInput: Omit<Booking, 'id' | 'bookingReference' | 'status' | 'createdAt'>): Promise<Booking> {
  const id = `bk-${Date.now()}`;
  const bookingReference = generateBookingReference();

  const newBooking: Booking = {
    ...bookingInput,
    id,
    bookingReference,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'bookings', id), newBooking);
    // If associated with an enquiry, update enquiry status
    if (bookingInput.enquiryId) {
      await updateDoc(doc(db, 'enquiries', bookingInput.enquiryId), {
        status: 'confirmed',
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `bookings/${id}`);
  }

  const existing = getLocalFallback<Booking[]>(LS_BOOKINGS_KEY, []);
  existing.unshift(newBooking);
  saveLocalFallback(LS_BOOKINGS_KEY, existing);

  return newBooking;
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const snapshot = await getDocs(collection(db, 'bookings'));
    if (!snapshot.empty) {
      const bks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      saveLocalFallback(LS_BOOKINGS_KEY, bks);
      return bks;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'bookings');
  }
  return getLocalFallback<Booking[]>(LS_BOOKINGS_KEY, []);
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  try {
    const q = query(collection(db, 'bookings'), where('bookingReference', '==', reference));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Booking;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `bookings?ref=${reference}`);
  }
  const localBks = getLocalFallback<Booking[]>(LS_BOOKINGS_KEY, []);
  return localBks.find(b => b.bookingReference.toLowerCase() === reference.toLowerCase() || b.id === reference) || null;
}

// --- REVIEWS ---
export async function getApprovedReviews(): Promise<Review[]> {
  try {
    const q = query(collection(db, 'reviews'), where('status', '==', 'approved'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const revs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      saveLocalFallback(LS_REVIEWS_KEY, revs);
      return revs;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'reviews?status=approved');
  }
  const cached = getLocalFallback<Review[]>(LS_REVIEWS_KEY, INITIAL_REVIEWS);
  return cached.filter(r => r.status === 'approved');
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const snapshot = await getDocs(collection(db, 'reviews'));
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'reviews');
  }
  return getLocalFallback<Review[]>(LS_REVIEWS_KEY, INITIAL_REVIEWS);
}

export async function submitReview(reviewInput: Omit<Review, 'id' | 'status' | 'createdAt'>): Promise<Review> {
  const id = `rev-${Date.now()}`;
  const newReview: Review = {
    ...reviewInput,
    id,
    status: 'pending', // Requires admin approval!
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'reviews', id), newReview);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `reviews/${id}`);
  }

  const existing = getLocalFallback<Review[]>(LS_REVIEWS_KEY, INITIAL_REVIEWS);
  existing.unshift(newReview);
  saveLocalFallback(LS_REVIEWS_KEY, existing);

  return newReview;
}

export async function updateReviewStatus(reviewId: string, status: 'approved' | 'rejected'): Promise<void> {
  try {
    await updateDoc(doc(db, 'reviews', reviewId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `reviews/${reviewId}`);
  }
  const existing = getLocalFallback<Review[]>(LS_REVIEWS_KEY, INITIAL_REVIEWS);
  const index = existing.findIndex(r => r.id === reviewId);
  if (index >= 0) {
    existing[index].status = status;
    saveLocalFallback(LS_REVIEWS_KEY, existing);
  }
}

// --- AGENCY CONFIG ---
export async function getAgencyConfig(): Promise<AgencyConfig> {
  try {
    const docSnap = await getDoc(doc(db, 'config', 'agency'));
    if (docSnap.exists()) {
      const cfg = docSnap.data() as AgencyConfig;
      saveLocalFallback(LS_CONFIG_KEY, cfg);
      return cfg;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'config/agency');
  }
  return getLocalFallback<AgencyConfig>(LS_CONFIG_KEY, DEFAULT_AGENCY_CONFIG);
}

export async function updateAgencyConfig(config: Partial<AgencyConfig>): Promise<AgencyConfig> {
  const current = await getAgencyConfig();
  const updated: AgencyConfig = { ...current, ...config, updatedAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'config', 'agency'), updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'config/agency');
  }
  saveLocalFallback(LS_CONFIG_KEY, updated);
  return updated;
}

// --- FAQS ---
export async function getFAQs(): Promise<FAQItem[]> {
  return getLocalFallback(LS_FAQS_KEY, INITIAL_FAQS);
}

export async function saveFAQs(faqs: FAQItem[]): Promise<void> {
  saveLocalFallback(LS_FAQS_KEY, faqs);
}

// Seeding helper to seed initial Firestore data if empty
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, 'packages'));
    if (snapshot.empty) {
      console.log('Seeding initial Wander Waves packages to Firestore...');
      for (const pkg of INITIAL_PACKAGES) {
        await setDoc(doc(db, 'packages', pkg.id), pkg);
      }
      for (const dest of INITIAL_DESTINATIONS) {
        await setDoc(doc(db, 'destinations', dest.id), dest);
      }
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), rev);
      }
      await setDoc(doc(db, 'config', 'agency'), DEFAULT_AGENCY_CONFIG);
      console.log('Firestore seed completed.');
    }
  } catch (e) {
    console.warn('Initial seeding skipped or already initialized:', e);
  }
}
