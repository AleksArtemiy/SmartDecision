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
    <title>Журнал 2.0 - Таблица успеваемости</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/teacher_styles.css">
    <link rel="stylesheet" href="../styles/grading_table_styles.css">
</head>
<body>
<header class="header">
    <a href="teacher.php" class="logo">← Назад к расписанию</a>
    <div class="user-menu">
        <span>Преподаватель: Иванова А.С.</span>
        <button class="btn btn-secondary" onclick="logout()">Выйти</button>
    </div>
</header>

<div class="container">
    <div class="card">
        <div class="grading-table-header">
            <h2>📊 Таблица успеваемости</h2>
            <div class="table-controls">
                <div class="control-group">
                    <label for="subject-select">Предмет:</label>
                    <select id="subject-select" class="form-select">
                        <option value="all">Все предметы</option>
                        <option value="Математический анализ" selected>Математический анализ</option>
                        <option value="Высшая математика">Высшая математика</option>
                    </select>
                </div>
                <div class="control-group">
                    <label for="group-select">Группа:</label>
                    <select id="group-select" class="form-select">
                        <option value="all">Все группы</option>
                        <option value="ПИ-201" selected>ПИ-201</option>
                        <option value="ПИ-202">ПИ-202</option>
                        <option value="МАТ-101">МАТ-101</option>
                    </select>
                </div>
                <button class="btn btn-primary" id="apply-filters">Применить</button>
            </div>
        </div>

        <div class="grading-table-container">
            <table class="grading-table" id="grading-table">
                <thead>
                    <tr>
                        <th rowspan="2" class="student-col">Студент</th>
                        <!-- Заголовки занятий будут заполнены через JavaScript -->
                    </tr>
                    <tr>
                        <!-- Подзаголовки с типом занятия будут здесь -->
                    </tr>
                </thead>
                <tbody id="grading-table-body">
                    <!-- Данные студентов будут здесь -->
                </tbody>
            </table>
        </div>

        <div class="table-legend">
            <div class="legend-item">
                <div class="legend-color present"></div>
                <span>Присутствовал</span>
            </div>
            <div class="legend-item">
                <div class="legend-color absent"></div>
                <span>Отсутствовал</span>
            </div>
            <div class="legend-item">
                <div class="legend-color partial"></div>
                <span>Частично присутствовал</span>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно для редактирования оценки -->
<div class="grade-edit-modal" id="grade-edit-modal">
    <div class="grade-edit-modal-content">
        <div class="modal-header">
            <div class="modal-title" id="grade-edit-title">Редактирование оценки</div>
            <button class="close-modal" id="close-grade-modal">×</button>
        </div>
        <div class="modal-body">
            <div class="student-info" id="grade-student-info"></div>
            <div class="lecture-info" id="grade-lecture-info"></div>
            
            <div class="grade-form">
                <div class="form-group">
                    <label for="grade-value">Оценка:</label>
                    <input type="number" id="grade-value" class="form-input" min="0" max="100" step="1">
                </div>
                <div class="form-group">
                    <label for="grade-type">Тип оценки:</label>
                    <select id="grade-type" class="form-select">
                        <option value="homework">Домашняя работа</option>
                        <option value="test">Контрольная работа</option>
                        <option value="activity">Активность</option>
                        <option value="project">Проект</option>
                        <option value="exam">Экзамен</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-danger" id="delete-grade">🗑️ Удалить оценку</button>
            <button class="btn btn-secondary" id="cancel-grade">Отмена</button>
            <button class="btn btn-primary" id="save-grade">💾 Сохранить</button>
        </div>
    </div>
</div>

<script src="../js/grading_table.js"></script>
</body>
</html>