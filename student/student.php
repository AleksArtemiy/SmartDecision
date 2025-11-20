<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'student') {
    header('Location: ../index.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал 2.0 - Личный кабинет студента</title>
    <link rel="stylesheet" href="../styles/student_styles.css">
    <link rel="stylesheet" href="../styles/style.css">
</head>
<body>
<!-- Шапка -->
<header class="header">
    <a href="../Headmen/index.html" class="logo">Журнал 2.0</a>
    <div class="user-menu">
        <span>Студент: Иванов А.С. | Группа: ПИ-201</span>
        <button class="btn btn-secondary" onclick="logout()">Выйти</button>
    </div>
</header>

<!-- Основной контент -->
<div class="container">
    <div class="dashboard">
        <!-- Расписание -->
        <div class="card">
            <div class="schedule-controls">
                <h2>Мое расписание</h2>
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
                    <span>Я присутствовал</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color missed"></div>
                    <span>Я отсутствовал</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color cancelled"></div>
                    <span>Пара отменена</span>
                </div>
            </div>

            <!-- КОНТЕЙНЕР ДЛЯ ГОРИЗОНТАЛЬНОЙ ПРОКРУТКИ - ДОБАВЛЕНО -->
            <div class="schedule-container" id="schedule-container">
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
        </div>

        <!-- Статистика по предметам -->
        <div class="card">
            <h2 style="margin-bottom: 1.5rem;">Статистика по предметам</h2>

            <!-- Общая статистика -->
            <div class="stats-overview">
                <div class="stat-card good">
                    <div class="stat-value good" id="total-attendance">87%</div>
                    <div class="stat-label">Общая посещаемость</div>
                    <div class="progress-bar">
                        <div class="progress-fill good" style="width: 87%"></div>
                    </div>
                </div>
            </div>

            <!-- Список предметов -->
            <h3 style="margin: 1.5rem 0 1rem 0;">Посещаемость по предметам</h3>
            <div class="subjects-list" id="subjects-stats">
                <!-- Список будет заполнен через JavaScript -->
            </div>
        </div>
    </div>
</div>

<script src="../js/student.js"></script>
</body>
</html>