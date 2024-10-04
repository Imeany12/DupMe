import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
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
});

const users = mongoose.model('userData', userSchema);

export default users;
