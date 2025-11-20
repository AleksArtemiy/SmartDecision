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
            // Базовая валидация
            if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
                e.preventDefault();
                this.showError('Заполните все поля');
                return;
            }

            // Определяем роль на основе логина
            const username = usernameInput.value.trim();
            const role = this.determineRole(username);
            document.getElementById('role').value = role;
        });

        // Скрываем блок с ролью при изменении логина
        usernameInput.addEventListener('input', () => {
            const selectedRole = document.getElementById('selected-role');
            selectedRole.style.display = 'none';
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
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});