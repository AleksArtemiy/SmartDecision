// Данные расписания с персональной посещаемостью
const scheduleData = {
    "18 - 24 ноября 2024": {
        "Понедельник": {
            "9:00-10:30": { name: "Математический анализ", teacher: "Иванова А.С.", room: "3301", status: "attended", type: "лекция" },
            "10:30-12:00": { name: "Программирование", teacher: "Петров С.В.", room: "4215", status: "attended", type: "практика" },
            "13:00-14:30": { name: "Базы данных", teacher: "Сидорова М.К.", room: "2410", status: "missed", type: "лабораторная" }
        },
        "Вторник": {
            "9:00-10:30": { name: "Физика", teacher: "Козлов Д.И.", room: "3305", status: "attended", type: "лекция" },
            "13:00-14:30": { name: "Английский язык", teacher: "Smith J.", room: "1304", status: "cancelled", type: "практика" }
        },
        "Среда": {
            "10:30-12:00": { name: "Математический анализ", teacher: "Иванова А.С.", room: "3301", status: "attended", type: "практика" },
            "14:30-16:00": { name: "Веб-разработка", teacher: "Петров С.В.", room: "4215", status: "future", type: "лабораторная" }
        },
        "Четверг": {
            "9:00-10:30": { name: "Алгоритмы", teacher: "Сидорова М.К.", room: "1010", status: "attended", type: "лекция" },
            "12:00-13:30": { name: "Физкультура", teacher: "Волков А.Н.", room: "Спортзал", status: "missed", type: "практика" }
        },
        "Пятница": {
            "11:00-12:30": { name: "Проектная деятельность", teacher: "Петров С.В.", room: "4215", status: "future", type: "семинар" },
            "14:30-16:00": { name: "Экономика", teacher: "Новикова Л.П.", room: "1108", status: "future", type: "лекция" }
        },
        "Суббота": {
            "9:00-10:30": { name: "Элективная дисциплина", teacher: "Смирнов П.К.", room: "3305", status: "future", type: "лекция" }
        }
    },
    "25 ноября - 1 декабря 2024": {
        "Понедельник": {
            "9:00-10:30": { name: "Математический анализ", teacher: "Иванова А.С.", room: "3301", status: "future", type: "лекция" },
            "13:00-14:30": { name: "Программирование", teacher: "Петров С.В.", room: "4215", status: "future", type: "практика" }
        },
        "Вторник": {
            "10:30-12:00": { name: "Базы данных", teacher: "Сидорова М.К.", room: "2510", status: "future", type: "лабораторная" }
        },
        "Среда": {
            "9:00-10:30": { name: "Физика", teacher: "Козлов Д.И.", room: "305", status: "future", type: "лекция" },
            "14:30-16:00": { name: "Английский язык", teacher: "Smith J.", room: "1304", status: "future", type: "практика" }
        }
    }
};

