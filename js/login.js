// Данные демо-аккаунтов
const demoAccounts = {
    'student': { username: 'student', password: '123', role: 'student', icon: '👨‍🎓', text: 'Студент' },
    'headman': { username: 'headman', password: '123', role: 'headman', icon: '👥', text: 'Староста' },
    'teacher': { username: 'teacher', password: '123', role: 'teacher', icon: '👨‍🏫', text: 'Преподаватель' },
    'admin': { username: 'admin', password: '123', role: 'admin', icon: '⚙️', text: 'Администратор' }
};

class LoginForm {
    constructor() {
        this.init();
    }

    init() {
        this.setupDemoAccounts();
        this.setupFormValidation();
        this.setupRealTimeRoleDetection(); // ← ДОБАВЛЕНО: определение роли в реальном времени
        this.showServerErrors();
    }

    // ДОБАВЛЕНО: Определение роли в реальном времени при вводе
    setupRealTimeRoleDetection() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        // Определяем роль при изменении логина
        usernameInput.addEventListener('input', () => {
            const username = usernameInput.value.trim();
            this.detectAndShowRole(username);
        });

        // Также определяем роль при изменении пароля (на случай копирования)
        passwordInput.addEventListener('input', () => {
            const username = usernameInput.value.trim();
            if (username) {
                this.detectAndShowRole(username);
            }
        });

        // Определяем роль при загрузке страницы, если поля уже заполнены
        if (usernameInput.value.trim()) {
            this.detectAndShowRole(usernameInput.value.trim());
        }
    }

    // ДОБАВЛЕНО: Функция определения и показа роли
    detectAndShowRole(username) {
        const roleData = this.determineRoleData(username);

        if (roleData) {
            this.showSelectedRole(roleData.icon, roleData.text);
            document.getElementById('role').value = roleData.role;
        } else {
            // Скрываем блок с ролью, если не удалось определить
            const selectedRole = document.getElementById('selected-role');
            selectedRole.style.display = 'none';
        }
    }

    // ДОБАВЛЕНО: Полное определение данных роли
    determineRoleData(username) {
        // Проверяем демо-аккаунты
        if (demoAccounts[username]) {
            return demoAccounts[username];
        }

        // Логика для определения роли по паттерну логина
        if (username.includes('admin') || username.includes('админ') || username.includes('деканат')) {
            return { role: 'admin', icon: '⚙️', text: 'Администратор' };
        }
        if (username.includes('teacher') || username.includes('prep') || username.includes('преп') || username.includes('учитель')) {
            return { role: 'teacher', icon: '👨‍🏫', text: 'Преподаватель' };
        }
        if (username.includes('headman') || username.includes('starosta') || username.includes('староста')) {
            return { role: 'headman', icon: '👥', text: 'Староста' };
        }
        if (username.includes('student') || username.includes('stud') || username.includes('студ') || username.includes('ученик')) {
            return { role: 'student', icon: '👨‍🎓', text: 'Студент' };
        }

        return null;
    }

    showServerErrors() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv && errorDiv.textContent.trim()) {
            errorDiv.style.display = 'block';

            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    setupDemoAccounts() {
        document.querySelectorAll('.demo-account').forEach(account => {
            account.addEventListener('click', () => {
                const accountType = account.dataset.demoAccount;
                const demoData = demoAccounts[accountType];

                if (demoData) {
                    // Заполняем форму
                    document.getElementById('username').value = demoData.username;
                    document.getElementById('password').value = demoData.password;
                    document.getElementById('role').value = demoData.role;

                    // Показываем выбранную роль
                    this.showSelectedRole(demoData.icon, demoData.text);

                    // Показываем сообщение
                    this.showAutoFillMessage(`Заполнены данные для ${demoData.text.toLowerCase()}а`);
                }
            });
        });
    }

    showSelectedRole(icon, text) {
        const selectedRole = document.getElementById('selected-role');
        const roleIcon = document.getElementById('role-icon');
        const roleText = document.getElementById('role-text');

        roleIcon.textContent = icon;
        roleText.textContent = text;
        selectedRole.style.display = 'block';
    }

    showAutoFillMessage(message) {
        const tempMessage = document.createElement('div');
        tempMessage.className = 'error-message';
        tempMessage.style.background = 'var(--success-light)';
        tempMessage.style.color = 'var(--success)';
        tempMessage.style.borderColor = 'var(--success-border)';
        tempMessage.textContent = message;

        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.parentNode.insertBefore(tempMessage, errorMessage.nextSibling);

            setTimeout(() => {
                tempMessage.remove();
            }, 3000);
        }
    }

    setupFormValidation() {
        const form = document.getElementById('login-form');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        form.addEventListener('submit', (e) => {
            // Скрываем предыдущие ошибки
            this.hideError();

            // Базовая валидация
            if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
                e.preventDefault();
                this.showError('Заполните все поля');
                return;
            }

            // Валидация длины пароля
            if (passwordInput.value.length < 3) {
                e.preventDefault();
                this.showError('Пароль должен содержать минимум 3 символа');
                return;
            }

            // ДОБАВЛЕНО: Убеждаемся, что роль определена
            const username = usernameInput.value.trim();
            const roleData = this.determineRoleData(username);
            if (roleData) {
                document.getElementById('role').value = roleData.role;
            } else {
                // Если роль не определена, используем студента по умолчанию
                document.getElementById('role').value = 'student';
            }

            // Показываем индикатор загрузки
            this.showLoading(true);
        });

        // Скрываем ошибки при изменении данных
        usernameInput.addEventListener('input', () => {
            this.hideError();
        });

        passwordInput.addEventListener('input', () => {
            this.hideError();
        });
    }

    showError(message) {
        let errorDiv = document.getElementById('error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.className = 'error-message';
            document.querySelector('.logo').after(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    showLoading(show) {
        const submitBtn = document.querySelector('#login-form .btn');
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Вход...</span><span>⏳</span>';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Войти в систему</span><span>→</span>';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});