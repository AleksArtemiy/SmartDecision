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
            "9:00-10:30": { name: "Алгоритмы", teacher: "Сидорова М.К.", room: "210", canEdit: true},
            "12:00-13:30": { name: "Физкультура", teacher: "Волков А.Н.", room: "Спортзал", canEdit: true}
        },
        "Пятница": {
            "11:00-12:30": { name: "Проектная деятельность", teacher: "Петров С.В.", room: "415", canEdit: true},
            "14:30-16:00": { name: "Экономика", teacher: "Новикова Л.П.", room: "208", canEdit: true}
        },
        "Суббота": {
            "9:00-10:30": { name: "Элективная дисциплина", teacher: "Смирнов П.К.", room: "305", canEdit: true}
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
        this.currentWeek = Object.keys(scheduleData)[0];
        this.init();
    }

    init() {
        this.renderSchedule();
        this.renderStats();
        this.setupEventListeners();
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
            // ПРОВЕРЯЕМ ДОСТУП ПЕРЕД ОТКРЫТИЕМ ЖУРНАЛА
            if (!this.canEditLecture(day, time)) {
                this.showNotification('Редактирование посещаемости для прошедших пар недоступно', 'warning');
                return;
            }

            const lectureData = {
                day: day,
                time: time,
                name: lecture.name,
                teacher: lecture.teacher,
                room: lecture.room,
                week: this.currentWeek,
                canEdit: this.canEditLecture(day, time)
            };

            localStorage.setItem('currentLecture', JSON.stringify(lectureData));
            window.location.href = 'attendance.php';
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
    }

    // ... остальные методы остаются без изменений ...

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
        });

        document.getElementById('export-all').addEventListener('click', () => {
            alert('Отчет экспортирован в PDF');
        });

        document.getElementById('print-all').addEventListener('click', () => {
            window.print();
        });
    }

    changeWeek(direction) {
        alert(`Переход к ${direction > 0 ? 'следующей' : 'предыдущей'} неделе`);
    }

    // ДОБАВЛЯЕМ МЕТОД УВЕДОМЛЕНИЙ
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

document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Функция выхода из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}