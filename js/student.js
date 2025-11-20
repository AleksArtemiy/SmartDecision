// Данные расписания с персональной посещаемостью
const scheduleData = {
    "18 - 24 ноября 2024": {
        "Понедельник": {
            "9:00-10:30": { name: "Математический анализ", teacher: "Иванова А.С.", room: "301", status: "attended" },
            "10:30-12:00": { name: "Программирование", teacher: "Петров С.В.", room: "415", status: "attended" },
            "13:00-14:30": { name: "Базы данных", teacher: "Сидорова М.К.", room: "210", status: "missed" }
        },
        "Вторник": {
            "9:00-10:30": { name: "Физика", teacher: "Козлов Д.И.", room: "305", status: "attended" },
            "13:00-14:30": { name: "Английский язык", teacher: "Smith J.", room: "104", status: "cancelled" }
        },
        "Среда": {
            "10:30-12:00": { name: "Математический анализ", teacher: "Иванова А.С.", room: "301", status: "attended" },
            "14:30-16:00": { name: "Веб-разработка", teacher: "Петров С.В.", room: "415", status: "future" }
        },
        "Четверг": {
            "9:00-10:30": { name: "Алгоритмы", teacher: "Сидорова М.К.", room: "210", status: "attended" },
            "12:00-13:30": { name: "Физкультура", teacher: "Волков А.Н.", room: "Спортзал", status: "missed" }
        },
        "Пятница": {
            "11:00-12:30": { name: "Проектная деятельность", teacher: "Петров С.В.", room: "415", status: "future" },
            "14:30-16:00": { name: "Экономика", teacher: "Новикова Л.П.", room: "208", status: "future" }
        },
        "Суббота": {
            "9:00-10:30": { name: "Элективная дисциплина", teacher: "Смирнов П.К.", room: "305", status: "future" }
        }
    }
};

// Статистика по предметам
const subjectsData = [
    { name: "Математический анализ", teacher: "Иванова А.С.", attendance: 92, attended: 11, missed: 1, total: 12 },
    { name: "Программирование", teacher: "Петров С.В.", attendance: 88, attended: 7, missed: 1, total: 8 },
    { name: "Физика", teacher: "Козлов Д.И.", attendance: 85, attended: 6, missed: 1, total: 7 },
    { name: "Английский язык", teacher: "Smith J.", attendance: 80, attended: 4, missed: 1, total: 5 },
    { name: "Базы данных", teacher: "Сидорова М.К.", attendance: 75, attended: 3, missed: 1, total: 4 },
    { name: "Алгоритмы", teacher: "Сидорова М.К.", attendance: 90, attended: 9, missed: 1, total: 10 },
    { name: "Физкультура", teacher: "Волков А.Н.", attendance: 70, attended: 7, missed: 3, total: 10 }
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
const daysShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

class StudentDashboard {
    constructor() {
        this.currentWeek = Object.keys(scheduleData)[0];
        this.init();
    }

    init() {
        this.renderSchedule();
        this.renderSubjectsStats();
        this.setupEventListeners();
    }

    getAttendanceBadgeClass(attendance) {
        if (attendance >= 90) return 'good';
        if (attendance >= 75) return 'warning';
        return 'danger';
    }

    getAttendanceBadgeText(attendance) {
        if (attendance >= 90) return 'Отлично';
        if (attendance >= 75) return 'Хорошо';
        return 'Низкая';
    }

    renderSchedule() {
        const tbody = document.getElementById('schedule-body');
        const weekSchedule = scheduleData[this.currentWeek];

        tbody.innerHTML = timeSlots.map(time => {
            const row = document.createElement('tr');

            // Колонка времени
            const timeCell = document.createElement('td');
            timeCell.className = 'time-column';
            timeCell.textContent = time;
            row.appendChild(timeCell);

            // Колонки для каждого дня
            daysOfWeek.forEach((day, index) => {
                const dayCell = document.createElement('td');
                const daySchedule = weekSchedule[day] || {};
                const lecture = daySchedule[time];

                if (lecture) {
                    dayCell.innerHTML = `
                        <div class="lecture-cell ${lecture.status}"
                             data-time="${time}"
                             data-day="${day}">
                            ${lecture.status !== 'future' ? `<div class="attendance-status ${lecture.status}"></div>` : ''}
                            <div class="lecture-name">${lecture.name}</div>
                            <div class="lecture-details">
                                ${lecture.teacher}<br>
                                <span class="lecture-room">${lecture.room}</span>
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

    renderSubjectsStats() {
        const container = document.getElementById('subjects-stats');

        // Сортируем предметы по посещаемости (от лучшей к худшей)
        const sortedSubjects = [...subjectsData].sort((a, b) => b.attendance - a.attendance);

        container.innerHTML = sortedSubjects.map(subject => {
            const badgeClass = this.getAttendanceBadgeClass(subject.attendance);
            const badgeText = this.getAttendanceBadgeText(subject.attendance);

            return `
                <div class="subject-item">
                    <div class="subject-info">
                        <div class="subject-name">${subject.name}</div>
                        <div class="subject-teacher">${subject.teacher}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="progress-bar" style="width: 80px;">
                            <div class="progress-fill ${badgeClass}" style="width: ${subject.attendance}%"></div>
                        </div>
                        <span style="font-weight: 500; min-width: 40px;">${subject.attendance}%</span>
                        <span class="attendance-badge ${badgeClass}">${badgeText}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Обновляем общую статистику
        const totalAttendance = Math.round(sortedSubjects.reduce((sum, subject) => sum + subject.attendance, 0) / sortedSubjects.length);
        document.getElementById('total-attendance').textContent = totalAttendance + '%';
        document.querySelector('#total-attendance').closest('.stat-card').querySelector('.progress-fill').style.width = totalAttendance + '%';
    }

    setupEventListeners() {
        document.getElementById('prev-week').addEventListener('click', () => {
            this.changeWeek(-1);
        });

        document.getElementById('next-week').addEventListener('click', () => {
            this.changeWeek(1);
        });

        // Клики по ячейкам с парами (для просмотра деталей)
        document.addEventListener('click', (e) => {
            const lectureCell = e.target.closest('.lecture-cell:not(.empty)');
            if (lectureCell) {
                const time = lectureCell.dataset.time;
                const day = lectureCell.dataset.day;
                this.showLectureDetails(time, day);
            }
        });
    }

    showLectureDetails(time, day) {
        const weekSchedule = scheduleData[this.currentWeek];
        const daySchedule = weekSchedule[day];
        const lecture = daySchedule[time];

        if (lecture) {
            const statusText = {
                'attended': '✅ Вы присутствовали',
                'missed': '❌ Вы отсутствовали',
                'cancelled': '⚠️ Пара отменена',
                'future': '⏳ Пара еще не состоялась'
            };

            alert(`Детали пары:\n\n📅 День: ${day}\n⏰ Время: ${time}\n📚 Предмет: ${lecture.name}\n👨‍🏫 Преподаватель: ${lecture.teacher}\n🏫 Аудитория: ${lecture.room}\n\n${statusText[lecture.status]}`);
        }
    }

    changeWeek(direction) {
        alert(`Переход к ${direction > 0 ? 'следующей' : 'предыдущей'} неделе`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StudentDashboard();
});