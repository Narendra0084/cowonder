import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  region: 'Domestic' | 'International';
  startingPrice: number;
  highlights: string[];
  isPopular: boolean;
}

const DestinationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    region: { type: String, enum: ['Domestic', 'International'], required: true },
    startingPrice: { type: Number, default: 0 },
    highlights: [{ type: String }],
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DestinationModel = mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);
