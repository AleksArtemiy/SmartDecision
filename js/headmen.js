// Данные расписания
const scheduleData = {
    "18 - 24 ноября 2024": {
        "Понедельник": {
            "9:00-10:30": {
                name: "Математический анализ",
                teacher: "Иванова А.С.",
                room: "301",
                canEdit: false, // Прошедшая пара - нельзя редактировать
                attendance: {
                    present: ["Иванов Алексей", "Петрова Мария", "Козлова Анна"],
                    absent: ["Сидоров Владимир"],
                    total: 4
                }
            },
            "10:30-12:00": {
                name: "Программирование",
                teacher: "Петров С.В.",
                room: "415",
                canEdit: false, // Прошедшая пара - нельзя редактировать
                attendance: {
                    present: ["Петрова Мария", "Сидоров Владимир"],
                    absent: ["Иванов Алексей", "Козлова Анна"],
                    total: 4
                }
            },
            "13:00-14:30": {
                name: "Базы данных",
                teacher: "Сидорова М.К.",
                room: "210",
                canEdit: false, // Прошедшая пара - нельзя редактировать
                attendance: {
                    present: ["Иванов Алексей", "Петрова Мария", "Сидоров Владимир", "Козлова Анна"],
                    absent: [],
                    total: 4
                }
            }
        },
        "Вторник": {
            "9:00-10:30": {
                name: "Физика",
                teacher: "Козлов Д.И.",
                room: "305",
                canEdit: true, // Текущий день - можно редактировать
                attendance: null
            },
            "13:00-14:30": {
                name: "Английский язык",
                teacher: "Smith J.",
                room: "104",
                canEdit: true, // Текущий день - можно редактировать
                attendance: null
            }
        },
        "Среда": {
            "10:30-12:00": {
                name: "Математический анализ",
                teacher: "Иванова А.С.",
                room: "301",
                canEdit: true, // Будущая пара - можно редактировать
                attendance: null
            },
            "14:30-16:00": {
                name: "Веб-разработка",
                teacher: "Петров С.В.",
                room: "415",
                canEdit: true, // Будущая пара - можно редактировать
                attendance: null
            }
        },
        "Четверг": {
            "9:00-10:30": {
                name: "Алгоритмы",
                teacher: "Сидорова М.К.",
                room: "210",
                canEdit: true, // Будущая пара - можно редактировать
                attendance: null
            },
            "12:00-13:30": {
                name: "Физкультура",
                teacher: "Волков А.Н.",
                room: "Спортзал",
                canEdit: true, // Будущая пара - можно редактировать
                attendance: null
            }
        },
        "Пятница": {
            "11:00-12:30": {
                name: "Проектная деятельность",
                teacher: "Петров С.В.",
                room: "415",
                canEdit: true, // Будущая пара - можно редактировать
                attendance: null
            },
            "14:30-16:00": {
                name: "Экономика",
                teacher: "Новикова Л.П.",
                room: "208",
                canEdit: true, // Будущая пара - можно редактировать
                attendance: null
            }
        },
        "Суббота": {
            "9:00-10:30": {
                name: "Элективная дисциплина",
                teacher: "Смирнов П.К.",
                room: "305",
                canEdit: true, // Будущая пара - можно редактировать
                attendance: null
            }
        }
    }
};

// Данные студентов
const studentsData = [
    { id: 1, name: "Иванов Алексей", attendance: 95 },
    { id: 2, name: "Петрова Мария", attendance: 88 },
    { id: 3, name: "Сидоров Владимир", attendance: 92 },
    { id: 4, name: "Козлова Анна", attendance: 78 },
    { id: 5, name: "Николаев Дмитрий", attendance: 85 },
    { id: 6, name: "Орлова Екатерина", attendance: 91 },
    { id: 7, name: "Федоров Максим", attendance: 67 },
    { id: 8, name: "Семенова Ирина", attendance: 89 }
];

