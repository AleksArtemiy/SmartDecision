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
        this.showServerErrors(); // ← ДОБАВЛЕНО: показ ошибок от сервера
    }

    // ДОБАВЛЕНО: Показ ошибок, переданных от сервера
    showServerErrors() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv && errorDiv.textContent.trim()) {
            // Если есть сообщение об ошибке от сервера, показываем его
            errorDiv.style.display = 'block';

            // Автоматически скрываем ошибку через 5 секунд
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
        // Создаем временное сообщение
        const tempMessage = document.createElement('div');
        tempMessage.className = 'error-message';
        tempMessage.style.background = 'var(--success-light)';
        tempMessage.style.color = 'var(--success)';
        tempMessage.style.borderColor = 'var(--success-border)';
        tempMessage.textContent = message;

        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.parentNode.insertBefore(tempMessage, errorMessage.nextSibling);

            // Удаляем сообщение через 3 секунды
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

            // ДОБАВЛЕНО: Валидация длины пароля
            if (passwordInput.value.length < 3) {
                e.preventDefault();
                this.showError('Пароль должен содержать минимум 3 символа');
                return;
            }

            // Определяем роль на основе логина
            const username = usernameInput.value.trim();
            const role = this.determineRole(username);
            document.getElementById('role').value = role;

            // ДОБАВЛЕНО: Показываем индикатор загрузки
            this.showLoading(true);
        });

        // Скрываем блок с ролью при изменении логина
        usernameInput.addEventListener('input', () => {
            const selectedRole = document.getElementById('selected-role');
            selectedRole.style.display = 'none';
            this.hideError(); // Скрываем ошибки при изменении данных
        });

        passwordInput.addEventListener('input', () => {
            this.hideError(); // Скрываем ошибки при изменении данных
        });
    }

    determineRole(username) {
        if (demoAccounts[username]) {
            return demoAccounts[username].role;
        }

        // Логика для определения роли по паттерну логина
        if (username.includes('admin')) return 'admin';
        if (username.includes('teacher') || username.includes('prep')) return 'teacher';
        if (username.includes('headman') || username.includes('starosta')) return 'headman';
        return 'student';
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

        // Автоматически скрываем ошибку через 5 секунд
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    // ДОБАВЛЕНО: Скрытие ошибки
    hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    // ДОБАВЛЕНО: Показ индикатора загрузки
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