<?php
session_start();
require_once 'config.php';

// معالجة تسجيل الدخول
if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        header("Location: index.html");
        exit();
    } else {
        header("Location: login.php?error=بيانات الدخول غير صحيحة");
        exit();
    }
}

// معالجة التسجيل
if (isset($_POST['register'])) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    if ($password !== $confirm_password) {
        header("Location: register.php?error=كلمات المرور غير متطابقة");
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, password_hash($password, PASSWORD_DEFAULT)]);
        header("Location: login.php?success=تم إنشاء الحساب بنجاح");
        exit();
    } catch(PDOException $e) {
        header("Location: register.php?error=اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل");
        exit();
    }
}

// تسجيل الخروج
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: login.php");
    exit();
}
?>
