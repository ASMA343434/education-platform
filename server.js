require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(express.static('public'));
app.use(express.json());

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Wrap async handlers
const asyncHandler = fn => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

app.post('/api/courses', upload.single('video'), asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new Error('No video file provided');
    }

    const result = await cloudinary.uploader.upload_stream({
        resource_type: 'video',
        timeout: 120000
    }).end(req.file.buffer);

    const course = {
        title: req.body.title,
        description: req.body.description,
        videoUrl: result.secure_url,
        createdAt: new Date()
    };
    
    // Store course data (implement your database logic here)
    res.status(201).json(course);
}));

// Export for Vercel
module.exports = app;

// Start server if not in Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
