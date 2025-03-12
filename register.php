<?php session_start(); ?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>إنشاء حساب جديد</title>
    <link rel="stylesheet" href="auth-style.css">
</head>
<body>
    <div class="auth-container">
        <form class="auth-form" method="POST" action="auth.php">
            <h2>إنشاء حساب جديد</h2>
            <?php if(isset($_GET['error'])): ?>
                <div class="error"><?php echo htmlspecialchars($_GET['error']); ?></div>
            <?php endif; ?>
            
            <div class="form-group">
                <label>اسم المستخدم</label>
                <input type="text" name="username" required>
            </div>
            
            <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label>كلمة المرور</label>
                <input type="password" name="password" required>
            </div>
            
            <div class="form-group">
                <label>تأكيد كلمة المرور</label>
                <input type="password" name="confirm_password" required>
            </div>
            
            <button type="submit" name="register">تسجيل</button>
            <p>لديك حساب؟ <a href="login.php">سجل دخول</a></p>
        </form>
    </div>
</body>
</html>
