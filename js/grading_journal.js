// ТЕСТОВЫЕ ДАННЫЕ ДЛЯ ЖУРНАЛА ОЦЕНИВАНИЯ
const scheduleData = {
    "18 - 24 ноября 2024": {
        "Понедельник": {
            "9:00-10:30": {
                name: "Математический анализ",
                room: "301",
                status: "attended",
                type: "лекция",
                groups: ["ПИ-201", "ПИ-202"],
                date: "2024-11-18"
            },
            "13:00-14:30": {
                name: "Математический анализ",
                room: "301",
                status: "missed",
                type: "практика",
                groups: ["ПИ-201"],
                date: "2024-11-18"
            }
        },
        "Вторник": {
            "10:30-12:00": {
                name: "Математический анализ",
                room: "415",
                status: "attended",
                type: "лабораторная",
                groups: ["ПИ-201"],
                date: "2024-11-19"
            },
            "13:00-14:30": {
                name: "Математический анализ",
                room: "305",
                status: "partial",
                type: "практика",
                groups: ["ПИ-202"],
                date: "2024-11-19"
            }
        },
        "Среда": {
            "9:00-10:30": {
                name: "Математический анализ",
                room: "301",
                status: "partial",
                type: "практика",
                groups: ["ПИ-201"],
                date: "2024-11-20"
            },
            "13:00-14:30": {
                name: "Математический анализ",
                room: "301",
                status: "attended",
                type: "лекция",
                groups: ["ПИ-202"],
                date: "2024-11-20"
            }
        },
        "Четверг": {
            "10:30-12:00": {
                name: "Математический анализ",
                room: "415",
                status: "attended",
                type: "семинар",
                groups: ["ПИ-201", "ПИ-202"],
                date: "2024-11-21"
            }
        }
    }
};

const studentsData = {
    "ПИ-201": [
        { id: 1, name: "Иванов Алексей", status: "present" },
        { id: 2, name: "Петрова Мария", status: "present" },
        { id: 3, name: "Сидоров Владимир", status: "absent" },
        { id: 4, name: "Козлова Анна", status: "present" },
        { id: 5, name: "Николаев Дмитрий", status: "partial" },
        { id: 6, name: "Фролова Елена", status: "present" }
    ],
    "ПИ-202": [
        { id: 1, name: "Орлова Екатерина", status: "absent" },
        { id: 2, name: "Федоров Максим", status: "absent" },
        { id: 3, name: "Семенова Ирина", status: "present" },
        { id: 4, name: "Волков Андрей", status: "absent" },
        { id: 5, name: "Тихонова Ольга", status: "present" },
        { id: 6, name: "Громов Павел", status: "partial" }
    ],
    "МАТ-101": [
        { id: 1, name: "Белов Александр", status: "present" },
        { id: 2, name: "Крылова Виктория", status: "present" },
        { id: 3, name: "Морозов Иван", status: "absent" },
        { id: 4, name: "Зайцева София", status: "present" },
        { id: 5, name: "Соколов Артем", status: "partial" }
    ]
};

// Демо-оценки для начального заполнения
const demoGrades = {
    // ПИ-201
    "1-2024-11-18-9:00": { grade: 9, attendance: 'present' },
    "2-2024-11-18-9:00": { grade: 7, attendance: 'present' },
    "4-2024-11-18-9:00": { grade: 8, attendance: 'present' },
    "6-2024-11-18-9:00": { grade: 10, attendance: 'present' },
    
    "1-2024-11-18-13:00": { grade: 8, attendance: 'present' },
    "2-2024-11-18-13:00": { grade: 6, attendance: 'present' },
    "4-2024-11-18-13:00": { grade: 9, attendance: 'present' },
    "5-2024-11-18-13:00": { grade: 5, attendance: 'partial' },
    
    "1-2024-11-19-10:30": { grade: 10, attendance: 'present' },
    "2-2024-11-19-10:30": { grade: 7, attendance: 'present' },
    "4-2024-11-19-10:30": { grade: 8, attendance: 'present' },
    "6-2024-11-19-10:30": { grade: 9, attendance: 'present' },
    
    "1-2024-11-20-9:00": { grade: 9, attendance: 'present' },
    "2-2024-11-20-9:00": { grade: 8, attendance: 'present' },
    "4-2024-11-20-9:00": { grade: 7, attendance: 'present' },
    "6-2024-11-20-9:00": { grade: 10, attendance: 'present' },

    // ПИ-202
    "3-2024-11-18-9:00": { grade: 8, attendance: 'present' },
    "5-2024-11-18-9:00": { grade: 6, attendance: 'present' },
    
    "3-2024-11-19-13:00": { grade: 9, attendance: 'present' },
    "5-2024-11-19-13:00": { grade: 7, attendance: 'present' },
    "6-2024-11-19-13:00": { grade: 5, attendance: 'partial' },
    
    "3-2024-11-20-13:00": { grade: 10, attendance: 'present' },
    "5-2024-11-20-13:00": { grade: 8, attendance: 'present' },
    
    "3-2024-11-21-10:30": { grade: 9, attendance: 'present' },
    "5-2024-11-21-10:30": { grade: 7, attendance: 'present' },
    "6-2024-11-21-10:30": { grade: 6, attendance: 'partial' }
};

