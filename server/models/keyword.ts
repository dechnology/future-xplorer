import mongoose, { Schema } from 'mongoose';
import { Keyword } from '@/types';

const schema = new Schema<Keyword>(
  {
    body: { type: String, required: true },
    category: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    case: { type: Schema.Types.ObjectId, ref: 'Case' },
  },
  { timestamps: true, strictQuery: true }
);

export default mongoose.model<Keyword>('Keyword', schema, 'keyword');
