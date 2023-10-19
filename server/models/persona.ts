import mongoose, { Schema } from 'mongoose';
import { Persona } from '../../types/persona';

const schema = new Schema<Persona>(
  {
    role: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    trait: { type: String, required: true },
    other: { type: String },
    image: { type: String, default: null },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    issue: { type: Schema.Types.ObjectId, ref: 'Issue' },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).index({ '$**': 'text' });

export default mongoose.model<Persona>('Persona', schema, 'persona');