// Временные интервалы и дни недели для совместимости
const timeSlots = ["9:00-10:30", "10:30-12:00", "13:00-14:30"];
const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

// Журнал оценивания с компактным layout
class GradingJournal {
    constructor() {
        this.currentSubject = 'Математический анализ';
        this.currentGroup = 'ПИ-201';
        this.editingCell = null;
        this.gradesData = this.loadGradesFromStorage();
        this.init();
    }

    init() {
        this.updateSidebarInfo();
        this.renderJournal();
        this.setupEventListeners();
    }

    loadGradesFromStorage() {
    // Пытаемся загрузить из localStorage
    const saved = localStorage.getItem(`grades_${this.currentSubject}_${this.currentGroup}`);
    
    if (saved) {
        return JSON.parse(saved);
    }
    
    // Если нет сохраненных данных, используем демо-данные для текущей группы
    const demoGradesForGroup = {};
    
    Object.keys(demoGrades).forEach(key => {
        const parts = key.split('-');
        const studentId = parts[0];
        const lectureDate = parts.slice(1, 4).join('-');
        const lectureTime = parts.slice(4).join('-');
        const lectureKey = `${lectureDate}-${lectureTime}`;
        
        const student = studentsData[this.currentGroup]?.find(s => s.id == studentId);
        
        if (student) {
            demoGradesForGroup[key] = demoGrades[key];
        }
    });
    
    return demoGradesForGroup;
}

    saveGradesToStorage() {
        localStorage.setItem(`grades_${this.currentSubject}_${this.currentGroup}`, JSON.stringify(this.gradesData));
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

        return lectures.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    updateSidebarInfo() {
        const lectures = this.getLecturesForSubject();
        const students = studentsData[this.currentGroup] || [];
        const totalGrades = Object.keys(this.gradesData).length;
        
        // Обновляем основную информацию
        document.getElementById('current-subject').textContent = this.currentSubject;
        document.getElementById('current-group').textContent = this.currentGroup;
        document.getElementById('students-count').textContent = students.length;
        document.getElementById('lectures-count').textContent = lectures.length;
        document.getElementById('grades-count').textContent = totalGrades;
        
        // Рассчитываем посещаемость
        const presentCount = students.filter(s => s.status === 'present').length;
        const attendancePercent = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;
        document.getElementById('attendance-percent').textContent = `${attendancePercent}%`;
    }

    renderJournal() {
        const lectures = this.getLecturesForSubject();
        const students = studentsData[this.currentGroup] || [];
        
        this.renderTableHeader(lectures);
        this.renderTableBody(students, lectures);
    }

    renderTableHeader(lectures) {
        const thead = document.querySelector('#journal-table thead');
        const firstRow = thead.querySelector('tr:first-child');
        const secondRow = thead.querySelector('tr:last-child');

        firstRow.innerHTML = '<th rowspan="2" class="student-col">Студент</th>';
        secondRow.innerHTML = '';

        lectures.forEach(lecture => {
            const mainTh = document.createElement('th');
            mainTh.colSpan = 2;
            mainTh.className = 'lecture-header';
            mainTh.innerHTML = `
                <div>${this.formatDate(lecture.date)}</div>
                <small>${lecture.time}</small>
                <div class="lecture-type">${lecture.type}</div>
            `;
            firstRow.appendChild(mainTh);

            const attendanceTh = document.createElement('th');
            attendanceTh.className = 'lecture-subheader attendance-header';
            attendanceTh.innerHTML = '✅';
            secondRow.appendChild(attendanceTh);

            const gradeTh = document.createElement('th');
            gradeTh.className = 'lecture-subheader grade-header';
            gradeTh.innerHTML = '📝';
            secondRow.appendChild(gradeTh);
        });
    }

    renderTableBody(students, lectures) {
        const tbody = document.getElementById('journal-table-body');
        tbody.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.className = 'student-name';
            nameCell.textContent = student.name;
            row.appendChild(nameCell);

            lectures.forEach(lecture => {
                const gradeKey = `${student.id}-${lecture.key}`;
                const gradeInfo = this.gradesData[gradeKey];
                const attendance = gradeInfo?.attendance || student.status;

                // Ячейка посещаемости
                const attendanceCell = document.createElement('td');
                attendanceCell.className = `attendance-cell ${attendance}`;
                attendanceCell.innerHTML = this.getAttendanceIcon(attendance);
                attendanceCell.title = this.getAttendanceText(attendance);
                row.appendChild(attendanceCell);

                // Ячейка оценки
                const gradeCell = document.createElement('td');
                gradeCell.className = `grade-cell ${gradeInfo ? 'has-grade' : 'no-grade'}`;
                
                if (this.editingCell === gradeKey) {
                    // Режим редактирования
                    gradeCell.innerHTML = `
                        <div class="grade-edit-container">
                            <input type="number" 
                                   class="grade-input" 
                                   value="${gradeInfo ? gradeInfo.grade : ''}"
                                   min="0" 
                                   max="10"
                                   placeholder="0"
                                   data-grade-key="${gradeKey}"
                                   data-student-id="${student.id}">
                            <div class="grade-edit-actions">
                                <button class="btn-save" title="Сохранить">✓</button>
                                <button class="btn-clear" title="Очистить">×</button>
                            </div>
                        </div>
                    `;
                } else {
                    // Режим просмотра
                    if (gradeInfo) {
                        gradeCell.innerHTML = `
                            <div class="grade-display ${this.getGradeColor(gradeInfo.grade)}"
                                 data-grade-key="${gradeKey}"
                                 data-student-id="${student.id}">
                                ${gradeInfo.grade}
                            </div>
                        `;
                    } else {
                        gradeCell.innerHTML = `
                            <div class="grade-display empty"
                                 data-grade-key="${gradeKey}"
                                 data-student-id="${student.id}">
                                +
                            </div>
                        `;
                    }
                }
                
                row.appendChild(gradeCell);
            });

            tbody.appendChild(row);
        });

