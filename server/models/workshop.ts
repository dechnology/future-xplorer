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
    objects: {
      type: [{ type: String, required: true }],
      validate: {
        validator: function (v: string[]) {
          return v.includes('技術');
        },
        message: (props) => `${props.value} must include '技術'`,
      },
    },
    environments: {
      type: [{ type: String, required: true }],
      validate: {
        validator: function (v: string[]) {
          return v.includes('場景體驗');
        },
        message: (props) => `${props.value} must include '場景體驗'`,
      },
    },
    messages: {
      type: [{ type: String, required: true }],
      validate: {
        validator: function (v: string[]) {
          return v.includes('洞見與價值');
        },
        message: (props) => `${props.value} must include '洞見與價值'`,
      },
    },
    services: {
      type: [{ type: String, required: true }],
      validate: {
        validator: function (v: string[]) {
          return v.includes('使用者體驗');
        },
        message: (props) => `${props.value} must include '使用者體驗'`,
      },
    },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).index({ '$**': 'text' });

export default mongoose.model<Workshop>('Workshop', schema, 'workshop');
