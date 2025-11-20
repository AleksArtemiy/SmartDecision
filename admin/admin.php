<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    header('Location: ../index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал 2.0 - Панель администратора</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/admin_styles.css">
</head>
<body>
<!-- Шапка -->
<header class="header">
    <a href="../headmen/index.php" class="logo">Журнал 2.0 - Админпанель</a>
    <div class="user-menu">
        <span>Администратор: Деканат</span>
        <button class="btn btn-secondary" onclick="logout()">Выйти</button>
    </div>
</header>

<!-- Основной контент -->
<div class="container">
    <!-- Общая статистика -->
    <div class="stats-grid">
        <div class="stat-card good">
            <div class="stat-value good">1,247</div>
            <div class="stat-label">Всего студентов</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">84</div>
            <div class="stat-label">Учебных групп</div>
        </div>
        <div class="stat-card warning">
            <div class="stat-value warning">78%</div>
            <div class="stat-label">Общая посещаемость</div>
            <div class="progress-bar">
                <div class="progress-fill warning" style="width: 78%"></div>
            </div>
        </div>
        <div class="stat-card danger">
            <div class="stat-value danger">67</div>
            <div class="stat-label">Студентов в группе риска</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">42</div>
            <div class="stat-label">Преподавателей</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">156</div>
            <div class="stat-label">Учебных дисциплин</div>
        </div>
    </div>

    <!-- Вкладки -->
    <div class="tabs">
        <div class="tab active" data-tab="groups">Группы</div>
        <div class="tab" data-tab="students">Студенты</div>
        <div class="tab" data-tab="teachers">Преподаватели</div>
        <div class="tab" data-tab="reports">Отчеты</div>
    </div>

    <!-- Вкладка Группы -->
    <div id="groups" class="tab-content active">
        <div class="actions-bar">
            <h2>Учебные группы</h2>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" id="export-groups">Экспорт</button>
                <button class="btn btn-success" id="add-group">Добавить группу</button>
            </div>
        </div>

        <div class="filters">
            <div class="filter-group">
                <label class="filter-label">Факультет:</label>
                <select id="faculty-filter">
                    <option value="all">Все факультеты</option>
                    <option value="fit">ФИТ</option>
                    <option value="ef">ЭФ</option>
                    <option value="mf">МФ</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Курс:</label>
                <select id="course-filter">
                    <option value="all">Все курсы</option>
                    <option value="1">1 курс</option>
                    <option value="2">2 курс</option>
                    <option value="3">3 курс</option>
                    <option value="4">4 курс</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Статус:</label>
                <select id="status-filter">
                    <option value="all">Все статусы</option>
                    <option value="good">Хорошая посещаемость</option>
                    <option value="warning">Средняя посещаемость</option>
                    <option value="danger">Низкая посещаемость</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Поиск:</label>
                <input type="text" id="group-search" placeholder="Поиск по группам...">
            </div>
        </div>

        <div class="table-container">
            <table class="data-table" id="groups-table">
                <thead>
                <tr>
                    <th data-sort="name">Группа</th>
                    <th data-sort="faculty">Факультет</th>
                    <th data-sort="course">Курс</th>
                    <th data-sort="students">Студентов</th>
                    <th data-sort="attendance">Посещаемость</th>
                    <th data-sort="risk">В группе риска</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody id="groups-body">
                <!-- Данные будут заполнены через JavaScript -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Вкладка Студенты -->
    <div id="students" class="tab-content">
        <div class="actions-bar">
            <h2>Студенты</h2>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" id="export-students">Экспорт</button>
                <button class="btn btn-success" id="add-student">Добавить студента</button>
            </div>
        </div>

        <div class="filters">
            <div class="filter-group">
                <label class="filter-label">Группа:</label>
                <select id="group-filter">
                    <option value="all">Все группы</option>
                    <!-- Группы будут заполнены через JavaScript -->
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Статус:</label>
                <select id="student-status-filter">
                    <option value="all">Все статусы</option>
                    <option value="good">Хорошая посещаемость</option>
                    <option value="warning">Средняя посещаемость</option>
                    <option value="danger">В группе риска</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Поиск:</label>
                <input type="text" id="student-search" placeholder="Поиск по студентам...">
            </div>
        </div>

        <div class="table-container">
            <table class="data-table" id="students-table">
                <thead>
                <tr>
                    <th data-sort="name">Студент</th>
                    <th data-sort="group">Группа</th>
                    <th data-sort="id">№ студенческого</th>
                    <th data-sort="attendance">Посещаемость</th>
                    <th data-sort="present">Присутствовал</th>
                    <th data-sort="absent">Пропущено</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody id="students-body">
                <!-- Данные будут заполнены через JavaScript -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Вкладка Преподаватели -->
    <div id="teachers" class="tab-content">
        <div class="actions-bar">
            <h2>Преподаватели</h2>
            <button class="btn btn-success" id="add-teacher">Добавить преподавателя</button>
        </div>

        <div class="table-container">
            <table class="data-table" id="teachers-table">
                <thead>
                <tr>
                    <th>Преподаватель</th>
                    <th>Должность</th>
                    <th>Факультет</th>
                    <th>Групп</th>
                    <th>Дисциплин</th>
                    <th>Средняя посещаемость</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody id="teachers-body">
                <!-- Данные будут заполнены через JavaScript -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Вкладка Отчеты -->
    <div id="reports" class="tab-content">
        <div class="actions-bar">
            <h2>Отчеты и аналитика</h2>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" id="generate-report">Сформировать отчет</button>
                <button class="btn btn-secondary" id="export-all-data">Экспорт всех данных</button>
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 1rem;">Быстрые отчеты</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                <div class="stat-card">
                    <div class="stat-value">📊</div>
                    <div class="stat-label">Отчет по посещаемости</div>
                    <button class="btn btn-secondary" style="margin-top: 1rem; width: 100%;">Скачать PDF</button>
                </div>
                <div class="stat-card">
                    <div class="stat-value">📈</div>
                    <div class="stat-label">Аналитика по факультетам</div>
                    <button class="btn btn-secondary" style="margin-top: 1rem; width: 100%;">Скачать Excel</button>
                </div>
                <div class="stat-card">
                    <div class="stat-value">⚠️</div>
                    <div class="stat-label">Студенты группы риска</div>
                    <button class="btn btn-secondary" style="margin-top: 1rem; width: 100%;">Скачать отчет</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="../js/admin.js"></script>
</body>
</html>