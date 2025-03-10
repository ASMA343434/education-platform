// ...existing code...

async function handleApiError(response) {
    const error = await response.json();
    console.error('API Error:', error);
    throw new Error(error.message || 'An error occurred');
}

courseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            body: new FormData(courseForm)
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        modal.style.display = 'none';
        courseForm.reset();
        await loadCourses();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// ...existing code...
