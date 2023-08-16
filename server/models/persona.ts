import mongoose, { Schema } from 'mongoose';
import { Persona } from '../../types/persona';

const schema = new Schema<Persona>(
  {
    role: { type: String, required: true },
    name: { type: String, required: true },
    age: {
      type: Schema.Types.Mixed,
      validate: {
        validator: function (v: unknown) {
          return typeof v === 'string' || typeof v === 'number';
        },
        message: (props) => `${props.value} is not a valid value for age`,
      },
    },
    gender: { type: String, enum: ['male', 'female'], required: true },
    trait: { type: String, required: true },
    other: { type: String },
    image: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    issue: { type: Schema.Types.ObjectId, ref: 'Issue' },
  },
  { timestamps: true, strictQuery: true }
);

export default mongoose.model<Persona>('Persona', schema, 'persona');
