import mongoose, { Schema } from 'mongoose';
import { HistoryCase } from '@/types';

const schema = new Schema<HistoryCase>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    background: { type: String },
    method: { type: String },
    goal: { type: String },
    challenge: { type: String },
    result: { type: String },
    reference: { type: String },
  },
  {
    strictQuery: true,
  }
);

export default mongoose.model<HistoryCase>(
  'HistoryCase',
  schema,
  'historyCase'
);
