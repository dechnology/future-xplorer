import mongoose, { Schema } from 'mongoose';
import { Issue } from '@/types';

const schema = new Schema<Issue>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    workshop: { type: Schema.Types.ObjectId, ref: 'Workshop' },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).index({ '$**': 'text' });

schema.virtual('personas', {
  ref: 'Persona',
  localField: '_id',
  foreignField: 'issue',
  justOne: false,
});

schema.virtual('cases', {
  ref: 'Case',
  localField: '_id',
  foreignField: 'issue',
  justOne: false,
});

schema.virtual('poemsTemplates', {
  ref: 'PoemsTemplate',
  localField: '_id',
  foreignField: 'issue',
  justOne: false,
});

schema.virtual('stories', {
  ref: 'Story',
  localField: '_id',
  foreignField: 'issue',
  justOne: false,
});

schema.virtual('illustrations', {
  ref: 'Illustration',
  localField: '_id',
  foreignField: 'issue',
  justOne: false,
});

schema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'issue',
  justOne: false,
});

export default mongoose.model<Issue>('Issue', schema, 'issue');
