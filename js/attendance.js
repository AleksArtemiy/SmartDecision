class AttendanceManager {
    constructor() {
        this.students = new Map();
        this.statusCycle = ['default', 'present', 'absent'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        // Обработчики для кликов по студентам
        document.querySelectorAll('.student-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const studentId = e.currentTarget.dataset.id;
                this.toggleStudentStatus(studentId);
            });
        });

        // Быстрые действия
        document.getElementById('mark-all-present').addEventListener('click', () => {
            this.markAll('present');
        });

        document.getElementById('mark-all-absent').addEventListener('click', () => {
            this.markAll('absent');
        });

        document.getElementById('reset-all').addEventListener('click', () => {
            this.resetAll();
        });

        document.getElementById('save-changes').addEventListener('click', () => {
            this.saveChanges();
        });

        // Поиск
        document.querySelector('.search-input').addEventListener('input', (e) => {
            this.filterStudents(e.target.value);
        });
    }

    toggleStudentStatus(studentId) {
        const studentItem = document.querySelector(`[data-id="${studentId}"]`);
        const currentStatus = this.students.get(studentId) || 'default';

        const currentIndex = this.statusCycle.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % this.statusCycle.length;
        const nextStatus = this.statusCycle[nextIndex];

        this.setStudentStatus(studentId, nextStatus);
    }

    setStudentStatus(studentId, status) {
        const studentItem = document.querySelector(`[data-id="${studentId}"]`);
        const statusBadge = studentItem.querySelector('.status-badge');

        studentItem.className = 'student-item ' + status;
        statusBadge.className = 'status-badge ' + status;

        switch(status) {
            case 'present':
                statusBadge.textContent = 'Присутствует';
                break;
            case 'absent':
                statusBadge.textContent = 'Отсутствует';
                break;
            default:
                statusBadge.textContent = 'Не отмечен';
        }

        if (status === 'default') {
            this.students.delete(studentId);
        } else {
            this.students.set(studentId, status);
        }

        this.updateStats();
    }

    markAll(status) {
        document.querySelectorAll('.student-item').forEach(item => {
            const studentId = item.dataset.id;
            this.setStudentStatus(studentId, status);
        });
    }

    resetAll() {
        document.querySelectorAll('.student-item').forEach(item => {
            const studentId = item.dataset.id;
            this.setStudentStatus(studentId, 'default');
        });
    }

    filterStudents(searchTerm) {
        const term = searchTerm.toLowerCase();
        document.querySelectorAll('.student-item').forEach(item => {
            const studentName = item.querySelector('.student-name').textContent.toLowerCase();
            if (studentName.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    updateStats() {
        const presentCount = Array.from(this.students.values()).filter(status => status === 'present').length;
        const absentCount = Array.from(this.students.values()).filter(status => status === 'absent').length;
        const totalCount = document.querySelectorAll('.student-item').length;

        document.getElementById('present-count').textContent = presentCount;
        document.getElementById('absent-count').textContent = absentCount;
        document.getElementById('total-count').textContent = totalCount;
    }

    saveChanges() {
        const data = Object.fromEntries(this.students);
        console.log('Сохраненные данные:', data);
        alert(`Данные сохранены!\nПрисутствуют: ${Array.from(this.students.values()).filter(s => s === 'present').length}\nОтсутствуют: ${Array.from(this.students.values()).filter(s => s === 'absent').length}`);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AttendanceManager();
});