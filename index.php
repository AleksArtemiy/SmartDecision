<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал 2.0 - Вход в систему</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/login.css">
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>Журнал 2.0</h1>
            <p>Система учета посещаемости</p>
        </div>

        <div class="error-message" id="error-message">
            Неверный логин или пароль
        </div>

        <form id="login-form" action="auth.php" method="POST">
            <div class="form-group">
                <label class="form-label" for="username">Логин</label>
                <input type="text" id="username" name="username" class="form-input" placeholder="Введите ваш логин" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="password">Пароль</label>
                <input type="password" id="password" name="password" class="form-input" placeholder="Введите ваш пароль" required>
            </div>

            <div class="form-group">
                <label class="form-label">Роль</label>
                <div class="role-cards">
                    <div class="role-card" data-role="student">
                        <div class="role-icon">🎓</div>
                        <div class="role-name">Студент</div>
                    </div>
                    <div class="role-card" data-role="headman">
                        <div class="role-icon">👥</div>
                        <div class="role-name">Староста</div>
                    </div>
                    <div class="role-card" data-role="teacher">
                        <div class="role-icon">👨‍🏫</div>
                        <div class="role-name">Преподаватель</div>
                    </div>
                    <div class="role-card" data-role="admin">
                        <div class="role-icon">⚙️</div>
                        <div class="role-name">Администратор</div>
                    </div>
                </div>
                <input type="hidden" id="role" name="role" required>
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

    <script src="assets/js/login.js"></script>
</body>
</html>