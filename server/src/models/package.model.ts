import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  title: string;
  slug: string;
  destination: string;
  destinationId?: string;
  duration: string;
  startingPrice: number;
  description: string;
  overview: string;
  highlights: string[];
  images: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    stay?: string;
    meals?: string;
    activities?: string[];
  }[];
  inclusions: string[];
  exclusions: string[];
  hotels?: string;
  transportation?: string;
  meals?: string;
  sightseeing?: string;
  activities?: string;
  importantInfo?: string[];
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    destination: { type: String, required: true },
    destinationId: { type: String },
    duration: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    highlights: [{ type: String }],
    images: [{ type: String }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        stay: { type: String },
        meals: { type: String },
        activities: [{ type: String }],
      },
    ],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    hotels: { type: String },
    transportation: { type: String },
    meals: { type: String },
    sightseeing: { type: String },
    activities: { type: String },
    importantInfo: [{ type: String }],
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
  },
  { timestamps: true }
);

export const PackageModel = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
