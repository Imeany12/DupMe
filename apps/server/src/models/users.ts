import { IMatch, IUser } from '@repo/shared-types';
import { model, Schema } from 'mongoose';

const matchSchema = new Schema<IMatch>(
  {
    opponent: { type: String, required: true },
    outcome: { type: String, enum: ['win', 'lose', 'draw'], required: true },
    roundsWon: { type: Number, default: 0 },
    roundsLost: { type: Number, default: 0 },
    dateTime: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: [4, 'Password must be at least 4 characters long'],
    },
    email: { type: String },
    image: { type: String },
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
    total_score: {
      type: Number,
      default: 0,
    },
    matchHistory: [matchSchema],
  },
  { versionKey: false }
);

const User = model<IUser>('User', userSchema);

export default User;
