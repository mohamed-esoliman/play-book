const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  score: { type: Number, required: true, min: 1, max: 10 },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);