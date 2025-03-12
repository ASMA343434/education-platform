document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    const toggleBtn = document.querySelector('.toggle-btn');
    const header = document.querySelector('header');
    const helpBtn = document.querySelector('a[href="#ask"]');
    const helpModal = document.getElementById('help-modal');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Toggle menu
    toggleBtn.addEventListener('click', () => {
        header.classList.toggle('hidden');
        toggleBtn.classList.toggle('active');
    });

    // تحسين فتح وإغلاق المودال
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // تحديث أحداث المودال - إزالة إغلاق النافذة عند النقر خارجها
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeModal(closeBtn.closest('.modal').id);
        });
    });

    // تحديث فتح مودال المساعدة
    helpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('help-modal');
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if(document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Check saved theme
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Lesson Modal
    const lessonModal = document.getElementById('lesson-modal');
    const watchBtns = document.querySelectorAll('.watch-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // تحديث فتح مودال الدرس
    watchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-video');
            const videoContainer = document.querySelector('.video-container');
            videoContainer.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            `;
            openModal('lesson-modal');
        });
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Filtering functionality
    const gradeSelect = document.getElementById('grade-select');
    const searchInput = document.querySelector('.search-box input');
    const lessonsContainer = document.querySelector('.lessons-container');
    const lessonCards = document.querySelectorAll('.lesson-card');

    function filterLessons() {
        const selectedGrade = gradeSelect.value;
        const searchText = searchInput.value.trim();
        let hasVisibleCards = false;

        lessonCards.forEach(card => {
            const cardGrade = card.getAttribute('data-grade');
            const lessonTitle = card.querySelector('h3').textContent;
            const gradeMatch = !selectedGrade || cardGrade === selectedGrade;
            const searchMatch = !searchText || lessonTitle.includes(searchText);

            if (gradeMatch && searchMatch) {
                card.style.display = 'block';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Show "no results" message if no cards are visible
        let noResults = document.querySelector('.no-results');
        if (!hasVisibleCards) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = '<h3>لا توجد دروس متاحة</h3><p>جرب البحث بكلمات مختلفة أو تغيير المرحلة الدراسية</p>';
                lessonsContainer.appendChild(noResults);
            }
            noResults.style.display = 'block';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    }

    gradeSelect.addEventListener('change', filterLessons);
    searchInput.addEventListener('input', filterLessons);

    // إضافة معالجة تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    // استرجاع معلومات المستخدم وملء النموذج
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.name.value = user.name;
            settingsForm.grade.value = user.grade;
        }

        // تحديث المرحلة المختارة في قائمة الدروس
        const gradeSelect = document.getElementById('grade-select');
        if (gradeSelect) {
            gradeSelect.value = user.grade;
            // تفعيل الفلتر تلقائياً
            filterLessons();
        }
    }

    // تحسين معالجة نموذج الإعدادات
    const settingsBtn = document.querySelector('a[href="#settings"]');
    const settingsForm = document.getElementById('settings-form');

    if (settingsBtn && settingsForm) {
        // معالج النقر على زر الإعدادات
        settingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تعبئة النموذج بمعلومات المستخدم الحالية
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            settingsForm.name.value = user.name || '';
            settingsForm.grade.value = user.grade || '';
            // مسح حقول كلمة المرور
            if (settingsForm.currentPassword) settingsForm.currentPassword.value = '';
            if (settingsForm.newPassword) settingsForm.newPassword.value = '';
            if (settingsForm.confirmPassword) settingsForm.confirmPassword.value = '';
            
            // فتح المودال
            openModal('settings-modal');
        });

        // معالج تقديم نموذج الإعدادات
        settingsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(settingsForm);
                const updateData = {
                    name: formData.get('name'),
                    grade: formData.get('grade')
                };

                // معالجة كلمة المرور
                const currentPassword = formData.get('currentPassword');
                const newPassword = formData.get('newPassword');
                const confirmPassword = formData.get('confirmPassword');

                if (currentPassword && newPassword) {
                    if (newPassword !== confirmPassword) {
                        throw new Error('كلمة المرور الجديدة غير متطابقة');
                    }
                    updateData.currentPassword = currentPassword;
                    updateData.newPassword = newPassword;
                }

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('الرجاء إعادة تسجيل الدخول');
                }

                const response = await fetch('http://localhost:3000/api/user/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'حدث خطأ في تحديث المعلومات');
                }

                // تحديث البيانات المحلية
                localStorage.setItem('user', JSON.stringify(data.user));

                // تحديث واجهة المستخدم
                const gradeSelect = document.getElementById('grade-select');
                if (gradeSelect && data.user.grade) {
                    gradeSelect.value = data.user.grade;
                    filterLessons();
                }

                alert('تم تحديث المعلومات بنجاح');
                closeModal('settings-modal');

            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'حدث خطأ أثناء تحديث المعلومات');
            }
        });
    }
});
