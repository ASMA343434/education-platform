const express = require('express');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const app = express();

// Basic cloudinary config - replace with your actual credentials
cloudinary.config({
    cloud_name: 'your_cloud_name',
    api_key: 'your_api_key',
    api_secret: 'your_api_secret'
});

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Simple in-memory storage for courses
const courses = [];

app.get('/api/courses', (req, res) => {
    res.json(courses);
});

app.post('/api/courses', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }

        const course = {
            title: req.body.title,
            description: req.body.description,
            videoUrl: 'https://example.com/placeholder-video', // Placeholder for now
            createdAt: new Date()
        };
        
        courses.push(course);
        res.status(201).json(course);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
