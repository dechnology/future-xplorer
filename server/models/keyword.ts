import mongoose, { Schema } from 'mongoose';
import { Keyword } from '@/types';

const schema = new Schema<Keyword>(
  {
    body: { type: String, required: true },
    category: { type: String, default: null },
    type: { type: String, enum: ['O', 'E', 'M', 'S'] },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    case: { type: Schema.Types.ObjectId, ref: 'Case' },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'keyword',
  justOne: false,
});

export default mongoose.model<Keyword>('Keyword', schema, 'keyword');
