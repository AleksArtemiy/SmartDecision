class AttendanceManager {
    constructor() {
        this.students = new Map();
        this.statusCycle = ['default', 'present', 'absent'];
        this.canEdit = window.canEdit || false;
        this.lectureData = window.lectureData || {};
        this.init();
    }

    init() {
        this.renderStudents();
        this.setupEventListeners();
        this.updateLectureInfo();
        this.updateStats();
    }

    renderStudents() {
        const studentsList = document.getElementById('students-list');

        // Данные студентов (в реальном приложении - с сервера)
        const studentsData = [
            { id: 1, name: "Иванов Алексей Сергеевич", studentId: "201001", status: "present" },
            { id: 2, name: "Петрова Мария Константиновна", studentId: "201002", status: "present" },
            { id: 3, name: "Сидоров Владимир Петрович", studentId: "201003", status: "absent" },
            { id: 4, name: "Козлова Анна Дмитриевна", studentId: "201004", status: "present" },
            { id: 5, name: "Николаев Дмитрий Андреевич", studentId: "201005", status: "present" },
            { id: 6, name: "Орлова Екатерина Сергеевна", studentId: "201006", status: "absent" },
            { id: 7, name: "Федоров Максим Викторович", studentId: "201007", status: "present" },
            { id: 8, name: "Семенова Ирина Олеговна", studentId: "201008", status: "present" }
        ];

        studentsList.innerHTML = studentsData.map(student => {
            const clickableClass = this.canEdit ? 'editable' : 'view-only';
            const title = this.canEdit ? 'Кликните для изменения статуса' : 'Режим просмотра';

            return `
                <div class="student-item ${student.status} ${clickableClass}" 
                     data-id="${student.id}"
                     title="${title}">
                    <div class="student-info">
                        <span class="student-name">${student.name}</span>
                        <span class="student-id">№ ${student.studentId}</span>
                    </div>
                    <div class="status-badge ${student.status}">
                        ${this.getStatusText(student.status)}
                    </div>
                </div>
            `;
        }).join('');

        // Заполняем Map начальными данными
        studentsData.forEach(student => {
            if (student.status !== 'default') {
                this.students.set(student.id.toString(), student.status);
            }
        });
    }

    getStatusText(status) {
        switch(status) {
            case 'present': return '✅ Присутствовал';
            case 'absent': return '❌ Отсутствовал';
            default: return '⏺️ Не отмечен';
        }
    }

    updateLectureInfo() {
        if (this.lectureData.name) {
            document.getElementById('lecture-title').textContent = this.lectureData.name;
            document.getElementById('lecture-time').textContent =
                `${this.lectureData.time} • Аудитория ${this.lectureData.room}`;
            document.getElementById('lecture-details').textContent =
                `Преподаватель: ${this.lectureData.teacher} • Группа: ПИ-201`;
        }
    }

    setupEventListeners() {
        // Обработчики для кликов по студентам (только в режиме редактирования)
        if (this.canEdit) {
            document.addEventListener('click', (e) => {
                const studentItem = e.target.closest('.student-item.editable');
                if (studentItem) {
                    const studentId = studentItem.dataset.id;
                    this.toggleStudentStatus(studentId);
                }
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
        } else {
            // В режиме просмотра добавляем информационные сообщения при клике
            document.addEventListener('click', (e) => {
                const studentItem = e.target.closest('.student-item.view-only');
                if (studentItem) {
                    this.showViewNotification();
                }
            });
        }
    }

    toggleStudentStatus(studentId) {
        if (!this.canEdit) return;

        const studentItem = document.querySelector(`[data-id="${studentId}"]`);
        const currentStatus = this.students.get(studentId) || 'default';

        const currentIndex = this.statusCycle.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % this.statusCycle.length;
        const nextStatus = this.statusCycle[nextIndex];

        this.setStudentStatus(studentId, nextStatus);
    }

    setStudentStatus(studentId, status) {
        if (!this.canEdit) return;

        const studentItem = document.querySelector(`[data-id="${studentId}"]`);
        const statusBadge = studentItem.querySelector('.status-badge');

        // Обновляем классы
        studentItem.className = `student-item ${status} editable`;
        statusBadge.className = `status-badge ${status}`;
        statusBadge.textContent = this.getStatusText(status);

        // Обновляем данные
        if (status === 'default') {
            this.students.delete(studentId);
        } else {
            this.students.set(studentId, status);
        }

        this.updateStats();
    }

    markAll(status) {
        if (!this.canEdit) return;

        document.querySelectorAll('.student-item').forEach(item => {
            const studentId = item.dataset.id;
            this.setStudentStatus(studentId, status);
        });
    }

    resetAll() {
        if (!this.canEdit) return;

        document.querySelectorAll('.student-item').forEach(item => {
            const studentId = item.dataset.id;
            this.setStudentStatus(studentId, 'default');
        });
    }

    filterStudents(searchTerm) {
        if (!this.canEdit) return;

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
        if (!this.canEdit) return;

        const data = Object.fromEntries(this.students);
        console.log('Сохраненные данные:', data);

        this.showNotification(
            `Данные сохранены!<br>
            Присутствуют: ${Array.from(this.students.values()).filter(s => s === 'present').length}<br>
            Отсутствуют: ${Array.from(this.students.values()).filter(s => s === 'absent').length}`,
            'success'
        );
    }

    showViewNotification() {
        this.showNotification('Режим просмотра. Редактирование недоступно для прошедших пар.', 'info');
    }

    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;

        document.body.appendChild(notification);

        // Показываем с анимацией
        setTimeout(() => notification.classList.add('show'), 100);

        // Убираем через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Функция выхода из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AttendanceManager();
});