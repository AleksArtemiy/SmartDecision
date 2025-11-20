<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'headman') {
    header('Location: ../index.php');
    exit();
}

// Получаем данные о паре из localStorage (в реальном приложении - из БД)
$lecture_data = isset($_GET['lecture_data']) ? json_decode($_GET['lecture_data'], true) : null;
$can_edit = $lecture_data['canEdit'] ?? false;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал посещаемости 2.0</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/attendance_styles.css">
</head>
<body>
<!-- Шапка -->
<header class="header">
    <div class="logo">Журнал 2.0</div>
    <div class="user-menu">
        <span>Староста: Петров И.С.</span>
        <button class="btn btn-secondary" onclick="logout()">Выйти</button>
    </div>
</header>

<!-- Основной контент -->
<div class="container">
    <!-- Кнопка назад -->
    <a href="headmen.php" class="back-button">
        ← Назад к расписанию
    </a>

    <!-- Информация о текущей паре -->
    <div class="lecture-info">
        <div class="lecture-title" id="lecture-title">Математический анализ</div>
        <div id="lecture-time">10:30 - 12:00 • Аудитория 301</div>
        <div id="lecture-details">Преподаватель: Иванова А.С. • Группа: ПИ-201</div>
        <?php if (!$can_edit): ?>
            <div class="view-only-notice">
                🔒 Режим просмотра. Редактирование посещаемости для прошедших пар недоступно
            </div>
        <?php endif; ?>
    </div>

    <!-- Статистика -->
    <div class="stats-bar">
        <div class="stat-item">
            <div class="stat-value present" id="present-count">0</div>
            <div>Присутствуют</div>
        </div>
        <div class="stat-item">
            <div class="stat-value absent" id="absent-count">0</div>
            <div>Отсутствуют</div>
        </div>
        <div class="stat-item">
            <div class="stat-value" id="total-count">4</div>
            <div>Всего студентов</div>
        </div>
    </div>

    <!-- Поиск (только в режиме редактирования) -->
    <?php if ($can_edit): ?>
    <div class="search-box">
        <input type="text" class="search-input" placeholder="Поиск студента...">
    </div>
    <?php endif; ?>

    <!-- Список студентов -->
    <div class="card">
        <h2 style="margin-bottom: 1rem;">
            Список студентов
            <?php if (!$can_edit): ?>
                <span class="view-mode-badge">Только просмотр</span>
            <?php endif; ?>
        </h2>
        <div class="students-list" id="students-list">
            <!-- Студенты будут заполнены через JavaScript -->
        </div>

        <!-- Быстрые действия (только в режиме редактирования) -->
        <?php if ($can_edit): ?>
        <div class="quick-actions">
            <button class="btn btn-primary" id="mark-all-present">Отметить всех</button>
            <button class="btn btn-secondary" id="mark-all-absent">Все отсутствуют</button>
            <button class="btn btn-secondary" id="reset-all">Сбросить все</button>
            <button class="btn btn-primary" style="margin-left: auto;" id="save-changes">Сохранить изменения</button>
        </div>
        <?php else: ?>
        <div class="view-mode-actions">
            <button class="btn btn-secondary" onclick="window.location.href='headmen.php'">Вернуться к расписанию</button>
        </div>
        <?php endif; ?>
    </div>
</div>

<script>
    // Передаем PHP переменные в JavaScript
    const canEdit = <?php echo $can_edit ? 'true' : 'false'; ?>;
    const lectureData = <?php echo json_encode($lecture_data ?: []); ?>;
</script>

<script src="../js/attendance.js"></script>
</body>
</html>