class LoginForm {
    constructor() {
        this.selectedRole = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Выбор роли
        document.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectRole(card.dataset.role);
            });
        });

        // Демо-аккаунты
        document.querySelectorAll('.demo-account').forEach(account => {
            account.addEventListener('click', () => {
                this.fillDemoAccount(account.dataset.demoAccount);
            });
        });

        // Отправка формы
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Валидация при вводе
        document.getElementById('username').addEventListener('input', () => {
            this.hideError();
        });

        document.getElementById('password').addEventListener('input', () => {
            this.hideError();
        });
    }

    selectRole(role) {
        // Снимаем выделение со всех карточек
        document.querySelectorAll('.role-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Выделяем выбранную карточку
        document.querySelector(`[data-role="${role}"]`).classList.add('selected');
        
        // Сохраняем выбранную роль
        this.selectedRole = role;
        document.getElementById('role').value = role;

        this.hideError();
    }

    fillDemoAccount(accountType) {
        const demoAccounts = {
            'student': { username: 'student', password: '123', role: 'student' },
            'headman': { username: 'headman', password: '123', role: 'headman' },
            'teacher': { username: 'teacher', password: '123', role: 'teacher' },
            'admin': { username: 'admin', password: '123', role: 'admin' }
        };

        const account = demoAccounts[accountType];
        
        document.getElementById('username').value = account.username;
        document.getElementById('password').value = account.password;
        this.selectRole(account.role);

        this.hideError();
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    hideError() {
        document.getElementById('error-message').classList.remove('show');
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = this.selectedRole;

        // Валидация
        if (!username || !password) {
            this.showError('Заполните все поля');
            return;
        }

        if (!role) {
            this.showError('Выберите роль');
            return;
        }

        // Простая проверка демо-аккаунтов
        const validAccounts = {
            'student': { username: 'student', password: '123' },
            'headman': { username: 'headman', password: '123' },
            'teacher': { username: 'teacher', password: '123' },
            'admin': { username: 'admin', password: '123' }
        };

        const account = validAccounts[role];
        
        if (account && username === account.username && password === account.password) {
            // Успешный вход - отправляем форму
            this.submitForm();
        } else {
            this.showError('Неверный логин или пароль');
        }
    }

    submitForm() {
        const submitBtn = document.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Вход...</span>';
        submitBtn.disabled = true;

        // Отправляем форму через PHP
        document.getElementById('login-form').submit();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});