// Временные интервалы
const timeSlots = [
    "9:00-10:30",
    "10:30-12:00",
    "12:00-13:30",
    "13:00-14:30",
    "14:30-16:00"
];

// Дни недели
const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

class DashboardManager {
    constructor() {
        this.weeks = Object.keys(scheduleData);
        this.currentWeekIndex = 0;
        this.currentWeek = this.weeks[this.currentWeekIndex];
        this.init();
    }

    init() {
        this.renderSchedule();
        this.renderStats();
        this.setupEventListeners();
        this.updateNavigationButtons();
        this.createViewModal();
    }

    getLectureStatus(day, time) {
        const hash = this.stringToHash(day + time + this.currentWeek);

        if (this.isPastLecture(day, time)) {
            const statuses = ['attended', 'missed', 'partial'];
            return statuses[hash % 3];
        } else {
            return 'future';
        }
    }

    stringToHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // ОПРЕДЕЛЯЕМ, МОЖНО ЛИ РЕДАКТИРОВАТЬ ПАРУ
    canEditLecture(day, time) {
        const weekSchedule = scheduleData[this.currentWeek];
        const daySchedule = weekSchedule[day];

        if (!daySchedule || !daySchedule[time]) {
            return false;
        }

        const lecture = daySchedule[time];

        // Если в данных явно указано canEdit - используем это
        if (lecture.canEdit !== undefined) {
            return lecture.canEdit;
        }

        // Иначе определяем по дате (прошедшие пары нельзя редактировать)
        return !this.isPastLecture(day, time);
    }

    isPastLecture(day, time) {
        // Упрощенная логика: понедельник-вторник считаем прошедшими
        const dayIndex = daysOfWeek.indexOf(day);
        return dayIndex < 2; // Пн, Вт - прошедшие, остальные - будущие
    }

    getAttendanceBadgeClass(attendance) {
        if (attendance >= 90) return 'good';
        if (attendance >= 75) return 'warning';
        return 'danger';
    }

    getAttendanceBadgeText(attendance) {
        if (attendance >= 90) return 'Отлично';
        if (attendance >= 75) return 'Хорошо';
        return 'Риск';
    }

    // ОТКРЫТЬ РЕДАКТИРОВАНИЕ ПОСЕЩАЕМОСТИ
    openAttendanceJournal(day, time) {
        const weekSchedule = scheduleData[this.currentWeek];
        const daySchedule = weekSchedule[day];
        const lecture = daySchedule[time];

        if (lecture) {
            const lectureData = {
                day: day,
                time: time,
                name: lecture.name,
                teacher: lecture.teacher,
                room: lecture.room,
                week: this.currentWeek,
                canEdit: true
            };

            // Передаем данные через URL параметры
            const queryString = new URLSearchParams({
                lecture_data: JSON.stringify(lectureData)
            }).toString();

            window.location.href = `attendance.php?${queryString}`;
        }
    }

