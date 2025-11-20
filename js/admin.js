// Данные для админпанели
const adminData = {
    groups: [
        { name: "ПИ-201", faculty: "ФИТ", course: 2, students: 25, attendance: 87, riskCount: 2 },
        { name: "ПИ-202", faculty: "ФИТ", course: 2, students: 24, attendance: 78, riskCount: 5 },
        { name: "ПИ-203", faculty: "ФИТ", course: 2, students: 23, attendance: 92, riskCount: 1 },
        { name: "ИВТ-201", faculty: "ФИТ", course: 2, students: 28, attendance: 81, riskCount: 3 },
        { name: "МАТ-101", faculty: "МФ", course: 1, students: 30, attendance: 75, riskCount: 8 },
        { name: "ФИЗ-101", faculty: "МФ", course: 1, students: 26, attendance: 69, riskCount: 7 },
        { name: "ЭК-201", faculty: "ЭФ", course: 2, students: 22, attendance: 85, riskCount: 2 },
        { name: "МЕН-301", faculty: "ЭФ", course: 3, students: 20, attendance: 88, riskCount: 1 }
    ],
    students: [
        { name: "Иванов Алексей", group: "ПИ-201", id: "201001", attendance: 95, present: 57, absent: 3 },
        { name: "Петрова Мария", group: "ПИ-201", id: "201002", attendance: 88, present: 53, absent: 7 },
        { name: "Сидоров Владимир", group: "ПИ-202", id: "201003", attendance: 67, present: 40, absent: 20 },
        { name: "Козлова Анна", group: "ПИ-202", id: "201004", attendance: 78, present: 47, absent: 13 },
        { name: "Николаев Дмитрий", group: "ПИ-203", id: "201005", attendance: 92, present: 55, absent: 5 },
        { name: "Орлова Екатерина", group: "ИВТ-201", id: "201006", attendance: 81, present: 49, absent: 11 },
        { name: "Федоров Максим", group: "МАТ-101", id: "201007", attendance: 45, present: 27, absent: 33 },
        { name: "Семенова Ирина", group: "ФИЗ-101", id: "201008", attendance: 72, present: 43, absent: 17 }
    ],
    teachers: [
        { name: "Иванова Анна Сергеевна", position: "Доцент", faculty: "ФИТ", groups: 8, subjects: 3, attendance: 84 },
        { name: "Петров Сергей Владимирович", position: "Профессор", faculty: "ФИТ", groups: 6, subjects: 2, attendance: 79 },
        { name: "Сидорова Мария Константиновна", position: "Старший преподаватель", faculty: "ФИТ", groups: 4, subjects: 2, attendance: 88 },
        { name: "Козлов Дмитрий Иванович", position: "Доцент", faculty: "МФ", groups: 5, subjects: 1, attendance: 72 },
        { name: "Новикова Лариса Петровна", position: "Профессор", faculty: "ЭФ", groups: 3, subjects: 1, attendance: 85 }
    ]
};

class AdminDashboard {
    constructor() {
        this.currentTab = 'groups';
        this.init();
    }

    init() {
        this.renderGroups();
        this.renderStudents();
        this.renderTeachers();
        this.setupEventListeners();
    }

    getAttendanceStatus(attendance) {
        if (attendance >= 85) return { class: 'good', text: 'Высокая' };
        if (attendance >= 70) return { class: 'warning', text: 'Средняя' };
        return { class: 'danger', text: 'Низкая' };
    }

    renderGroups() {
        const tbody = document.getElementById('groups-body');

        tbody.innerHTML = adminData.groups.map(group => {
            const status = this.getAttendanceStatus(group.attendance);

            return `
                <tr>
                    <td><strong>${group.name}</strong></td>
                    <td>${group.faculty}</td>
                    <td>${group.course} курс</td>
                    <td>${group.students}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="progress-bar" style="width: 80px;">
                                <div class="progress-fill ${status.class}" style="width: ${group.attendance}%"></div>
                            </div>
                            <span>${group.attendance}%</span>
                        </div>
                    </td>
                    <td>${group.riskCount} студентов</td>
                    <td>
                        <span class="status-badge ${status.class}">${status.text}</span>
                    </td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Подробнее</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderStudents() {
        const tbody = document.getElementById('students-body');
        const groupFilter = document.getElementById('group-filter');

        // Заполняем фильтр групп
        const uniqueGroups = [...new Set(adminData.students.map(s => s.group))];
        groupFilter.innerHTML = '<option value="all">Все группы</option>' +
            uniqueGroups.map(group => `<option value="${group}">${group}</option>`).join('');

        tbody.innerHTML = adminData.students.map(student => {
            const status = this.getAttendanceStatus(student.attendance);

            return `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.group}</td>
                    <td>${student.id}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="progress-bar" style="width: 80px;">
                                <div class="progress-fill ${status.class}" style="width: ${student.attendance}%"></div>
                            </div>
                            <span>${student.attendance}%</span>
                        </div>
                    </td>
                    <td>${student.present}</td>
                    <td>${student.absent}</td>
                    <td>
                        <span class="status-badge ${status.class}">${status.text}</span>
                    </td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">История</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderTeachers() {
        const tbody = document.getElementById('teachers-body');

        tbody.innerHTML = adminData.teachers.map(teacher => {
            const status = this.getAttendanceStatus(teacher.attendance);

            return `
                <tr>
                    <td><strong>${teacher.name}</strong></td>
                    <td>${teacher.position}</td>
                    <td>${teacher.faculty}</td>
                    <td>${teacher.groups}</td>
                    <td>${teacher.subjects}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="progress-bar" style="width: 80px;">
                                <div class="progress-fill ${status.class}" style="width: ${teacher.attendance}%"></div>
                            </div>
                            <span>${teacher.attendance}%</span>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Нагрузка</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    setupEventListeners() {
        // Переключение вкладок
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Кнопки экспорта
        document.getElementById('export-groups').addEventListener('click', () => {
            alert('Экспорт данных по группам в Excel');
        });

        document.getElementById('export-students').addEventListener('click', () => {
            alert('Экспорт данных по студентам в Excel');
        });

        document.getElementById('generate-report').addEventListener('click', () => {
            alert('Формирование общего отчета...');
        });

        document.getElementById('export-all-data').addEventListener('click', () => {
            alert('Экспорт всех данных системы');
        });

        // Кнопки добавления
        document.getElementById('add-group').addEventListener('click', () => {
            alert('Добавление новой учебной группы');
        });

        document.getElementById('add-student').addEventListener('click', () => {
            alert('Добавление нового студента');
        });

        document.getElementById('add-teacher').addEventListener('click', () => {
            alert('Добавление нового преподавателя');
        });

        // Сортировка таблиц
        document.querySelectorAll('.data-table th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const table = th.closest('table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const sortField = th.dataset.sort;

                rows.sort((a, b) => {
                    const aValue = a.cells[Array.from(th.parentNode.cells).indexOf(th)].textContent;
                    const bValue = b.cells[Array.from(th.parentNode.cells).indexOf(th)].textContent;
                    return aValue.localeCompare(bValue);
                });

                tbody.innerHTML = '';
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    }

    switchTab(tabId) {
        // Обновляем активную вкладку
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
        this.currentTab = tabId;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});