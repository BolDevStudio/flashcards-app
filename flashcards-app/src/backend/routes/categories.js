const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');

// Pobierz statystyki kategorii
router.get('/', async (req, res) => {
    try {
        const categories = await Flashcard.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
