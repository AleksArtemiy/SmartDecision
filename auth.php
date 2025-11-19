<?php
session_start();

// Демо-аккаунты
$validAccounts = [
    'student' => ['username' => 'student', 'password' => '123', 'page' => 'student.php'],
    'headman' => ['username' => 'headman', 'password' => '123', 'page' => 'index.php'],
    'teacher' => ['username' => 'teacher', 'password' => '123', 'page' => 'teacher.php'],
    'admin' => ['username' => 'admin', 'password' => '123', 'page' => 'admin.php']
];

if ($_POST) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';
    
    if (isset($validAccounts[$role])) {
        $account = $validAccounts[$role];
        
        if ($username === $account['username'] && $password === $account['password']) {
            // Успешный вход
            $_SESSION['user'] = [
                'username' => $username,
                'role' => $role
            ];
            header('Location: ' . $account['page']);
            exit;
        }
    }
    
    // Неудачный вход
    header('Location: login.php?error=1');
    exit;
}
?>