import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  photoURL: {
    type: String
  },
  favoriteGames: [{
    type: Number,
    ref: 'Game'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 