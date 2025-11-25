// Журнал оценивания
class GradingJournal {
    constructor() {
        this.lectureData = null;
        this.studentsData = {};
        this.grades = {};
        this.init();
    }

    init() {
        this.loadLectureData();
        this.renderStudentsList();
        this.setupEventListeners();
    }

    loadLectureData() {
        const savedData = sessionStorage.getItem('gradingLectureData');
        if (savedData) {
            this.lectureData = JSON.parse(savedData);
            this.updateLectureInfo();
        } else {
            alert('Данные о паре не найдены. Возврат к расписанию.');
            window.location.href = 'teacher.php';
        }
    }

    updateLectureInfo() {
        const title = document.getElementById('grading-title');
        const info = document.getElementById('lecture-info');

        title.textContent = `Оценивание: ${this.lectureData.name}`;
        info.innerHTML = `
            <div class="info-grid">
                <div class="info-item">
                    <strong>Дата:</strong> ${this.lectureData.day}, ${this.lectureData.time}
                </div>
                <div class="info-item">
                    <strong>Аудитория:</strong> ${this.lectureData.room}
                </div>
                <div class="info-item">
                    <strong>Тип:</strong> ${this.lectureData.type || 'Не указан'}
                </div>
                <div class="info-item">
                    <strong>Группы:</strong> ${this.lectureData.groups.join(', ')}
                </div>
            </div>
        `;

        // Загружаем данные студентов
        this.loadStudentsData();
    }

    loadStudentsData() {
        // В реальном приложении здесь был бы AJAX запрос к серверу
        // Для демо используем тестовые данные
        this.lectureData.groups.forEach(groupName => {
            if (window.studentsData && window.studentsData[groupName]) {
                this.studentsData[groupName] = window.studentsData[groupName];
            } else {
                // Заглушка для демо
                this.studentsData[groupName] = [
                    { id: 1, name: "Студент 1", group: groupName },
                    { id: 2, name: "Студент 2", group: groupName },
                    { id: 3, name: "Студент 3", group: groupName }
                ];
            }
        });
    }

    renderStudentsList() {
        const container = document.getElementById('students-grading-list');
        let allStudents = [];

        // Собираем всех студентов
        Object.keys(this.studentsData).forEach(groupName => {
            this.studentsData[groupName].forEach(student => {
                allStudents.push({
                    ...student,
                    group: groupName
                });
            });
        });

        container.innerHTML = allStudents.map(student => `
            <div class="student-grade-item" data-id="${student.id}" data-group="${student.group}">
                <div class="student-info">
                    <strong>${student.name}</strong>
                    <small>${student.group}</small>
                </div>
                <div class="grade-inputs">
                    <input type="number" 
                           class="grade-input" 
                           placeholder="0" 
                           min="0" 
                           max="100"
                           value="${this.grades[`${student.group}-${student.id}`] || ''}">
                    <span class="max-grade">/ <span id="max-grade-value">5</span></span>
                </div>
                <div class="grade-status" id="grade-status-${student.group}-${student.id}">
                    ${this.grades[`${student.group}-${student.id}`] ? '✅ Оценено' : '⏳ Ожидает'}
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        document.getElementById('apply-grades').addEventListener('click', () => {
            this.applyGradeSettings();
        });

        document.getElementById('save-grades').addEventListener('click', () => {
            this.saveAllGrades();
        });

        // Обновление максимального балла
        document.getElementById('max-grade').addEventListener('change', () => {
            this.updateMaxGradeDisplay();
        });
    }

    applyGradeSettings() {
        const gradeType = document.getElementById('grade-type').value;
        const maxGrade = parseInt(document.getElementById('max-grade').value);
        
        this.updateMaxGradeDisplay();
        
        this.showNotification(`Настройки применены: ${gradeType}, макс. балл: ${maxGrade}`, 'success');
    }

    updateMaxGradeDisplay() {
        const maxGrade = document.getElementById('max-grade').value;
        document.querySelectorAll('.max-grade span').forEach(span => {
            span.textContent = maxGrade;
        });
    }

    saveAllGrades() {
        const gradeInputs = document.querySelectorAll('.grade-input');
        let savedCount = 0;

        gradeInputs.forEach(input => {
            const studentItem = input.closest('.student-grade-item');
            const studentId = studentItem.dataset.id;
            const groupName = studentItem.dataset.group;
            const grade = input.value.trim();

            if (grade) {
                this.grades[`${groupName}-${studentId}`] = parseInt(grade);
                const statusElement = document.getElementById(`grade-status-${groupName}-${studentId}`);
                statusElement.textContent = '✅ Оценено';
                statusElement.style.color = 'var(--success)';
                savedCount++;
            }
        });

        this.showNotification(`Сохранено оценок: ${savedCount}`, 'success');
        
        // В реальном приложении здесь был бы AJAX запрос к серверу
        console.log('Оценки сохранены:', this.grades);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Загрузка данных студентов (в реальном приложении с сервера)
const studentsData = {
    "ПИ-201": [
        { id: 1, name: "Иванов Алексей" },
        { id: 2, name: "Петрова Мария" },
        { id: 3, name: "Сидоров Владимир" },
        { id: 4, name: "Козлова Анна" }
    ],
    "ПИ-202": [
        { id: 1, name: "Орлова Екатерина" },
        { id: 2, name: "Федоров Максим" },
        { id: 3, name: "Семенова Ирина" },
        { id: 4, name: "Волков Андрей" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    new GradingJournal();
});

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}