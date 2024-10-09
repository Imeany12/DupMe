import { IUser } from '@repo/shared-types';
import { model, Schema } from 'mongoose';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    games_won: {
      type: Number,
      default: 0,
    },
    games_lost: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

const User = model<IUser>('User', userSchema);

export default User;
