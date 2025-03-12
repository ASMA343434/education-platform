<?php session_start(); ?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>تسجيل الدخول</title>
    <link rel="stylesheet" href="auth-style.css">
</head>
<body>
    <div class="auth-container">
        <form class="auth-form" method="POST" action="auth.php">
            <h2>تسجيل الدخول</h2>
            <?php if(isset($_GET['error'])): ?>
                <div class="error"><?php echo htmlspecialchars($_GET['error']); ?></div>
            <?php endif; ?>
            
            <div class="form-group">
                <label>اسم المستخدم</label>
                <input type="text" name="username" required>
            </div>
            
            <div class="form-group">
                <label>كلمة المرور</label>
                <input type="password" name="password" required>
            </div>
            
            <button type="submit" name="login">دخول</button>
            <p>ليس لديك حساب؟ <a href="register.php">سجل الآن</a></p>
        </form>
    </div>
</body>
</html>
