/**
 * REST API client for Wander Waves Travel Agency backend.
 * Provides clean frontend-to-backend communication over /api routes.
 */

const API_BASE = '/api';

export const apiClient = {
  // --- ENQUIRIES ---
  async createEnquiry(enquiryData: {
    name: string;
    phone: string;
    destination: string;
    packageId?: string;
    travelDate: string;
    travellers: number;
    message?: string;
  }) {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  async getEnquiries() {
    const res = await fetch(`${API_BASE}/enquiries`);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  async getEnquiryByRef(referenceId: string) {
    const res = await fetch(`${API_BASE}/enquiries/${encodeURIComponent(referenceId)}`);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  // --- DESTINATIONS ---
  async getDestinations() {
    const res = await fetch(`${API_BASE}/destinations`);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  // --- PACKAGES ---
  async getPackages() {
    const res = await fetch(`${API_BASE}/packages`);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  async getPackageBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/packages/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  // --- REVIEWS ---
  async getReviews(all = false) {
    const res = await fetch(`${API_BASE}/reviews${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  async submitReview(reviewData: {
    customerName: string;
    packageTitle: string;
    rating: number;
    review: string;
    photo?: string;
    bookingId?: string;
  }) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  // --- CONTACT ---
  async submitContact(contactData: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  // --- PAYMENTS & BOOKINGS ---
  async createPaymentOrder(orderData: {
    amount: number;
    currency?: string;
    enquiryReference?: string;
  }) {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  async verifyPayment(verificationData: any) {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },

  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  },
};
