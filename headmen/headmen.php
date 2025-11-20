<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал 2.0 - Расписание и Статистика</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/headmen_styles.css">
</head>
<body>
<!-- Шапка -->
<header class="header">
    <div class="logo">Журнал 2.0</div>
    <div class="user-menu">
        <span>Староста: Петров И.С. | Группа: ПИ-201</span>
    </div>
</header>

<!-- Основной контент -->
<div class="container">
    <!-- Дашборд с расписанием и статистикой -->
    <div class="dashboard">
        <!-- Расписание -->
        <div class="card">
            <div class="schedule-controls">
                <h2>Расписание занятий</h2>
                <div class="week-navigation">
                    <button class="btn btn-secondary" id="prev-week">← Пред.</button>
                    <div class="current-week" id="current-week">18 - 24 ноября 2024</div>
                    <button class="btn btn-secondary" id="next-week">След. →</button>
                </div>
            </div>

            <!-- Легенда -->
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color future"></div>
                    <span>Предстоящие</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color attended"></div>
                    <span>Посещена</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color missed"></div>
                    <span>Пропущена</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color partial"></div>
                    <span>Частично</span>
                </div>
            </div>

            <table class="schedule-table">
                <thead>
                <tr>
                    <th>Время</th>
                    <th>Пн</th>
                    <th>Вт</th>
                    <th>Ср</th>
                    <th>Чт</th>
                    <th>Пт</th>
                    <th>Сб</th>
                </tr>
                </thead>
                <tbody id="schedule-body">
                <!-- Таблица будет заполнена через JavaScript -->
                </tbody>
            </table>
        </div>

        <!-- Статистика -->
        <div class="card">
            <h2 style="margin-bottom: 1.5rem;">Статистика группы</h2>

            <!-- Общая статистика -->
            <div class="stats-overview">
                <div class="stat-card good">
                    <div class="stat-value good" id="total-attendance">87%</div>
                    <div class="stat-label">Общая посещаемость</div>
                    <div class="progress-bar">
                        <div class="progress-fill good" style="width: 87%"></div>
                    </div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-value warning" id="avg-per-student">84%</div>
                    <div class="stat-label">Средняя по студенту</div>
                    <div class="progress-bar">
                        <div class="progress-fill warning" style="width: 84%"></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="total-lectures">64</div>
                    <div class="stat-label">Всего пар</div>
                </div>
                <div class="stat-card danger">
                    <div class="stat-value danger" id="risk-count">3</div>
                    <div class="stat-label">В группе риска</div>
                </div>
            </div>

            <!-- Список студентов -->
            <h3 style="margin: 1.5rem 0 1rem 0;">Посещаемость студентов</h3>
            <div class="students-list" id="students-stats">
                <!-- Список будет заполнен через JavaScript -->
            </div>
        </div>
    </div>

    <!-- Кнопки действий -->
    <div class="button-group">
        <button class="btn btn-primary" id="export-all">Экспорт отчета</button>
        <button class="btn btn-secondary" id="print-all">Распечатать</button>
        <button class="btn btn-secondary" onclick="location.reload()">Обновить</button>
    </div>
</div>

<script src="../js/headmen.js"></script>
</body>
</html>