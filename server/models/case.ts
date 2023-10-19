import mongoose, { Schema } from 'mongoose';
import { Case } from '@/types';

const schema = new Schema<Case>(
  {
    title: { type: String, required: true },
    background: { type: String, required: true },
    method: { type: String, required: true },
    goal: { type: String, required: true },
    challenge: { type: String, required: true },
    result: { type: String, required: true },
    reference: { type: String, required: true },
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

schema.virtual('keywords', {
  ref: 'Keyword',
  localField: '_id',
  foreignField: 'case',
  justOne: false,
});

export default mongoose.model<Case>('Case', schema, 'case');
