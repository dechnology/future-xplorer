import mongoose, { Schema } from 'mongoose';
import { Vote } from '@/types';

const schema = new Schema<Vote>(
  {
    keyword: { type: Schema.Types.ObjectId, ref: 'Keyword' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<Vote>('Vote', schema, 'vote');
