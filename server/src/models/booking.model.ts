import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  enquiryId?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  package: {
    id: string;
    title: string;
    destination: string;
  };
  travelDate: string;
  travellers: {
    adults: number;
    children?: number;
  };
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    enquiryId: { type: String },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    },
    package: {
      id: { type: String, required: true },
      title: { type: String, required: true },
      destination: { type: String, required: true },
    },
    travelDate: { type: String, required: true },
    travellers: {
      adults: { type: Number, required: true, default: 2 },
      children: { type: Number, default: 0 },
    },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
