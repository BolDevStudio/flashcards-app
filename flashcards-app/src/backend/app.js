const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const flashcardRoutes = require('./routes/flashcards');
const categoryRoutes = require('./routes/categories');

const app = express();

// Ustawienia
app.use(cors());
app.use(bodyParser.json());

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/flashcards', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Trasy
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
