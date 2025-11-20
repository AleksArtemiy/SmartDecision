<?php
session_start();

if (isset($_SESSION['user'])) {
    $role = $_SESSION['user']['role'];
    $redirects = [
        'student' => 'student/student.php',
        'headman' => 'headmen/headmen.php',
        'teacher' => 'teacher/teacher.php',
        'admin' => 'admin/admin.php'
    ];

    if (isset($redirects[$role])) {
        header('Location: ' . $redirects[$role]);
        exit();
    }
}

// Тестовые данные пользователей
$users = [
    'student' => [
        'password' => '123',
        'role' => 'student',
        'redirect' => 'student/student.php',
        'name' => 'Иванов А.С. (Студент)'
    ],
    'headman' => [
        'password' => '123',
        'role' => 'headman',
        'redirect' => 'headmen/headmen.php',
        'name' => 'Петров И.С. (Староста)'
    ],
    'teacher' => [
        'password' => '123',
        'role' => 'teacher',
        'redirect' => 'teacher/teacher.php',
        'name' => 'Иванова А.С. (Преподаватель)'
    ],
    'admin' => [
        'password' => '123',
        'role' => 'admin',
        'redirect' => 'admin/admin.php',
        'name' => 'Деканат (Администратор)'
    ]
];

// Получаем данные из формы
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Проверяем существование пользователя
if (!array_key_exists($username, $users)) {
    // Пользователь не найден
    $_SESSION['error'] = 'Обратитесь в поддержку для добавления';
    header('Location: index.php');
    exit();
}

// Проверяем пароль
if ($users[$username]['password'] !== $password) {
    // Неверный пароль
    $_SESSION['error'] = 'Неверный пароль';
    header('Location: index.php');
    exit();
}

// Успешная авторизация
$_SESSION['user'] = [
    'username' => $username,
    'role' => $users[$username]['role'],
    'name' => $users[$username]['name']
];

// Перенаправляем на соответствующую страницу
header('Location: ' . $users[$username]['redirect']);
exit();
?>