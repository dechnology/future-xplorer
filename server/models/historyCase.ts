import mongoose, { Schema } from 'mongoose';
import { HistoryCase } from '@/types';

const schema = new Schema<HistoryCase>(
  {
    title: { type: String, required: true },
    background: { type: String, required: true },
    method: { type: String, required: true },
    goal: { type: String, required: true },
    challenge: { type: String, required: true },
    result: { type: String, required: true },
    reference: { type: String, required: true },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<HistoryCase>(
  'HistoryCase',
  schema,
  'Historycase'
);
