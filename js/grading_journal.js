// Таблица успеваемости в стиле Excel
class GradingTable {
    constructor() {
        this.currentSubject = 'Математический анализ';
        this.currentGroup = 'ПИ-201';
        this.currentStudent = null;
        this.currentLecture = null;
        this.init();
    }

    init() {
        this.renderTable();
        this.setupEventListeners();
    }

    getLecturesForSubject() {
        const lectures = [];
        const weekSchedule = scheduleData[Object.keys(scheduleData)[0]];
        
        Object.keys(weekSchedule).forEach(day => {
            const daySchedule = weekSchedule[day];
            Object.keys(daySchedule).forEach(time => {
                const lecture = daySchedule[time];
                if (lecture.name === this.currentSubject && 
                    lecture.groups.includes(this.currentGroup)) {
                    lectures.push({
                        ...lecture,
                        day,
                        time,
                        key: `${lecture.date}-${time}`
                    });
                }
            });
        });

        // Сортируем по дате
        return lectures.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    renderTable() {
        const lectures = this.getLecturesForSubject();
        const students = studentsData[this.currentGroup] || [];
        
        this.renderTableHeader(lectures);
        this.renderTableBody(students, lectures);
    }

    renderTableHeader(lectures) {
        const thead = document.querySelector('#grading-table thead');
        const firstRow = thead.querySelector('tr:first-child');
        const secondRow = thead.querySelector('tr:last-child');

        // Очищаем существующие заголовки (кроме первого столбца)
        firstRow.innerHTML = '<th rowspan="2" class="student-col">Студент</th>';
        secondRow.innerHTML = '';

        lectures.forEach(lecture => {
            // Основной заголовок - дата
            const mainTh = document.createElement('th');
            mainTh.colSpan = 2;
            mainTh.className = 'lecture-header';
            mainTh.textContent = this.formatDate(lecture.date);
            firstRow.appendChild(mainTh);

            // Подзаголовки - тип занятия
            const typeTh1 = document.createElement('th');
            typeTh1.className = 'lecture-subheader attendance-header';
            typeTh1.textContent = 'Посещение';
            secondRow.appendChild(typeTh1);

            const typeTh2 = document.createElement('th');
            typeTh2.className = 'lecture-subheader grade-header';
            typeTh2.textContent = 'Оценка';
            secondRow.appendChild(typeTh2);
        });
    }

    renderTableBody(students, lectures) {
        const tbody = document.getElementById('grading-table-body');
        tbody.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            
            // Колонка с именем студента
            const nameCell = document.createElement('td');
            nameCell.className = 'student-name';
            nameCell.textContent = student.name;
            row.appendChild(nameCell);

            // Данные по каждому занятию
            lectures.forEach(lecture => {
                const lectureKey = lecture.key;
                const studentAttendance = this.getStudentAttendance(student, lecture);
                const studentGrade = student.grades ? student.grades[lectureKey] : null;

                // Ячейка посещаемости
                const attendanceCell = document.createElement('td');
                attendanceCell.className = `attendance-cell ${studentAttendance}`;
                attendanceCell.innerHTML = this.getAttendanceIcon(studentAttendance);
                attendanceCell.title = this.getAttendanceText(studentAttendance);
                row.appendChild(attendanceCell);

                // Ячейка оценки
                const gradeCell = document.createElement('td');
                gradeCell.className = `grade-cell ${studentGrade ? 'has-grade' : 'no-grade'}`;
                if (studentGrade) {
                    gradeCell.innerHTML = `
                        <div class="grade-display ${this.getGradeColor(studentGrade.grade)}"
                             data-student-id="${student.id}"
                             data-lecture-key="${lectureKey}">
                            ${studentGrade.grade}
                            <small>${this.getGradeTypeText(studentGrade.type)}</small>
                        </div>
                    `;
                } else {
                    gradeCell.innerHTML = `
                        <div class="grade-display empty"
                             data-student-id="${student.id}"
                             data-lecture-key="${lectureKey}">
                            +
                        </div>
                    `;
                }
                gradeCell.title = studentGrade ? 
                    `Оценка: ${studentGrade.grade} (${this.getGradeTypeText(studentGrade.type)})` : 
                    'Добавить оценку';
                row.appendChild(gradeCell);
            });

            tbody.appendChild(row);
        });
    }

    getStudentAttendance(student, lecture) {
        // В реальном приложении здесь была бы логика получения посещаемости
        // Для демо используем статус из данных студента
        return student.status;
    }

    getAttendanceIcon(attendance) {
        switch(attendance) {
            case 'present': return '✅';
            case 'absent': return '❌';
            case 'partial': return '⚠️';
            default: return '❓';
        }
    }

    getAttendanceText(attendance) {
        switch(attendance) {
            case 'present': return 'Присутствовал';
            case 'absent': return 'Отсутствовал';
            case 'partial': return 'Частично присутствовал';
            default: return 'Неизвестно';
        }
    }

    getGradeColor(grade) {
        if (grade >= 9) return 'excellent';
        if (grade >= 7) return 'good';
        if (grade >= 5) return 'average';
        return 'poor';
    }

    getGradeTypeText(type) {
        const types = {
            'homework': 'ДЗ',
            'test': 'Тест',
            'activity': 'Актив.',
            'project': 'Проект',
            'exam': 'Экзамен'
        };
        return types[type] || type;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
        });
    }

    setupEventListeners() {
        // Фильтры
        document.getElementById('apply-filters').addEventListener('click', () => {
            this.currentSubject = document.getElementById('subject-select').value;
            this.currentGroup = document.getElementById('group-select').value;
            this.renderTable();
        });

        // Клики по ячейкам оценок
        document.addEventListener('click', (e) => {
            const gradeDisplay = e.target.closest('.grade-display');
            if (gradeDisplay) {
                this.openGradeEditor(gradeDisplay);
            }
        });

        // Модальное окно редактирования оценки
        document.getElementById('close-grade-modal').addEventListener('click', () => {
            this.closeGradeEditor();
        });

        document.getElementById('cancel-grade').addEventListener('click', () => {
            this.closeGradeEditor();
        });

        document.getElementById('save-grade').addEventListener('click', () => {
            this.saveGrade();
        });

        document.getElementById('delete-grade').addEventListener('click', () => {
            this.deleteGrade();
        });
    }

    openGradeEditor(gradeDisplay) {
        const studentId = gradeDisplay.dataset.studentId;
        const lectureKey = gradeDisplay.dataset.lectureKey;
        
        const student = studentsData[this.currentGroup].find(s => s.id == studentId);
        const lecture = this.getLectureByKey(lectureKey);
        
        if (!student || !lecture) return;

        this.currentStudent = student;
        this.currentLecture = lecture;

        const modal = document.getElementById('grade-edit-modal');
        const title = document.getElementById('grade-edit-title');
        const studentInfo = document.getElementById('grade-student-info');
        const lectureInfo = document.getElementById('grade-lecture-info');
        const gradeValue = document.getElementById('grade-value');
        const gradeType = document.getElementById('grade-type');

        title.textContent = `Оценка: ${lecture.name}`;
        studentInfo.innerHTML = `<strong>Студент:</strong> ${student.name}`;
        lectureInfo.innerHTML = `
            <strong>Занятие:</strong> ${this.formatDate(lecture.date)} ${lecture.time}<br>
            <strong>Тип:</strong> ${lecture.type}
        `;

        // Заполняем текущие значения
        const currentGrade = student.grades && student.grades[lectureKey];
        if (currentGrade) {
            gradeValue.value = currentGrade.grade;
            gradeType.value = currentGrade.type;
        } else {
            gradeValue.value = '';
            gradeType.value = 'homework';
        }

        modal.classList.add('active');
    }

    getLectureByKey(lectureKey) {
        const lectures = this.getLecturesForSubject();
        return lectures.find(lecture => lecture.key === lectureKey);
    }

    closeGradeEditor() {
        document.getElementById('grade-edit-modal').classList.remove('active');
        this.currentStudent = null;
        this.currentLecture = null;
    }

    saveGrade() {
        if (!this.currentStudent || !this.currentLecture) return;

        const gradeValue = document.getElementById('grade-value').value;
        const gradeType = document.getElementById('grade-type').value;

        if (!gradeValue) {
            alert('Введите оценку');
            return;
        }

        const grade = parseInt(gradeValue);
        if (grade < 0 || grade > 100) {
            alert('Оценка должна быть от 0 до 100');
            return;
        }

        // Сохраняем оценку
        if (!this.currentStudent.grades) {
            this.currentStudent.grades = {};
        }

        this.currentStudent.grades[this.currentLecture.key] = {
            grade: grade,
            type: gradeType
        };

        this.showNotification('Оценка сохранена!', 'success');
        this.closeGradeEditor();
        this.renderTable();
    }

    deleteGrade() {
        if (!this.currentStudent || !this.currentLecture) return;

        if (confirm('Удалить оценку?')) {
            if (this.currentStudent.grades) {
                delete this.currentStudent.grades[this.currentLecture.key];
            }

            this.showNotification('Оценка удалена!', 'success');
            this.closeGradeEditor();
            this.renderTable();
        }
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

document.addEventListener('DOMContentLoaded', () => {
    new GradingTable();
});

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}