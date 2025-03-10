const addCourseBtn = document.getElementById('addCourseBtn');
const modal = document.getElementById('uploadModal');
const courseForm = document.getElementById('courseForm');

addCourseBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

courseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const title = document.getElementById('courseTitle').value;
    const description = document.getElementById('courseDesc').value;
    const video = document.getElementById('courseVideo').files[0];

    // Client-side validation
    if (!title || !description || !video) {
        alert('Please fill in all fields and select a video');
        return;
    }

    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', video);

    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        modal.style.display = 'none';
        courseForm.reset();
        await loadCourses();
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to upload course: ${error.message}`);
    }
});

async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        displayCourses(courses);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayCourses(courses) {
    const coursesContainer = document.getElementById('courses');
    coursesContainer.innerHTML = courses.map(course => `
        <div class="course-card">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <video src="${course.videoUrl}" controls></video>
        </div>
    `).join('');
}

loadCourses();
