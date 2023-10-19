import mongoose, { Schema } from 'mongoose';
import { Story } from '~/types';

const schema = new Schema<Story>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    /* Context of the story may change via manual edits */
    // context: {
    //   persona: {
    //     role: { type: String, required: true },
    //     name: { type: String, required: true },
    //     age: { type: String, required: true },
    //     gender: { type: String, enum: ['male', 'female'], required: true },
    //     trait: { type: String, required: true },
    //     other: { type: String },
    //   },
    //   object: { type: String, required: true },
    //   environment: { type: String, required: true },
    //   message: { type: String, required: true },
    //   service: { type: String, required: true },
    // },
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
