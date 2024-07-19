const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const verifyToken = require('../middleware/verifyToken');

// CREATE
router.post('/', verifyToken, async (req, res) => {
  try {
    const rating = new Rating({
      user: req.user.id,
      game: req.body.gameId,
      score: req.body.score
    });
    await rating.save();
    res.status(201).json(rating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (all ratings for a game)
router.get('/game/:gameId', async (req, res) => {
  try {
    const ratings = await Rating.find({ game: req.params.gameId }).populate('user', 'name');
    res.json(ratings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (single rating)
router.get('/:id', async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id).populate('user', 'name').populate('game', 'name');
    if (!rating) return res.status(404).json({ error: 'Rating not found' });
    res.json(rating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const rating = await Rating.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { score: req.body.score },
      { new: true, runValidators: true }
    );
    if (!rating) return res.status(404).json({ error: 'Rating not found or you\'re not authorized to update it' });
    res.json(rating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const rating = await Rating.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!rating) return res.status(404).json({ error: 'Rating not found or you\'re not authorized to delete it' });
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;