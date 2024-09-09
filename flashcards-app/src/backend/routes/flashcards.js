const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');

// Pobierz wszystkie fiszki
router.get('/', async (req, res) => {
    try {
        const flashcards = await Flashcard.find();
        res.json(flashcards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Dodaj nową fiszkę
router.post('/', async (req, res) => {
    const flashcard = new Flashcard({
        question: req.body.question,
        answer: req.body.answer,
        category: req.body.category,
    });

    try {
        const newFlashcard = await flashcard.save();
        res.status(201).json(newFlashcard);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
