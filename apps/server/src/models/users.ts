import { IMatch, IUser, KeyMapping } from '@repo/shared-types';
import { model, Schema } from 'mongoose';

const matchSchema = new Schema<IMatch>(
  {
    score: { type: Number, required: true },
    opponent: { type: String, required: true },
    outcome: { type: String, enum: ['win', 'lose', 'draw'], required: true },
    roundsWon: { type: Number, required: true },
    roundsLost: { type: Number, required: true },
    dateTime: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const keybindSchema = new Schema<KeyMapping>(
  {},
  { strict: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: [4, 'Password must be at least 4 characters long'],
    },
    email: { type: String, required: false },
    image: { type: String, required: false },
    bio: { type: String, required: false },
    country: { type: String, required: false },
    dob: { type: Date, required: false },
    createdAt: {
      type: Date,
      default: () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      },
    },
    total_score: {
      type: Number,
      default: 0,
    },
    games_won: {
      type: Number,
      default: 0,
    },
    games_lost: {
      type: Number,
      default: 0,
    },
    games_draw: {
      type: Number,
      default: 0,
    },
    matchHistory: [matchSchema],
    keybindings: keybindSchema,
  },
  { versionKey: false }
);

const User = model<IUser>('User', userSchema);

export default User;
