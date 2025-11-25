// Внимание: это полностью обновлённый teacher.js с поддержкой типов занятий

// Данные расписания преподавателя (пример, можно заменить на загрузку с сервера)
const scheduleData = {
    "18 - 24 ноября 2024": {
        "Понедельник": {
            "9:00-10:30": {
                name: "Математический анализ",
                room: "301",
                status: "attended",
                type: "лекция",
                groups: ["ПИ-201"]
            },
            "13:00-14:30": {
                name: "Математический анализ",
                room: "301",
                status: "missed",
                type: "практика",
                groups: ["ПИ-202"]
            }
        },
        "Вторник": {
            "10:30-12:00": {
                name: "Высшая математика",
                room: "415",
                status: "attended",
                type: "лабораторная",
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

const timeSlots = ["9:00-10:30", "10:30-12:00", "13:00-14:30"];
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
                    dayCell.innerHTML = `
                        <div class="lecture-cell ${lecture.status}" 
                            data-time="${time}" 
                            data-day="${day}">
                            <div class="lecture-name">${lecture.name}</div>
                            <div class="lecture-details">
                                ${lecture.type ? `<div class="lecture-type">${lecture.type}</div>` : ''}
                                <div class="lecture-room">${lecture.room}</div>
                                <div class="lecture-groups">${lecture.groups.join(', ')}</div>
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

    showViewModal(day, time) {
        const weekSchedule = scheduleData[this.currentWeek];
        const lecture = weekSchedule[day][time];

        if (!lecture) return;

        this.currentLecture = { day, time, ...lecture };

        const modal = document.getElementById('view-modal');
        const modalTitle = document.getElementById('view-modal-title');
        const modalBody = document.getElementById('view-modal-body');

        modalTitle.textContent = `${lecture.name} - ${day}, ${time}`;

        const allStudents = [];
        lecture.groups.forEach(groupName => {
            (studentsData[groupName] || []).forEach(s => {
                allStudents.push({ ...s, group: groupName });
            });
        });

        const presentCount = allStudents.filter(s => s.status === 'present').length;
        const totalCount = allStudents.length;
        const attendancePercent = Math.round((presentCount / totalCount) * 100);

        modalBody.innerHTML = `
            <div class="lecture-info-grid" style="margin-bottom: 1.5rem;">
                <div class="info-item">
                    <label>📝 Тип занятия:</label>
                    <span>${lecture.type}</span>
                </div>
                <div class="info-item">
                    <label>🏫 Аудитория:</label>
                    <span>${lecture.room}</span>
                </div>
                <div class="info-item">
                    <label>👥 Группы:</label>
                    <span>${lecture.groups.join(', ')}</span>
                </div>
                <div class="info-item ${attendancePercent >= 80 ? 'success' : attendancePercent >= 60 ? 'warning' : 'danger'}">
                    <label>📊 Посещаемость:</label>
                    <span>${presentCount}/${totalCount} (${attendancePercent}%)</span>
                </div>
            </div>

            <div class="students-edit-list">
                ${allStudents.map(student => `
                    <div class="student-view-item ${student.status}" data-id="${student.id}" data-group="${student.group}">
                        <div>
                            <strong>${student.name}</strong><br>
                            <small style="color: var(--gray-600);">${student.group}</small>
                        </div>
                        <div style="font-weight: 600; color: ${student.status === 'present' ? 'var(--success)' : 'var(--danger)'}">
                            ${student.status === 'present' ? '✅ Присутствовал' : '❌ Отсутствовал'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        modal.classList.add('active');
    }

    setupEventListeners() {
        document.addEventListener('click', e => {
            const lectureCell = e.target.closest('.lecture-cell:not(.empty)');
            if (lectureCell) {
                this.showViewModal(lectureCell.dataset.day, lectureCell.dataset.time);
            }
        });

        document.getElementById('close-view-modal').addEventListener('click', () => {
            document.getElementById('view-modal').classList.remove('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TeacherDashboard();
});

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = '../logout.php';
    }
}
