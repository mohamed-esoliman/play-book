import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  gameId: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CommentSchema.index({ gameId: 1 });
CommentSchema.index({ userId: 1 });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema); 