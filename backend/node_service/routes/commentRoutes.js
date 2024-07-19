const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const verifyToken = require('../middleware/verifyToken');

// CREATE
router.post('/', verifyToken, async (req, res) => {
  try {
    const comment = new Comment({
      user: req.user.id,
      game: req.body.gameId,
      content: req.body.content
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (all comments for a game)
router.get('/game/:gameId', async (req, res) => {
  try {
    const comments = await Comment.find({ game: req.params.gameId }).populate('user', 'name');
    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (single comment)
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('user', 'name').populate('game', 'name');
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content: req.body.content },
      { new: true, runValidators: true }
    );
    if (!comment) return res.status(404).json({ error: 'Comment not found or you\'re not authorized to update it' });
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!comment) return res.status(404).json({ error: 'Comment not found or you\'re not authorized to delete it' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;