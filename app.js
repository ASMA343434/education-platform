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
    formData.append('title', document.getElementById('courseTitle').value);
    formData.append('description', document.getElementById('courseDesc').value);
    formData.append('video', document.getElementById('courseVideo').files[0]);

    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            modal.style.display = 'none';
            courseForm.reset();
            loadCourses(); // Refresh course list
        }
    } catch (error) {
        console.error('Error:', error);
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
