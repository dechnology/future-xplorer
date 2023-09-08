import mongoose, { Schema } from 'mongoose';
import { DateValue, Workshop } from '@/types/workshop';

const subSchema = new Schema<DateValue>({
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const schema = new Schema<Workshop>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    dateValue: { type: subSchema, required: true },
    objects: [{ type: String, required: true }],
    environments: [{ type: String, required: true }],
    messages: [{ type: String, required: true }],
    services: [{ type: String, required: true }],
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<Workshop>('Workshop', schema, 'workshop');
