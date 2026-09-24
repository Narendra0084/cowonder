import { INITIAL_PACKAGES, INITIAL_DESTINATIONS, INITIAL_REVIEWS } from '../../../src/data/seedData';
import { EnquiryModel } from '../models/enquiry.model';
import { PackageModel } from '../models/package.model';
import { DestinationModel } from '../models/destination.model';
import { BookingModel } from '../models/booking.model';
import { ReviewModel } from '../models/review.model';
import mongoose from 'mongoose';

// In-memory data structures initialized with seed data
let inMemoryPackages: any[] = [...INITIAL_PACKAGES];
let inMemoryDestinations: any[] = [...INITIAL_DESTINATIONS];
let inMemoryReviews: any[] = [...INITIAL_REVIEWS];
let inMemoryEnquiries: any[] = [];
let inMemoryBookings: any[] = [];

const isMongoActive = () => mongoose.connection.readyState === 1;

export const dataStore = {
  // --- PACKAGES ---
  async getPackages() {
    if (isMongoActive()) {
      try {
        const docs = await PackageModel.find();
        if (docs.length > 0) return docs;
      } catch (err) {
        console.warn('Mongo read error, falling back to memory', err);
      }
    }
    return inMemoryPackages;
  },

  async getPackageBySlug(slug: string) {
    if (isMongoActive()) {
      try {
        const found = await PackageModel.findOne({ $or: [{ slug }, { id: slug }] });
        if (found) return found;
      } catch (err) {
        console.warn('Mongo read error', err);
      }
    }
    return inMemoryPackages.find((p) => p.slug === slug || p.id === slug) || null;
  },

  async createPackage(pkgData: any) {
    const newPkg = {
      ...pkgData,
      id: pkgData.id || `pkg-${Date.now()}`,
      slug: pkgData.slug || `tour-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (isMongoActive()) {
      try {
        await PackageModel.create(newPkg);
      } catch (err) {
        console.warn('Mongo write error', err);
      }
    }
    inMemoryPackages.unshift(newPkg);
    return newPkg;
  },

  async updatePackage(id: string, updates: any) {
    if (isMongoActive()) {
      try {
        await PackageModel.findOneAndUpdate({ $or: [{ id }, { _id: id }] }, updates);
      } catch (err) {
        console.warn('Mongo update error', err);
      }
    }
    const idx = inMemoryPackages.findIndex((p) => p.id === id);
    if (idx >= 0) {
      inMemoryPackages[idx] = { ...inMemoryPackages[idx], ...updates, updatedAt: new Date() };
      return inMemoryPackages[idx];
    }
    return null;
  },

  async deletePackage(id: string) {
    if (isMongoActive()) {
      try {
        await PackageModel.findOneAndDelete({ $or: [{ id }, { _id: id }] });
      } catch (err) {
        console.warn('Mongo delete error', err);
      }
    }
    inMemoryPackages = inMemoryPackages.filter((p) => p.id !== id);
    return true;
  },

  // --- DESTINATIONS ---
  async getDestinations() {
    if (isMongoActive()) {
      try {
        const docs = await DestinationModel.find();
        if (docs.length > 0) return docs;
      } catch (err) {
        console.warn('Mongo read error', err);
      }
    }
    return inMemoryDestinations;
  },

  // --- ENQUIRIES ---
  async createEnquiry(enquiryInput: any) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `TRV-2026-${randomNum}`;
    const newEnquiry = {
      ...enquiryInput,
      referenceId,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoActive()) {
      try {
        await EnquiryModel.create(newEnquiry);
      } catch (err) {
        console.warn('Mongo enquiry write error', err);
      }
    }
    inMemoryEnquiries.unshift(newEnquiry);
    return newEnquiry;
  },

  async getEnquiries() {
    if (isMongoActive()) {
      try {
        return await EnquiryModel.find().sort({ createdAt: -1 });
      } catch (err) {
        console.warn('Mongo read error', err);
      }
    }
    return inMemoryEnquiries;
  },

  async getEnquiryByRef(referenceId: string) {
    if (isMongoActive()) {
      try {
        const found = await EnquiryModel.findOne({ referenceId });
        if (found) return found;
      } catch (err) {
        console.warn('Mongo read error', err);
      }
    }
    return inMemoryEnquiries.find(
      (e) => e.referenceId.toLowerCase() === referenceId.toLowerCase()
    ) || null;
  },

  async updateEnquiry(referenceId: string, updates: any) {
    if (isMongoActive()) {
      try {
        await EnquiryModel.findOneAndUpdate({ referenceId }, updates);
      } catch (err) {
        console.warn('Mongo enquiry update error', err);
      }
    }
    const idx = inMemoryEnquiries.findIndex((e) => e.referenceId === referenceId || e.id === referenceId);
    if (idx >= 0) {
      inMemoryEnquiries[idx] = { ...inMemoryEnquiries[idx], ...updates, updatedAt: new Date() };
      return inMemoryEnquiries[idx];
    }
    return null;
  },

  // --- BOOKINGS ---
  async createBooking(bookingInput: any) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `BK-2026-${randomNum}`;
    const newBooking = {
      ...bookingInput,
      bookingId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoActive()) {
      try {
        await BookingModel.create(newBooking);
      } catch (err) {
        console.warn('Mongo booking write error', err);
      }
    }
    inMemoryBookings.unshift(newBooking);
    return newBooking;
  },

  async getBookings() {
    if (isMongoActive()) {
      try {
        return await BookingModel.find().sort({ createdAt: -1 });
      } catch (err) {
        console.warn('Mongo read error', err);
      }
    }
    return inMemoryBookings;
  },

  async getBookingByRef(bookingId: string) {
    if (isMongoActive()) {
      try {
        const found = await BookingModel.findOne({ bookingId });
        if (found) return found;
      } catch (err) {
        console.warn('Mongo read error', err);
      }
    }
    return inMemoryBookings.find(
      (b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()
    ) || null;
  },

  // --- REVIEWS ---
  async getReviews(onlyApproved = true) {
    if (isMongoActive()) {
      try {
        const query = onlyApproved ? { status: 'approved' } : {};
        const docs = await ReviewModel.find(query).sort({ createdAt: -1 });
        if (docs.length > 0) return docs;
      } catch (err) {
        console.warn('Mongo read error', err);
      }
    }
    if (onlyApproved) {
      return inMemoryReviews.filter((r) => r.status === 'approved');
    }
    return inMemoryReviews;
  },

  async createReview(reviewInput: any) {
    const newReview = {
      ...reviewInput,
      id: `rev-${Date.now()}`,
      status: 'pending',
      date: reviewInput.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      createdAt: new Date(),
    };

    if (isMongoActive()) {
      try {
        await ReviewModel.create(newReview);
      } catch (err) {
        console.warn('Mongo review write error', err);
      }
    }
    inMemoryReviews.unshift(newReview);
    return newReview;
  },

  async updateReviewStatus(id: string, status: 'approved' | 'rejected') {
    if (isMongoActive()) {
      try {
        await ReviewModel.findOneAndUpdate({ $or: [{ id }, { _id: id }] }, { status });
      } catch (err) {
        console.warn('Mongo review update error', err);
      }
    }
    const idx = inMemoryReviews.findIndex((r) => r.id === id);
    if (idx >= 0) {
      inMemoryReviews[idx].status = status;
      return inMemoryReviews[idx];
    }
    return null;
  },
};
