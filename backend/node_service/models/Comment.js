const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);