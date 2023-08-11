import mongoose, { Schema } from 'mongoose';
import { User } from '@/types/user';

const schema = new Schema<User>(
  {
    uid: { type: String, unique: true, required: true },
    isAdmin: { type: Boolean, required: true },
    name: { type: String, required: true },
    issues: [{ type: Schema.Types.ObjectId, ref: 'Issue' }],
  },
  { timestamps: true, strictQuery: true, id: true, _id: true }
);

export default mongoose.model<User>('User', schema, 'user');
