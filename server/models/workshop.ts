import mongoose, { Schema } from 'mongoose';
import { ElementCategories, Workshop, WorkshopElement } from '@/types/workshop';

const subSchema = new Schema<WorkshopElement>({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: Object.keys(ElementCategories),
    required: true,
  },
});

const schema = new Schema<Workshop>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    elements: [{ type: subSchema, required: true }],
  },
  { timestamps: true, strictQuery: true, id: true, _id: true }
);

export default mongoose.model<Workshop>('Workshop', schema, 'workshop');
