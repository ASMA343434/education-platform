require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(express.static('public'));
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const courses = [];

app.post('/api/courses', upload.single('video'), async (req, res, next) => {
    try {
        // Validate request
        if (!req.file) {
            throw new Error('No video file uploaded');
        }
        if (!req.body.title || !req.body.description) {
            throw new Error('Title and description are required');
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
            timeout: 120000 // Increase timeout for large files
        }).catch(error => {
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        });

        const course = {
            title: req.body.title,
            description: req.body.description,
            videoUrl: result.secure_url,
            createdAt: new Date()
        };
        
        courses.push(course);
        res.status(201).json(course);
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
});

app.get('/api/courses', (req, res) => {
    res.json(courses);
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
