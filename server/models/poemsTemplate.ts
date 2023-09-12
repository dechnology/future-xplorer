import mongoose, { Schema } from 'mongoose';
import { PoemsTemplate } from '~/types';

const schema = new Schema<PoemsTemplate>(
  {
    title: { type: String, required: true },
    persona: { type: Schema.Types.ObjectId, ref: 'Persona' },
    object: { type: String, required: true },
    environment: { type: String, required: true },
    message: { type: String, required: true },
    service: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    issue: { type: Schema.Types.ObjectId, ref: 'Issue' },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<PoemsTemplate>(
  'PoemsTemplate',
  schema,
  'poemsTemplate'
);