    // ПОКАЗАТЬ МОДАЛЬНОЕ ОКНО ПРОСМОТРА
    showAttendanceView(day, time) {
        const weekSchedule = scheduleData[this.currentWeek];
        const daySchedule = weekSchedule[day];
        const lecture = daySchedule[time];

        if (lecture && lecture.attendance) {
            this.showViewModal(lecture, day, time);
        }
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

            daysOfWeek.forEach((day, index) => {
                const dayCell = document.createElement('td');
                const daySchedule = weekSchedule[day] || {};
                const lecture = daySchedule[time];

                if (lecture) {
                    const status = this.getLectureStatus(day, time);
                    const canEdit = this.canEditLecture(day, time);
                    const clickableClass = 'clickable';
                    const editTitle = canEdit ?
                        'Кликните для отметки посещаемости' :
                        'Кликните для просмотра посещаемости';

                    dayCell.innerHTML = `
                        <div class="lecture-cell ${status} ${clickableClass}"
                             data-time="${time}"
                             data-day="${day}"
                             data-editable="${canEdit}"
                             title="${editTitle}">
                            <div class="attendance-status ${status}"></div>
                            <div class="lecture-name">${lecture.name}</div>
                            <div class="lecture-details">
                                ${lecture.teacher}<br>
                                <span class="lecture-room">${lecture.room}</span>
                                ${!canEdit ? '<div class="no-edit-badge">👁️</div>' : ''}
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

        // Обновляем заголовок текущей недели
        document.getElementById('current-week').textContent = this.currentWeek;

        // Добавляем анимацию появления
        setTimeout(() => {
            tbody.style.opacity = '1';
            tbody.style.transform = 'translateY(0)';
        }, 50);
    }

    renderStats() {
        const container = document.getElementById('students-stats');

        // Сортируем студентов по посещаемости (от лучшей к худшей)
        const sortedStudents = [...studentsData].sort((a, b) => b.attendance - a.attendance);

        container.innerHTML = sortedStudents.map(student => {
            const badgeClass = this.getAttendanceBadgeClass(student.attendance);
            const badgeText = this.getAttendanceBadgeText(student.attendance);

            return `
                <div class="student-item">
                    <div class="student-info">
                        <div class="student-name">${student.name}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="progress-bar" style="width: 80px;">
                            <div class="progress-fill ${badgeClass}" style="width: ${student.attendance}%"></div>
                        </div>
                        <span style="font-weight: 500; min-width: 40px;">${student.attendance}%</span>
                        <span class="attendance-badge ${badgeClass}">${badgeText}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Обновляем общую статистику
        const totalAttendance = Math.round(sortedStudents.reduce((sum, student) => sum + student.attendance, 0) / sortedStudents.length);
        const riskCount = sortedStudents.filter(student => student.attendance < 75).length;

        document.getElementById('total-attendance').textContent = totalAttendance + '%';
        document.getElementById('avg-per-student').textContent = totalAttendance + '%';
        document.getElementById('risk-count').textContent = riskCount;

        document.querySelector('#total-attendance').closest('.stat-card').querySelector('.progress-fill').style.width = totalAttendance + '%';
        document.querySelector('#avg-per-student').closest('.stat-card').querySelector('.progress-fill').style.width = totalAttendance + '%';
    }

    setupEventListeners() {
        document.getElementById('prev-week').addEventListener('click', () => {
            this.changeWeek(-1);
        });

        document.getElementById('next-week').addEventListener('click', () => {
            this.changeWeek(1);
        });

        // ОБРАБОТКА КЛИКОВ ПО ЯЧЕЙКАМ РАСПИСАНИЯ
        document.addEventListener('click', (e) => {
            const lectureCell = e.target.closest('.lecture-cell.clickable');
            if (lectureCell) {
                const time = lectureCell.dataset.time;
                const day = lectureCell.dataset.day;
                const canEdit = lectureCell.dataset.editable === 'true';

                if (canEdit) {
                    // РЕДАКТИРУЕМАЯ ПАРА - открываем страницу attendance
                    this.openAttendanceJournal(day, time);
                } else {
                    // ПРОЙДЕННАЯ ПАРА - открываем модальное окно просмотра
                    this.showAttendanceView(day, time);
                }
            }
        });

        document.getElementById('export-all').addEventListener('click', () => {
            this.showNotification('Отчет экспортирован в PDF', 'success');
        });

        document.getElementById('print-all').addEventListener('click', () => {
            window.print();
        });
    }

    // СОЗДАНИЕ МОДАЛЬНОГО ОКНА ПРОСМОТРА
    createViewModal() {
        if (!document.getElementById('attendance-view-modal')) {
            const modal = document.createElement('div');
            modal.id = 'attendance-view-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="view-modal-title">Посещаемость</h3>
                        <button class="close-modal" onclick="dashboardManager.hideViewModal()">×</button>
                    </div>
                    <div class="modal-body" id="view-modal-body">
                        <!-- Содержимое будет заполнено через JavaScript -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Закрытие по клику вне модального окна
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideViewModal();
                }
            });
        }
    }

