const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  igdbId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  cover: String,
  summary: String,
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);