        // Фокус на input при редактировании
        if (this.editingCell) {
            const input = document.querySelector(`.grade-input[data-grade-key="${this.editingCell}"]`);
            if (input) {
                input.focus();
                input.select();
            }
        }
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

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
        });
    }

    setupEventListeners() {
        // Загрузка журнала
        document.getElementById('load-journal').addEventListener('click', () => {
            this.currentSubject = document.getElementById('subject-select').value;
            this.currentGroup = document.getElementById('group-select').value;
            this.editingCell = null;
            this.gradesData = this.loadGradesFromStorage();
            this.updateSidebarInfo();
            this.renderJournal();
        });

        // Клики по ячейкам оценок
        document.addEventListener('click', (e) => {
            const gradeDisplay = e.target.closest('.grade-display');
            if (gradeDisplay) {
                this.startEditing(gradeDisplay.dataset.gradeKey);
                return;
            }

            const saveBtn = e.target.closest('.btn-save');
            if (saveBtn) {
                const input = saveBtn.closest('.grade-edit-container').querySelector('.grade-input');
                this.saveGrade(input);
                return;
            }

            const clearBtn = e.target.closest('.btn-clear');
            if (clearBtn) {
                const input = clearBtn.closest('.grade-edit-container').querySelector('.grade-input');
                this.clearGrade(input);
                return;
            }
        });

        // Сохранение по Enter, отмена по Escape
        document.addEventListener('keydown', (e) => {
            if (!this.editingCell) return;

            const input = document.querySelector(`.grade-input[data-grade-key="${this.editingCell}"]`);
            if (!input) return;

            if (e.key === 'Enter') {
                this.saveGrade(input);
            } else if (e.key === 'Escape') {
                this.cancelEditing();
            }
        });

        // Клик вне поля ввода для отмены редактирования
        document.addEventListener('click', (e) => {
            if (!this.editingCell) return;
            
            const editContainer = e.target.closest('.grade-edit-container');
            const gradeDisplay = e.target.closest('.grade-display');
            
            if (!editContainer && !gradeDisplay) {
                this.cancelEditing();
            }
        });

        // Заглушки для кнопок
        document.getElementById('export-grades').addEventListener('click', () => {
            alert('Экспорт в Excel будет реализован в будущем');
        });

        document.getElementById('print-journal').addEventListener('click', () => {
            window.print();
        });
    }

    startEditing(gradeKey) {
        this.editingCell = gradeKey;
        this.renderJournal();
    }

    cancelEditing() {
        this.editingCell = null;
        this.renderJournal();
    }

    saveGrade(input) {
        const gradeKey = input.dataset.gradeKey;
        const studentId = input.dataset.studentId;
        const gradeValue = input.value.trim();

        if (!gradeValue) {
            this.clearGrade(input);
            return;
        }

        const grade = parseInt(gradeValue);
        if (grade < 0 || grade > 10) {
            alert('Оценка должна быть от 0 до 10');
            input.focus();
            input.select();
            return;
        }

        const student = studentsData[this.currentGroup].find(s => s.id == studentId);
        if (!student) return;

        this.gradesData[gradeKey] = {
            grade: grade,
            attendance: student.status
        };

        this.saveGradesToStorage();
        this.editingCell = null;
        this.updateSidebarInfo();
        this.renderJournal();
    }

    clearGrade(input) {
        const gradeKey = input.dataset.gradeKey;
        
        delete this.gradesData[gradeKey];
        this.saveGradesToStorage();
        this.editingCell = null;
        this.updateSidebarInfo();
        this.renderJournal();
    }
    renderJournal() {
        const lectures = this.getLecturesForSubject();
        const students = studentsData[this.currentGroup] || [];
        
        console.log('Lectures:', lectures);
        console.log('Students:', students);
        console.log('Current group:', this.currentGroup);
        console.log('Current subject:', this.currentSubject);
        
        this.renderTableHeader(lectures);
        this.renderTableBody(students, lectures);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new GradingJournal();
});

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}