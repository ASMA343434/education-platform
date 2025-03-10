require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Error handling middleware with detailed logging
app.use((err, req, res, next) => {
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    console.error('Error details:', errorDetails);

    res.status(500).json({
        error: 'Internal Server Error',
        requestId: errorDetails.requestId,
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
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

// API routes
app.use('/api', require('./routes/api'));

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;

// Start server if not in production
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
