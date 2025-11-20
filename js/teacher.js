// Данные расписания преподавателя
const scheduleData = {
    "18 - 24 ноября 2024": {
        "Понедельник": {
            "9:00-10:30": {
                name: "Математический анализ",
                room: "301",
                status: "attended",
                groups: ["ПИ-201"]
            },
            "13:00-14:30": {
                name: "Математический анализ",
                room: "301",
                status: "missed",
                groups: ["ПИ-202"]
            }
        },
        "Вторник": {
            "10:30-12:00": {
                name: "Высшая математика",
                room: "415",
                status: "attended",
                groups: ["МАТ-101"]
            }
        }
    }
};

// Данные студентов по группам
const studentsData = {
    "ПИ-201": [
        { id: 1, name: "Иванов Алексей", status: "present" },
        { id: 2, name: "Петрова Мария", status: "present" },
        { id: 3, name: "Сидоров Владимир", status: "absent" },
        { id: 4, name: "Козлова Анна", status: "present" }
    ],
    "ПИ-202": [
        { id: 1, name: "Орлова Екатерина", status: "absent" },
        { id: 2, name: "Федоров Максим", status: "absent" },
        { id: 3, name: "Семенова Ирина", status: "present" },
        { id: 4, name: "Волков Андрей", status: "absent" }
    ]
};

// Временные интервалы
const timeSlots = ["9:00-10:30", "10:30-12:00", "13:00-14:30"];

// Дни недели
const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

class TeacherDashboard {
    constructor() {
        this.currentWeek = Object.keys(scheduleData)[0];
        this.currentLecture = null;
        this.originalData = null;
        this.init();
    }

    init() {
        this.renderSchedule();
        this.setupEventListeners();
    }

    renderSchedule() {
        const tbody = document.getElementById('schedule-body');
        const weekSchedule = scheduleData[this.currentWeek];

        tbody.innerHTML = timeSlots.map(time => {
            const row = document.createElement('tr');

            const timeCell = document.createElement('td');
            timeCell.className = 'time-column';
            timeCell.textContent = time;
            row.appendChild(timeCell);

            daysOfWeek.forEach(day => {
                const dayCell = document.createElement('td');
                const daySchedule = weekSchedule[day] || {};
                const lecture = daySchedule[time];

                if (lecture) {
                    // Убираем кнопку редактирования из ячейки
                    dayCell.innerHTML = `
                        <div class="lecture-cell ${lecture.status}"
                             data-time="${time}"
                             data-day="${day}">
                            <div class="lecture-name">${lecture.name}</div>
                            <div class="lecture-details">
                                ${lecture.room}<br>
                                ${lecture.groups.join(', ')}
                            </div>
                        </div>
                    `;
                } else {
                    dayCell.innerHTML = '<div class="lecture-cell empty"></div>';
                }

                row.appendChild(dayCell);
            });

            return row.outerHTML;
        }).join('');
    }

