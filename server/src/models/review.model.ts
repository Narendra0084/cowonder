import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  customerName: string;
  packageTitle: string;
  rating: number;
  review: string;
  photo?: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  bookingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    packageTitle: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    photo: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date: { type: String, required: true },
    bookingId: { type: String },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
