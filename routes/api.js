const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const upload = multer({ storage: multer.memoryStorage() });

router.get('/courses', (req, res) => {
    res.json([]);  // Replace with your courses data
});

router.post('/courses', upload.single('video'), async (req, res) => {
    try {
        // Your existing course upload logic
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