// Статистика по предметам
const subjectsData = [
    { name: "Математический анализ", teacher: "Иванова А.С.", attendance: 92, attended: 11, missed: 1, total: 12, color: "#3B82F6" },
    { name: "Программирование", teacher: "Петров С.В.", attendance: 88, attended: 7, missed: 1, total: 8, color: "#10B981" },
    { name: "Физика", teacher: "Козлов Д.И.", attendance: 85, attended: 6, missed: 1, total: 7, color: "#EF4444" },
    { name: "Английский язык", teacher: "Smith J.", attendance: 80, attended: 4, missed: 1, total: 5, color: "#8B5CF6" },
    { name: "Базы данных", teacher: "Сидорова М.К.", attendance: 75, attended: 3, missed: 1, total: 4, color: "#F59E0B" },
    { name: "Алгоритмы", teacher: "Сидорова М.К.", attendance: 90, attended: 9, missed: 1, total: 10, color: "#06B6D4" },
    { name: "Физкультура", teacher: "Волков А.Н.", attendance: 70, attended: 7, missed: 3, total: 10, color: "#84CC16" }
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
        this.weeks = Object.keys(scheduleData);
        this.currentWeekIndex = 0;
        this.currentWeek = this.weeks[this.currentWeekIndex];
        this.init();
    }

    init() {
        this.renderSchedule();
        this.renderSubjectsStats();
        this.setupEventListeners();
        this.updateNavigationButtons();
        this.createLectureModal();
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

    getStatusIcon(status) {
        const icons = {
            'attended': '✅',
            'missed': '❌',
            'cancelled': '⚠️',
            'future': '⏳'
        };
        return icons[status] || '📅';
    }

    getTypeIcon(type) {
        const icons = {
            'лекция': '📚',
            'практика': '💻',
            'лабораторная': '🔬',
            'семинар': '👥'
        };
        return icons[type] || '📅';
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
            timeCell.title = `Временной интервал: ${time}`;
            row.appendChild(timeCell);

            // Колонки для каждого дня
            daysOfWeek.forEach((day, index) => {
                const dayCell = document.createElement('td');
                const daySchedule = weekSchedule[day] || {};
                const lecture = daySchedule[time];

                if (lecture) {
                    const statusIcon = this.getStatusIcon(lecture.status);
                    const typeIcon = this.getTypeIcon(lecture.type);

                    dayCell.innerHTML = `
                        <div class="lecture-cell ${lecture.status}"
                             data-time="${time}"
                             data-day="${day}"
                             data-subject="${lecture.name}"
                             title="Кликните для деталей">
                            ${lecture.status !== 'future' ? `<div class="attendance-status ${lecture.status}"></div>` : ''}
                            <div class="lecture-name">
                                <span class="type-icon">${typeIcon}</span>
                                ${lecture.name}
                            </div>
                            <div class="lecture-details">
                                ${lecture.teacher}<br>
                                <span class="lecture-room">${lecture.room}</span>
                                ${lecture.status !== 'future' ? `<div class="status-indicator">${statusIcon}</div>` : ''}
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

    renderSubjectsStats() {
        const container = document.getElementById('subjects-stats');

        // Сортируем предметы по посещаемости (от лучшей к худшей)
        const sortedSubjects = [...subjectsData].sort((a, b) => b.attendance - a.attendance);

        container.innerHTML = sortedSubjects.map(subject => {
            const badgeClass = this.getAttendanceBadgeClass(subject.attendance);
            const badgeText = this.getAttendanceBadgeText(subject.attendance);

            return `
                <div class="subject-item" data-subject="${subject.name}">
                    <div class="subject-info">
                        <div class="subject-name">${subject.name}</div>
                        <div class="subject-teacher">${subject.teacher}</div>
                        <div class="subject-stats">
                            Посещено: ${subject.attended} из ${subject.total} пар
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="progress-bar" style="width: 100px;" title="${subject.attendance}% посещаемости">
                            <div class="progress-fill ${badgeClass}" style="width: ${subject.attendance}%"></div>
                        </div>
                        <span style="font-weight: 600; min-width: 45px; color: var(--gray-700);">${subject.attendance}%</span>
                        <span class="attendance-badge ${badgeClass}">${badgeText}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Обновляем общую статистику
        this.updateOverallStats(sortedSubjects);
    }

    updateOverallStats(subjects) {
        const totalAttendance = Math.round(subjects.reduce((sum, subject) => sum + subject.attendance, 0) / subjects.length);
        const totalAttended = subjects.reduce((sum, subject) => sum + subject.attended, 0);
        const totalMissed = subjects.reduce((sum, subject) => sum + subject.missed, 0);
        const totalClasses = subjects.reduce((sum, subject) => sum + subject.total, 0);

        const overallElement = document.getElementById('total-attendance');
        const progressFill = document.querySelector('#total-attendance').closest('.stat-card').querySelector('.progress-fill');
        const statCard = overallElement.closest('.stat-card');

        overallElement.textContent = totalAttendance + '%';
        progressFill.style.width = totalAttendance + '%';

        // Обновляем классы в зависимости от процента
        const badgeClass = this.getAttendanceBadgeClass(totalAttendance);
        statCard.className = `stat-card ${badgeClass}`;
        overallElement.className = `stat-value ${badgeClass}`;
        progressFill.className = `progress-fill ${badgeClass}`;

        // Добавляем дополнительную информацию
        const statLabel = statCard.querySelector('.stat-label');
        statLabel.innerHTML = `Общая посещаемость<br>
                              <small style="font-size: 0.8rem; opacity: 0.8;">
                                  Посещено: ${totalAttended} пар, Пропущено: ${totalMissed} пар
                              </small>`;
    }

    setupEventListeners() {
        // Навигация по неделям
        document.getElementById('prev-week').addEventListener('click', () => {
            this.changeWeek(-1);
        });

        document.getElementById('next-week').addEventListener('click', () => {
            this.changeWeek(1);
        });

        // Клики по ячейкам с парами
        document.addEventListener('click', (e) => {
            const lectureCell = e.target.closest('.lecture-cell:not(.empty)');
            if (lectureCell) {
                const time = lectureCell.dataset.time;
                const day = lectureCell.dataset.day;
                this.showLectureDetails(time, day);
            }

            // Клики по предметам в статистике
            const subjectItem = e.target.closest('.subject-item');
            if (subjectItem) {
                const subjectName = subjectItem.dataset.subject;
                this.showSubjectDetails(subjectName);
            }
        });

        // Обработка клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.changeWeek(-1);
            } else if (e.key === 'ArrowRight') {
                this.changeWeek(1);
            } else if (e.key === 'Escape') {
                this.hideLectureModal();
            }
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
            // Показываем уведомление, если недели нет
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

    showLectureDetails(time, day) {
        const weekSchedule = scheduleData[this.currentWeek];
        const daySchedule = weekSchedule[day];
        const lecture = daySchedule[time];

        if (lecture) {
            const statusInfo = {
                'attended': { text: 'Вы присутствовали', class: 'success', icon: '✅' },
                'missed': { text: 'Вы отсутствовали', class: 'danger', icon: '❌' },
                'cancelled': { text: 'Пара отменена', class: 'warning', icon: '⚠️' },
                'future': { text: 'Пара еще не состоялась', class: 'info', icon: '⏳' }
            };

            const status = statusInfo[lecture.status];
            const typeIcon = this.getTypeIcon(lecture.type);

            const modalContent = `
                <div class="modal-header">
                    <h3>${typeIcon} ${lecture.name}</h3>
                    <button class="close-modal" onclick="studentDashboard.hideLectureModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="lecture-info-grid">
                        <div class="info-item">
                            <label>📅 День:</label>
                            <span>${day}</span>
                        </div>
                        <div class="info-item">
                            <label>⏰ Время:</label>
                            <span>${time}</span>
                        </div>
                        <div class="info-item">
                            <label>👨‍🏫 Преподаватель:</label>
                            <span>${lecture.teacher}</span>
                        </div>
                        <div class="info-item">
                            <label>🏫 Аудитория:</label>
                            <span>${lecture.room}</span>
                        </div>
                        <div class="info-item">
                            <label>📝 Тип занятия:</label>
                            <span>${lecture.type}</span>
                        </div>
                        <div class="info-item status ${status.class}">
                            <label>${status.icon} Статус:</label>
                            <span>${status.text}</span>
                        </div>
                    </div>
                    ${lecture.status === 'missed' ? `
                    <div class="missed-warning">
                        <strong>⚠️ Обратите внимание:</strong> Пропуск пары может повлиять на вашу успеваемость.
                    </div>
                    ` : ''}
                </div>
            `;

            this.showLectureModal(modalContent);
        }
    }

    showSubjectDetails(subjectName) {
        const subject = subjectsData.find(s => s.name === subjectName);
        if (subject) {
            const badgeClass = this.getAttendanceBadgeClass(subject.attendance);

            const modalContent = `
                <div class="modal-header">
                    <h3>📊 ${subject.name}</h3>
                    <button class="close-modal" onclick="studentDashboard.hideLectureModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="subject-details">
                        <div class="detail-item">
                            <label>Преподаватель:</label>
                            <span>${subject.teacher}</span>
                        </div>
                        <div class="detail-item">
                            <label>Общая посещаемость:</label>
                            <span class="attendance-value ${badgeClass}">${subject.attendance}%</span>
                        </div>
                        <div class="stats-grid">
                            <div class="stat-box attended">
                                <div class="stat-number">${subject.attended}</div>
                                <div class="stat-label">Посещено пар</div>
                            </div>
                            <div class="stat-box missed">
                                <div class="stat-number">${subject.missed}</div>
                                <div class="stat-label">Пропущено пар</div>
                            </div>
                            <div class="stat-box total">
                                <div class="stat-number">${subject.total}</div>
                                <div class="stat-label">Всего пар</div>
                            </div>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar large">
                                <div class="progress-fill ${badgeClass}" style="width: ${subject.attendance}%"></div>
                            </div>
                            <div class="progress-text">${subject.attendance}% посещаемости</div>
                        </div>
                    </div>
                </div>
            `;

            this.showLectureModal(modalContent);
        }
    }

    createLectureModal() {
        // Создаем модальное окно, если его нет
        if (!document.getElementById('lecture-modal')) {
            const modal = document.createElement('div');
            modal.id = 'lecture-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div id="modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Закрытие по клику вне модального окна
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideLectureModal();
                }
            });
        }
    }

    showLectureModal(content) {
        const modal = document.getElementById('lecture-modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideLectureModal() {
        const modal = document.getElementById('lecture-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

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
let studentDashboard;

document.addEventListener('DOMContentLoaded', () => {
    studentDashboard = new StudentDashboard();
});

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        // Показываем индикатор загрузки
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Выход...';
        button.disabled = true;

        setTimeout(() => {
            window.location.href = '../logout.php';
        }, 1000);
    }
}

// Добавляем глобальные функции для использования в HTML
window.studentDashboard = studentDashboard;
window.logout = logout;