const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/comments', commentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});