    showViewModal(day, time) {
        const weekSchedule = scheduleData[this.currentWeek];
        const daySchedule = weekSchedule[day];
        const lecture = daySchedule[time];

        if (lecture && lecture.groups) {
            this.currentLecture = { day, time, ...lecture };

            const modal = document.getElementById('view-modal');
            const modalTitle = document.getElementById('view-modal-title');
            const modalBody = document.getElementById('view-modal-body');

            modalTitle.textContent = `${lecture.name} - ${day}, ${time}`;

            // Собираем всех студентов
            const allStudents = [];
            lecture.groups.forEach(groupName => {
                const groupStudents = studentsData[groupName] || [];
                groupStudents.forEach(student => {
                    allStudents.push({
                        ...student,
                        group: groupName
                    });
                });
            });

            const presentCount = allStudents.filter(s => s.status === 'present').length;
            const totalCount = allStudents.length;

            modalBody.innerHTML = `
                <div style="margin-bottom: 1rem;">
                    <strong>Аудитория:</strong> ${lecture.room}<br>
                    <strong>Группы:</strong> ${lecture.groups.join(', ')}<br>
                    <strong>Посещаемость:</strong> ${presentCount}/${totalCount} студентов
                </div>
                <div class="students-edit-list">
                    ${allStudents.map(student => `
                        <div class="student-view-item ${student.status}"
                             data-id="${student.id}"
                             data-group="${student.group}">
                            <div>
                                <strong>${student.name}</strong><br>
                                <small>${student.group}</small>
                            </div>
                            <div>
                                ${student.status === 'present' ? '✅ Присутствовал' : '❌ Отсутствовал'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            modal.classList.add('active');
        }
    }

    showEditModal() {
        if (!this.currentLecture) return;

        // Сохраняем оригинальные данные для возможности отмены
        this.originalData = JSON.parse(JSON.stringify(studentsData));

        const modal = document.getElementById('edit-modal');
        const modalTitle = document.getElementById('edit-modal-title');
        const modalBody = document.getElementById('edit-modal-body');

        modalTitle.textContent = `${this.currentLecture.name} - ${this.currentLecture.day}, ${this.currentLecture.time}`;

        // Собираем всех студентов
        const allStudents = [];
        this.currentLecture.groups.forEach(groupName => {
            const groupStudents = studentsData[groupName] || [];
            groupStudents.forEach(student => {
                allStudents.push({
                    ...student,
                    group: groupName
                });
            });
        });

        modalBody.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Аудитория:</strong> ${this.currentLecture.room}<br>
                <strong>Группы:</strong> ${this.currentLecture.groups.join(', ')}
            </div>
            <div class="students-edit-list">
                ${allStudents.map(student => `
                    <div class="student-edit-item ${student.status} editable"
                         data-id="${student.id}"
                         data-group="${student.group}">
                        <div>
                            <strong>${student.name}</strong><br>
                            <small>${student.group}</small>
                        </div>
                        <div>
                            ${student.status === 'present' ? '✅ Присутствовал' : '❌ Отсутствовал'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Закрываем окно просмотра и открываем редактирование
        document.getElementById('view-modal').classList.remove('active');
        modal.classList.add('active');
    }

    setupEventListeners() {
        document.getElementById('prev-week').addEventListener('click', () => {
            this.changeWeek(-1);
        });

        document.getElementById('next-week').addEventListener('click', () => {
            this.changeWeek(1);
        });

        // Клики по ячейкам расписания для просмотра
        document.addEventListener('click', (e) => {
            const lectureCell = e.target.closest('.lecture-cell:not(.empty)');
            if (lectureCell) {
                const time = lectureCell.dataset.time;
                const day = lectureCell.dataset.day;
                this.showViewModal(day, time);
            }
        });

        // Кнопка "Принудительно изменить" в модальном окне просмотра
        document.getElementById('force-edit-btn').addEventListener('click', () => {
            this.showEditModal();
        });

        // Закрытие модального окна просмотра
        document.getElementById('close-view-modal').addEventListener('click', () => {
            document.getElementById('view-modal').classList.remove('active');
        });

        document.getElementById('close-view-btn').addEventListener('click', () => {
            document.getElementById('view-modal').classList.remove('active');
        });

        // Клики по студентам в модальном окне редактирования
        document.addEventListener('click', (e) => {
            const studentItem = e.target.closest('.student-edit-item.editable');
            if (studentItem) {
                this.toggleStudentStatus(studentItem);
            }
        });

        // Закрытие модального окна редактирования
        document.getElementById('close-edit-modal').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.closeEditModal();
        });

        // Сохранение изменений
        document.getElementById('save-edit-changes').addEventListener('click', () => {
            this.saveEditChanges();
        });
    }

    toggleStudentStatus(studentItem) {
        const studentId = studentItem.dataset.id;
        const groupName = studentItem.dataset.group;
        const currentStatus = studentItem.classList.contains('present') ? 'present' : 'absent';
        const newStatus = currentStatus === 'present' ? 'absent' : 'present';

        // Обновляем данные
        const student = studentsData[groupName].find(s => s.id == studentId);
        if (student) {
            student.status = newStatus;
        }

        // Обновляем внешний вид
        studentItem.className = `student-edit-item ${newStatus} editable`;
        const statusText = studentItem.querySelector('div:last-child');
        statusText.textContent = newStatus === 'present' ? '✅ Присутствовал' : '❌ Отсутствовал';
    }

    closeEditModal() {
        // Восстанавливаем оригинальные данные при отмене
        if (this.originalData) {
            Object.keys(this.originalData).forEach(groupName => {
                studentsData[groupName] = [...this.originalData[groupName]];
            });
        }
        document.getElementById('edit-modal').classList.remove('active');
    }

    saveEditChanges() {
        if (!this.currentLecture) return;

        // Пересчитываем общий статус пары
        const allStudents = [];
        this.currentLecture.groups.forEach(groupName => {
            const groupStudents = studentsData[groupName] || [];
            allStudents.push(...groupStudents);
        });

        const presentCount = allStudents.filter(s => s.status === 'present').length;
        const totalCount = allStudents.length;
        const newStatus = presentCount === totalCount ? 'attended' :
            presentCount === 0 ? 'missed' : 'partial';

        // Обновляем статус пары в расписании
        const weekSchedule = scheduleData[this.currentWeek];
        const daySchedule = weekSchedule[this.currentLecture.day];
        const lecture = daySchedule[this.currentLecture.time];
        if (lecture) {
            lecture.status = newStatus;
        }

        alert('Изменения посещаемости сохранены!');
        document.getElementById('edit-modal').classList.remove('active');
        this.renderSchedule();
    }

    changeWeek(direction) {
        alert(`Переход к ${direction > 0 ? 'следующей' : 'предыдущей'} неделе`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TeacherDashboard();
});

// Функция выхода из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}