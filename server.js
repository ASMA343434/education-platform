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

app.post('/api/courses', upload.single('video'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video'
        });

        const course = {
            title: req.body.title,
            description: req.body.description,
            videoUrl: result.secure_url
        };
        
        courses.push(course);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload video' });
    }
});

app.get('/api/courses', (req, res) => {
    res.json(courses);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
