import mongoose, { Schema } from 'mongoose';
import { Illustration } from '~/types';

const schema = new Schema<Illustration>(
  {
    story: { type: String, required: true },
    prompt: { type: String, required: true },
    status: {
      type: String,
      enum: ['empty', 'generating', 'uploading', 'done'],
      required: true,
    },
    image: { type: String },
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

export default mongoose.model<Illustration>(
  'Illustration',
  schema,
  'illustration'
);
