require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        const { startGameEngine } = require('./game-engine');
        startGameEngine();
    })
    .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
    res.send('Color Prediction Game API');
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/color/api/user', authRoutes);

// Game routes
const gameRoutes = require('./routes/gameRoutes');
app.use('/color/api/user', gameRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/color/api/user', userRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
