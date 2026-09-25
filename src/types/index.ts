export type EnquiryStatus = 
  | 'new' 
  | 'contacted' 
  | 'quote_sent' 
  | 'payment_pending' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled';

export type EnquirySource = 
  | 'website' 
  | 'instagram' 
  | 'instagram_ad' 
  | 'google' 
  | 'whatsapp' 
  | 'direct' 
  | string;

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  stay?: string;
  activities?: string[];
}

export type PackageStatus = 'published' | 'draft' | 'archived';

export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  destination: string;
  destinationId?: string;
  tourType?: 'Group Tour' | 'Personal Tour' | 'Honeymoon / Couple' | 'Custom Trip' | string;
  duration: string; // e.g. "5 Nights / 6 Days"
  startingPrice: number;
  originalPrice?: number; // for strikethrough display with discount
  offerBadge?: string; // e.g. "35% SPECIAL OFF", "BEST SELLER"
  description: string;
  overview: string;
  highlights: string[];
  images: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  hotels?: string;
  transportation?: string;
  meals?: string;
  sightseeing?: string;
  activities?: string;
  importantInfo?: string[];
  featured: boolean;
  status: PackageStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  startingPrice: number;
  region: 'Domestic' | 'International';
  isPopular: boolean;
  highlights: string[];
}

export interface Enquiry {
  id: string;
  referenceId: string; // e.g. "TRV-2026-0001"
  name: string;
  phone: string;
  email?: string;
  destinationId: string;
  destinationName: string;
  packageId?: string;
  packageTitle?: string;
  travelDate: string;
  adults: number;
  children: number;
  tourType?: string; // e.g. "Group Tour", "Honeymoon / Couple", "Family Vacation", "Solo Adventure"
  wantsOfficeVisit?: boolean; // Schedule a free consultation at office
  budget?: string;
  message?: string;
  source: EnquirySource;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  status: EnquiryStatus;
  quotedAmount?: number;
  quoteNotes?: string;
  quoteDate?: string;
  quoteValidUntil?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. "BK-2026-00001"
  enquiryId?: string;
  packageId: string;
  packageTitle: string;
  destinationName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  adults: number;
  children: number;
  amount: number;
  paymentId: string;
  paymentGateway: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  customerName: string;
  bookingId?: string;
  packageId?: string;
  packageTitle: string;
  rating: number; // 1 to 5
  review: string;
  photoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  createdAt: string;
}

export interface AgencyConfig {
  agencyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  operatingHours: string;
  currencySymbol: string;
  tagline: string;
  updatedAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Booking' | 'Packages' | 'Payment & Cancellation';
}

export interface OfficeUnit {
  id: string;
  name: string;
  type: 'Capital Unit' | 'Regional Hub' | 'Flagship Center' | 'Valley Desk' | 'Holiday Desk';
  city: string;
  state: string;
  isCapital: boolean;
  address: string;
  landmark: string;
  phone: string;
  whatsapp: string;
  email: string;
  operatingHours: string;
  consultant: string;
  image: string;
  amenities: string[];
}

export interface OfficeVisitBooking {
  unitId: string;
  unitName: string;
  customerName: string;
  customerPhone: string;
  visitDate: string;
  timeSlot: string;
  tourTopic?: string;
  numberOfPersons: number;
}