    // ПОКАЗАТЬ МОДАЛЬНОЕ ОКНО ПРОСМОТРА
    showViewModal(lecture, day, time) {
        const modal = document.getElementById('attendance-view-modal');
        const modalTitle = document.getElementById('view-modal-title');
        const modalBody = document.getElementById('view-modal-body');

        modalTitle.textContent = `${lecture.name} - ${day}, ${time}`;

        const presentCount = lecture.attendance.present.length;
        const absentCount = lecture.attendance.absent.length;
        const totalCount = lecture.attendance.total;
        const attendancePercent = Math.round((presentCount / totalCount) * 100);

        modalBody.innerHTML = `
            <div class="lecture-info-grid">
                <div class="info-item">
                    <label>👨‍🏫 Преподаватель:</label>
                    <span>${lecture.teacher}</span>
                </div>
                <div class="info-item">
                    <label>🏫 Аудитория:</label>
                    <span>${lecture.room}</span>
                </div>
                <div class="info-item ${attendancePercent >= 80 ? 'success' : attendancePercent >= 60 ? 'warning' : 'danger'}">
                    <label>📊 Посещаемость:</label>
                    <span>${presentCount}/${totalCount} (${attendancePercent}%)</span>
                </div>
            </div>

            <div class="attendance-stats">
                <div class="stat-cards">
                    <div class="stat-card present">
                        <div class="stat-value">${presentCount}</div>
                        <div class="stat-label">Присутствовали</div>
                    </div>
                    <div class="stat-card absent">
                        <div class="stat-value">${absentCount}</div>
                        <div class="stat-label">Отсутствовали</div>
                    </div>
                </div>
            </div>

            <div class="students-lists">
                <div class="students-section">
                    <h4>✅ Присутствовали (${presentCount})</h4>
                    <div class="students-list">
                        ${lecture.attendance.present.map(student => `
                            <div class="student-item present">
                                <span class="student-name">${student}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="students-section">
                    <h4>❌ Отсутствовали (${absentCount})</h4>
                    <div class="students-list">
                        ${lecture.attendance.absent.map(student => `
                            <div class="student-item absent">
                                <span class="student-name">${student}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // СКРЫТЬ МОДАЛЬНОЕ ОКНО ПРОСМОТРА
    hideViewModal() {
        const modal = document.getElementById('attendance-view-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    changeWeek(direction) {
        const newIndex = this.currentWeekIndex + direction;

        if (newIndex >= 0 && newIndex < this.weeks.length) {
            this.currentWeekIndex = newIndex;
            this.currentWeek = this.weeks[this.currentWeekIndex];

            // Анимация перехода
            const tbody = document.getElementById('schedule-body');
            tbody.style.opacity = '0';
            tbody.style.transform = `translateX(${direction * 20}px)`;

            setTimeout(() => {
                this.renderSchedule();
                this.updateNavigationButtons();
            }, 300);
        } else {
            this.showNotification(
                direction > 0 ? 'Это последняя доступная неделя' : 'Это первая доступная неделя',
                'info'
            );
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-week');
        const nextBtn = document.getElementById('next-week');

        prevBtn.disabled = this.currentWeekIndex === 0;
        nextBtn.disabled = this.currentWeekIndex === this.weeks.length - 1;

        // Добавляем подсказки
        prevBtn.title = this.currentWeekIndex === 0 ? 'Это первая неделя' : 'Предыдущая неделя';
        nextBtn.title = this.currentWeekIndex === this.weeks.length - 1 ? 'Это последняя неделя' : 'Следующая неделя';
    }

    // МЕТОД УВЕДОМЛЕНИЙ
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

// Инициализация при загрузке страницы
let dashboardManager;

document.addEventListener('DOMContentLoaded', () => {
    dashboardManager = new DashboardManager();
});

// Функция выхода из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}

// Добавляем глобальные функции для использования в HTML
window.dashboardManager = dashboardManager;
window.logout = logout;