// Данные расписания
const scheduleData = {
    "18 - 24 ноября 2024": {
        "Понедельник": {
            "9:00-10:30": {
                name: "Математический анализ",
                teacher: "Иванова А.С.",
                room: "301",
                canEdit: false // Прошедшая пара - нельзя редактировать
            },
            "10:30-12:00": {
                name: "Программирование",
                teacher: "Петров С.В.",
                room: "415",
                canEdit: false // Прошедшая пара - нельзя редактировать
            },
            "13:00-14:30": {
                name: "Базы данных",
                teacher: "Сидорова М.К.",
                room: "210",
                canEdit: false // Прошедшая пара - нельзя редактировать
            }
        },
        "Вторник": {
            "9:00-10:30": {
                name: "Физика",
                teacher: "Козлов Д.И.",
                room: "305",
                canEdit: false // Прошедшая пара - нельзя редактировать
            },
            "13:00-14:30": {
                name: "Английский язык",
                teacher: "Smith J.",
                room: "104",
                canEdit: true // Текущий день - можно редактировать
            }
        },
        "Среда": {
            "10:30-12:00": {
                name: "Математический анализ",
                teacher: "Иванова А.С.",
                room: "301",
                canEdit: true // Будущая пара - можно редактировать
            },
            "14:30-16:00": {
                name: "Веб-разработка",
                teacher: "Петров С.В.",
                room: "415",
                canEdit: true // Будущая пара - можно редактировать
            }
        },
        "Четверг": {
            "9:00-10:30": {
                name: "Алгоритмы",
                teacher: "Сидорова М.К.",
                room: "210",
                canEdit: true // Будущая пара - можно редактировать
            },
            "12:00-13:30": {
                name: "Физкультура",
                teacher: "Волков А.Н.",
                room: "Спортзал",
                canEdit: true // Будущая пара - можно редактировать
            }
        },
        "Пятница": {
            "11:00-12:30": {
                name: "Проектная деятельность",
                teacher: "Петров С.В.",
                room: "415",
                canEdit: true // Будущая пара - можно редактировать
            },
            "14:30-16:00": {
                name: "Экономика",
                teacher: "Новикова Л.П.",
                room: "208",
                canEdit: true // Будущая пара - можно редактировать
            }
        },
        "Суббота": {
            "9:00-10:30": {
                name: "Элективная дисциплина",
                teacher: "Смирнов П.К.",
                room: "305",
                canEdit: true // Будущая пара - можно редактировать
            }
        }
    },
    "25 ноября - 1 декабря 2024": {
        "Понедельник": {
            "9:00-10:30": {
                name: "Математический анализ",
                teacher: "Иванова А.С.",
                room: "301",
                canEdit: true // Будущая неделя - можно редактировать
            },
            "13:00-14:30": {
                name: "Программирование",
                teacher: "Петров С.В.",
                room: "415",
                canEdit: true // Будущая неделя - можно редактировать
            }
        },
        "Вторник": {
            "10:30-12:00": {
                name: "Базы данных",
                teacher: "Сидорова М.К.",
                room: "210",
                canEdit: true // Будущая неделя - можно редактировать
            }
        },
        "Среда": {
            "9:00-10:30": {
                name: "Физика",
                teacher: "Козлов Д.И.",
                room: "305",
                canEdit: true // Будущая неделя - можно редактировать
            },
            "14:30-16:00": {
                name: "Английский язык",
                teacher: "Smith J.",
                room: "104",
                canEdit: true // Будущая неделя - можно редактировать
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

// Дни недели (сокращенные)
const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const daysShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

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

    openAttendanceJournal(day, time) {
        const weekSchedule = scheduleData[this.currentWeek];
        const daySchedule = weekSchedule[day];
        const lecture = daySchedule[time];

        if (lecture) {
            const canEdit = this.canEditLecture(day, time);

            const lectureData = {
                day: day,
                time: time,
                name: lecture.name,
                teacher: lecture.teacher,
                room: lecture.room,
                week: this.currentWeek,
                canEdit: canEdit
            };

            // Передаем данные через URL параметры
            const queryString = new URLSearchParams({
                lecture_data: JSON.stringify(lectureData)
            }).toString();

            window.location.href = `attendance.php?${queryString}`;
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
                    const clickableClass = canEdit ? 'clickable' : 'not-editable';
                    const editTitle = canEdit ? 'Кликните для отметки посещаемости' : 'Редактирование недоступно для прошедших пар';

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
                                ${!canEdit ? '<div class="no-edit-badge">🔒</div>' : ''}
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

        document.addEventListener('click', (e) => {
            const lectureCell = e.target.closest('.lecture-cell.clickable');
            if (lectureCell) {
                const time = lectureCell.dataset.time;
                const day = lectureCell.dataset.day;
                const canEdit = lectureCell.dataset.editable === 'true';

                if (canEdit) {
                    this.openAttendanceJournal(day, time);
                } else {
                    this.showNotification('Редактирование посещаемости для этой пары недоступно', 'warning');
                }
            }

            // Блокируем клик по нередактируемым ячейкам
            const notEditableCell = e.target.closest('.lecture-cell.not-editable');
            if (notEditableCell) {
                this.showNotification('Редактирование посещаемости для прошедших пар недоступно', 'warning');
            }
        });

        document.getElementById('export-all').addEventListener('click', () => {
            this.showNotification('Отчет экспортирован в PDF', 'success');
        });

        document.getElementById('print-all').addEventListener('click', () => {
            window.print();
        });
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
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Функция выхода из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}