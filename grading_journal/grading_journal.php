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
    <title>Журнал 2.0 - Журнал оценивания</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/teacher_styles.css">
    <link rel="stylesheet" href="../styles/grading_styles.css">
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
        <div class="grading-header">
            <h2 id="grading-title">Журнал оценивания</h2>
            <div class="lecture-info" id="lecture-info">
                <!-- Информация о паре будет заполнена через JavaScript -->
            </div>
        </div>

        <div class="grading-controls">
            <div class="control-group">
                <label for="grade-type">Тип оценки:</label>
                <select id="grade-type" class="form-select">
                    <option value="homework">Домашняя работа</option>
                    <option value="test">Контрольная работа</option>
                    <option value="activity">Активность на уроке</option>
                    <option value="project">Проект</option>
                    <option value="exam">Экзамен</option>
                </select>
            </div>
            <div class="control-group">
                <label for="max-grade">Максимальный балл:</label>
                <input type="number" id="max-grade" class="form-input" value="5" min="1" max="100">
            </div>
            <button class="btn btn-primary" id="apply-grades">Применить оценки</button>
        </div>

        <div class="students-grading-list" id="students-grading-list">
            <!-- Список студентов для оценивания -->
        </div>

        <div class="grading-actions">
            <button class="btn btn-success" id="save-grades">💾 Сохранить все оценки</button>
            <button class="btn btn-secondary" onclick="window.location.href='teacher.php'">← Назад к расписанию</button>
        </div>
    </div>
</div>

<script src="../js/grading_journal.js"></script>
</body>
</html>