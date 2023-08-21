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
    image: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    issue: { type: Schema.Types.ObjectId, ref: 'Issue' },
  },
  { timestamps: true, strictQuery: true }
);

export default mongoose.model<Case>('Case', schema, 'case');
