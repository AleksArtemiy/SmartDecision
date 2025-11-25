<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'teacher') {
    header('Location: ../index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал 2.0 - Кабинет преподавателя</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/teacher_styles.css">
</head>
<body>
<!-- Шапка -->
<header class="header">
    <a href="../headmen/index.html" class="logo">Журнал 2.0</a>
    <div class="user-menu">
        <span>Преподаватель: Иванова А.С.</span>
        <button class="btn btn-secondary" onclick="logout()">Выйти</button>
    </div>
</header>

<div class="container">
    <div class="dashboard">
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
                    <span>Предстоящие пары</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color attended"></div>
                    <span>Студенты присутствовали</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color missed"></div>
                    <span>Студенты отсутствовали</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color partial"></div>
                    <span>Частичное посещение</span>
                </div>
            </div>

            <!-- КОНТЕЙНЕР ДЛЯ ГОРИЗОНТАЛЬНОЙ ПРОКРУТКИ -->
            <div class="schedule-container">
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
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <h2 style="margin-bottom: 1.5rem;">Моя статистика</h2>
            <div class="stats-overview">
                <div class="stat-card good">
                    <div class="stat-value good" id="total-groups">12</div>
                    <div class="stat-label">Групп всего</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="total-lectures">24</div>
                    <div class="stat-label">Пар в неделю</div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-value warning" id="avg-attendance">78%</div>
                    <div class="stat-label">Средняя посещаемость</div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно просмотра -->
<div class="view-modal" id="view-modal">
    <div class="view-modal-content">
        <div class="modal-header">
            <div class="modal-title" id="view-modal-title">Посещаемость</div>
            <button class="close-modal" id="close-view-modal">×</button>
        </div>

        <div id="view-modal-body">
            <!-- Содержимое будет заполнено через JavaScript -->
        </div>

        <div class="modal-actions">
            <button class="btn btn-primary" id="grading-journal-btn">📊 Журнал оценивания</button>
            <button class="btn btn-primary" id="force-edit-btn">Принудительно изменить</button>
            <button class="btn btn-secondary" id="close-view-btn">Закрыть</button>
        </div>
    </div>
</div>

<!-- Модальное окно редактирования -->
<div class="edit-modal" id="edit-modal">
    <div class="edit-modal-content">
        <div class="modal-header">
            <div class="modal-title" id="edit-modal-title">Редактирование посещаемости</div>
            <button class="close-modal" id="close-edit-modal">×</button>
        </div>

        <div class="edit-notice">
            📝 Режим редактирования. Кликните на студента для изменения статуса
        </div>

        <div id="edit-modal-body">
            <!-- Содержимое будет заполнено через JavaScript -->
        </div>

        <div class="quick-actions">
            <button class="btn btn-secondary" id="cancel-edit">Отмена</button>
            <button class="btn btn-success" id="save-edit-changes">Подтвердить изменения</button>
        </div>
    </div>
</div>

<script src="../js/teacher.js"></script>
</body>
</html>