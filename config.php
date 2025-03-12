<?php
$db_host = getenv('DB_HOST') ?: 'sql310.infinityfree.com';
$dbname = getenv('DB_USER') ?: 'if0_38355218_educational';
$username = getenv('DB_NAME') ?: 'if0_38355218';
$password = getenv('DB_PASS') ?: 'xCCiVb4PVgpE6';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    error_log("Connection failed: " . $e->getMessage());
    die("Database connection failed");
}
