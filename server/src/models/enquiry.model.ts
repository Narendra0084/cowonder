import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  referenceId: string;
  name: string;
  phone: string;
  destination: string;
  packageId?: string;
  travelDate: string;
  travellers: number;
  message?: string;
  status: 'new' | 'contacted' | 'quote_sent' | 'payment_pending' | 'confirmed' | 'completed' | 'cancelled';
  quotedAmount?: number;
  quoteNotes?: string;
  quoteValidUntil?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    referenceId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    destination: { type: String, required: true },
    packageId: { type: String },
    travelDate: { type: String, required: true },
    travellers: { type: Number, default: 2 },
    message: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quote_sent', 'payment_pending', 'confirmed', 'completed', 'cancelled'],
      default: 'new',
    },
    quotedAmount: { type: Number },
    quoteNotes: { type: String },
    quoteValidUntil: { type: String },
  },
  { timestamps: true }
);

export const EnquiryModel = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
