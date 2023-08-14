import mongoose, { Schema } from 'mongoose';
import { Issue } from '@/types/issue';

const schema = new Schema<Issue>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    workshop: { type: Schema.Types.ObjectId, ref: 'Workshop' },
  },
  { timestamps: true, strictQuery: true, id: true, _id: true }
);

export default mongoose.model<Issue>('Issue', schema, 'issue');
