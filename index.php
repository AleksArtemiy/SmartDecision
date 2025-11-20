<?php
session_start();
// Очищаем ошибку после показа
$error = $_SESSION['error'] ?? '';
unset($_SESSION['error']);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал 2.0 - Вход в систему</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/index_styles.css">
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>Журнал 2.0</h1>
            <p>Система учета посещаемости</p>
        </div>

        <?php if ($error): ?>
        <div class="error-message" id="error-message">
            <?php echo htmlspecialchars($error); ?>
        </div>
        <?php endif; ?>

        <form id="login-form" action="auth.php" method="POST">
            <input type="hidden" id="role" name="role" value="">
            
            <div class="form-group">
                <label class="form-label" for="username">Логин</label>
                <input type="text" id="username" name="username" class="form-input" placeholder="Введите ваш логин" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="password">Пароль</label>
                <input type="password" id="password" name="password" class="form-input" placeholder="Введите ваш пароль" required>
            </div>

            <!-- Блок с выбранной ролью -->
            <div class="selected-role" id="selected-role" style="display: none;">
                <div class="role-info">
                    <span class="role-label">Ваша роль:</span>
                    <span class="role-value">
                        <span id="role-icon">🎓</span>
                        <span id="role-text">Студент</span>
                    </span>
                </div>
            </div>

            <button type="submit" class="btn btn-primary">
                <span>Войти в систему</span>
                <span>→</span>
            </button>
        </form>

        <div class="forgot-password">
            <a href="#">Забыли пароль?</a>
        </div>

        <div class="demo-accounts">
            <div class="demo-title">Демо-аккаунты для тестирования:</div>
            
            <div class="demo-account" data-demo-account="student">
                <div class="demo-role">👨‍🎓 Студент</div>
                <div class="demo-info">Логин: student | Пароль: 123</div>
            </div>
            
            <div class="demo-account" data-demo-account="headman">
                <div class="demo-role">👥 Староста</div>
                <div class="demo-info">Логин: headman | Пароль: 123</div>
            </div>
            
            <div class="demo-account" data-demo-account="teacher">
                <div class="demo-role">👨‍🏫 Преподаватель</div>
                <div class="demo-info">Логин: teacher | Пароль: 123</div>
            </div>
            
            <div class="demo-account" data-demo-account="admin">
                <div class="demo-role">⚙️ Администратор</div>
                <div class="demo-info">Логин: admin | Пароль: 123</div>
            </div>
        </div>
    </div>
    <script src="js/login.js"></script>
</body>
</html>