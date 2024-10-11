import { IUser } from '@repo/shared-types';
import { model, Schema } from 'mongoose';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: [4, 'Password must be at least 4 characters long'],
    },
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
