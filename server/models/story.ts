import mongoose, { Schema } from 'mongoose';
import { Story } from '~/types';

const schema = new Schema<Story>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
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

export default mongoose.model<Story>('Story', schema, 'story');
